import "dotenv/config";
import { extname } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import { RESOURCE_CATEGORIES } from "../src/data/resources";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "youthschool-site";
const SOURCE_USER_AGENT =
  "Mozilla/5.0 (compatible; YouthschoolAttachmentImporter/1.0; +https://youthschool.co.kr)";

type ResolvedAttachment = {
  fileName: string;
  sourceUrl: string;
};

type ImportPost = {
  idx: number;
  sourceHref: string;
  attachments: string[];
};

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function normalizeFileName(value: string): string {
  return value.normalize("NFC").trim();
}

function fileNameFromUrl(value: string, baseUrl: string): string | null {
  try {
    const pathname = new URL(decodeHtml(value), baseUrl).pathname;
    const fileName = pathname.split("/").pop();
    return fileName ? normalizeFileName(decodeURIComponent(fileName)) : null;
  } catch {
    return null;
  }
}

function extractDownloadLinks(html: string, pageUrl: string) {
  return [...html.matchAll(
    /<a\b[^>]*href="([^"]*post_file_download\.cm[^"]*)"[^>]*>[\s\S]*?<p\b[^>]*class="tit"[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/a>/gi,
  )].map((match) => ({
    fileName: normalizeFileName(decodeHtml(match[2])),
    sourceUrl: new URL(decodeHtml(match[1]), pageUrl).href,
  }));
}

function extractImageLinks(html: string, pageUrl: string) {
  const imageUrls = [...html.matchAll(/<img\b[^>]*>/gi)].flatMap(([tag]) => {
    for (const attribute of ["data-original", "data-src", "src"]) {
      const match = tag.match(new RegExp(`${attribute}="([^"]+)"`, "i"));
      if (match) return [new URL(decodeHtml(match[1]), pageUrl).href];
    }
    return [];
  });

  return imageUrls.map((sourceUrl) => ({
    fileName: fileNameFromUrl(sourceUrl, pageUrl),
    sourceUrl,
  }));
}

async function resolvePostAttachments(post: ImportPost): Promise<ResolvedAttachment[]> {
  const response = await fetch(post.sourceHref, {
    headers: { "user-agent": SOURCE_USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`원본 게시물 조회 실패 (${response.status}): ${post.sourceHref}`);
  }

  const html = await response.text();
  const downloads = extractDownloadLinks(html, post.sourceHref);
  const images = extractImageLinks(html, post.sourceHref);

  return post.attachments.map((fileName) => {
    const normalized = normalizeFileName(fileName);
    const download = downloads.find((file) => file.fileName === normalized);
    const image = images.find((file) => file.fileName === normalized);
    const resolved = download ?? image;

    if (!resolved) {
      throw new Error(`원본 파일 주소를 찾지 못했습니다: 게시물 ${post.idx}, ${fileName}`);
    }

    return { fileName, sourceUrl: resolved.sourceUrl };
  });
}

function storagePath(postId: string, legacyIdx: number, order: number, fileName: string) {
  const extension = extname(fileName).slice(1).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const suffix = extension ? `.${extension}` : "";
  return `resource-posts/${postId}/legacy-${legacyIdx}-${order + 1}${suffix}`;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!databaseUrl || !supabaseUrl || !serviceRoleKey) {
    throw new Error("DATABASE_URL 및 Supabase 환경변수가 필요합니다.");
  }

  if (BUCKET !== "youthschool-site") {
    throw new Error(`SUPABASE_STORAGE_BUCKET은 youthschool-site여야 합니다. 현재 값: ${BUCKET}`);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const sourcePosts: ImportPost[] = RESOURCE_CATEGORIES.flatMap((category) =>
      category.posts
        .filter((post) => (post.attachments?.length ?? 0) > 0)
        .map((post) => ({
          idx: post.idx,
          sourceHref: post.sourceHref,
          attachments: post.attachments ?? [],
        })),
    );

    const [{ data: buckets, error: bucketError }, databasePosts, resolvedPosts] =
      await Promise.all([
        supabase.storage.listBuckets(),
        prisma.resourcePost.findMany({
          where: { idx: { in: sourcePosts.map((post) => post.idx) } },
          select: { id: true, idx: true },
        }),
        Promise.all(
          sourcePosts.map(async (post) => ({
            source: post,
            files: await resolvePostAttachments(post),
          })),
        ),
      ]);

    if (bucketError) throw bucketError;
    const bucket = buckets?.find((candidate) => candidate.id === BUCKET);
    if (!bucket) throw new Error(`Supabase Storage 버킷이 없습니다: ${BUCKET}`);
    if (!bucket.public) throw new Error(`Storage 버킷이 공개 상태가 아닙니다: ${BUCKET}`);

    const databasePostByIdx = new Map(
      databasePosts.flatMap((post) => (post.idx === null ? [] : [[post.idx, post] as const])),
    );
    const missingPosts = sourcePosts.filter((post) => !databasePostByIdx.has(post.idx));
    if (missingPosts.length > 0) {
      throw new Error(`DB에서 원본 게시물을 찾지 못했습니다: ${missingPosts.map((p) => p.idx).join(", ")}`);
    }

    let uploaded = 0;
    let skipped = 0;
    let totalBytes = 0;

    for (const { source, files } of resolvedPosts) {
      const databasePost = databasePostByIdx.get(source.idx)!;

      for (const [order, file] of files.entries()) {
        const existing = await prisma.postAttachment.findFirst({
          where: { postId: databasePost.id, fileName: file.fileName },
          select: { id: true },
        });
        if (existing) {
          skipped += 1;
          continue;
        }

        const sourceHost = new URL(file.sourceUrl).hostname;
        const downloadHeaders: Record<string, string> = {
          "user-agent": SOURCE_USER_AGENT,
        };
        // Naver image hosting rejects the youthschool.co.kr Referer even though
        // the original public post embeds the image. Other source hosts accept it.
        if (!sourceHost.endsWith("pstatic.net")) {
          downloadHeaders.referer = source.sourceHref;
        }

        const response = await fetch(file.sourceUrl, {
          redirect: "follow",
          headers: downloadHeaders,
        });
        if (!response.ok) {
          throw new Error(`원본 파일 다운로드 실패 (${response.status}): ${file.fileName}`);
        }

        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.byteLength === 0) {
          throw new Error(`원본 파일이 비어 있습니다: ${file.fileName}`);
        }

        const path = storagePath(databasePost.id, source.idx, order, file.fileName);
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
          contentType,
          upsert: true,
        });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path, { download: file.fileName });

        try {
          const verification = await fetch(data.publicUrl);
          if (!verification.ok) {
            throw new Error(`Storage 검증 실패 (${verification.status}): ${file.fileName}`);
          }
          const storedBytes = new Uint8Array(await verification.arrayBuffer());
          if (storedBytes.byteLength !== bytes.byteLength) {
            throw new Error(`Storage 파일 크기 불일치: ${file.fileName}`);
          }

          await prisma.postAttachment.create({
            data: {
              postId: databasePost.id,
              fileName: file.fileName,
              url: data.publicUrl,
              size: bytes.byteLength,
            },
          });
        } catch (error) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw error;
        }

        uploaded += 1;
        totalBytes += bytes.byteLength;
        console.log(`[${uploaded}] ${source.idx} / ${file.fileName} / ${bytes.byteLength} bytes`);
      }
    }

    const expectedFiles = sourcePosts.reduce((count, post) => count + post.attachments.length, 0);
    const linkedFiles = await prisma.postAttachment.count({
      where: { postId: { in: databasePosts.map((post) => post.id) } },
    });
    if (linkedFiles < expectedFiles) {
      throw new Error(`첨부파일 DB 연결 수가 부족합니다: ${linkedFiles}/${expectedFiles}`);
    }

    console.log(
      JSON.stringify(
        {
          bucket: BUCKET,
          posts: sourcePosts.length,
          expectedFiles,
          linkedFiles,
          uploaded,
          skipped,
          uploadedBytes: totalBytes,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
