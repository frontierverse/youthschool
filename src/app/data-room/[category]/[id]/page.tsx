import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getCategoryPostList, getPost } from "@/lib/resource-queries";
import { IconArrowLeft, IconPaperclip } from "@/components/icons";
import ScrollToTop from "@/components/ScrollToTop";

type Params = { category: string; id: string };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, id } = await params;
  const post = await getPost(category, id);
  if (!post) return {};
  return {
    title: `${post.title} | 자료실 | 사회적협동조합 청소년자립학교`,
    description: post.body[0],
  };
}

export default async function ResourcePostPage({ params }: { params: Promise<Params> }) {
  const { category: categoryId, id } = await params;
  const [category, post, posts] = await Promise.all([
    getCategory(categoryId),
    getPost(categoryId, id),
    getCategoryPostList(categoryId),
  ]);

  if (!category || !post) {
    notFound();
  }

  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const missingLegacyAttachments = post.attachments.filter(
    (fileName) => !post.files.some((file) => file.fileName === fileName),
  );

  return (
    <>
      <ScrollToTop />
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
          <Link
            href={`/data-room?tab=${category.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <IconArrowLeft className="h-4 w-4" />
            자료실 목록으로
          </Link>

          <p className="mt-4 text-xs font-semibold tracking-wide text-primary">
            {category.label}
          </p>
          <h1 className="mt-2 text-2xl font-black leading-snug tracking-tight text-ink sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted">{post.date}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-4">
          {post.body.map((line, i) =>
            line.startsWith("·") ? (
              <p key={i} className="pl-4 text-[15px] leading-7 text-body">
                {line}
              </p>
            ) : (
              <p key={i} className="text-[15px] font-medium leading-7 text-ink">
                {line}
              </p>
            ),
          )}
        </div>

        {post.files.length > 0 && (
          <div className="mt-10 rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-semibold tracking-wide text-muted">첨부파일</p>
            <ul className="mt-3 space-y-2">
              {post.files.map((file) => (
                <li key={file.url}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.fileName}
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink hover:text-primary"
                  >
                    <IconPaperclip className="h-4 w-4 shrink-0 text-muted" />
                    <span className="min-w-0 break-all">{file.fileName}</span>
                    <span className="shrink-0 text-xs font-normal text-muted">
                      ({formatFileSize(file.size)})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missingLegacyAttachments.length > 0 && (
          <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-semibold tracking-wide text-muted">
              첨부파일 안내 (원본 게시물 참고용, 파일 없음)
            </p>
            <ul className="mt-3 space-y-2">
              {missingLegacyAttachments.map((file) => (
                <li key={file} className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted">
                  <IconPaperclip className="h-4 w-4 shrink-0 text-muted" />
                  <span className="min-w-0 break-all">{file}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6 text-xs text-muted">
          <span>사회적협동조합 청소년자립학교</span>
          {post.sourceHref && (
            <a
              href={post.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-primary"
            >
              원문 페이지 보기
            </a>
          )}
        </div>
      </section>

      {(prevPost || nextPost) && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {nextPost && (
              <Link
                href={`/data-room/${category.id}/${nextPost.id}`}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span className="text-muted">다음 글</span>
                <span className="truncate font-medium text-ink hover:text-primary">
                  {nextPost.title}
                </span>
              </Link>
            )}
            {prevPost && (
              <Link
                href={`/data-room/${category.id}/${prevPost.id}`}
                className="flex items-center justify-between gap-4 border-t border-line py-3 text-sm"
              >
                <span className="text-muted">이전 글</span>
                <span className="truncate font-medium text-ink hover:text-primary">
                  {prevPost.title}
                </span>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
