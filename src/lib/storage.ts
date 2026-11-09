import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { validateAttachmentFiles } from "@/lib/post-validation";

// Website attachments are public and must stay in this app's dedicated bucket.
// A shared environment variable must not route them to private approval files.
const BUCKET = "youthschool-site";

function getStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function uploadPostAttachment(postId: string, file: File) {
  const validationError = validateAttachmentFiles([file]);
  if (validationError) throw new Error(validationError);
  const supabase = getStorageClient();

  // Supabase Storage object keys must be ASCII-safe, so the on-disk path
  // uses a random id, while the original (possibly Korean) file name is
  // kept separately in the DB for display and download purposes.
  const dotIndex = file.name.lastIndexOf(".");
  const rawExt = dotIndex > -1 ? file.name.slice(dotIndex + 1) : "";
  const safeExt = rawExt.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const path = `resource-posts/${postId}/${randomUUID()}${safeExt ? `.${safeExt}` : ""}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "application/octet-stream" });

  if (error) {
    throw new Error(`파일 업로드 실패: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path, { download: file.name });

  return {
    fileName: file.name,
    url: data.publicUrl,
    size: file.size,
  };
}

// Delete only objects owned by this post in the configured project and bucket.
// URLs are loaded from the database, never accepted directly from a form.
export function getPostAttachmentPath(postId: string, fileUrl: string): string {
  const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const url = new URL(fileUrl);
  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  if (url.origin !== base.origin || !url.pathname.startsWith(prefix)) {
    throw new Error("첨부파일 저장소 주소가 올바르지 않습니다.");
  }
  const path = decodeURIComponent(url.pathname.slice(prefix.length));
  const segments = path.split("/");
  if (
    segments.length !== 3 || segments[0] !== "resource-posts" ||
    segments[1] !== postId || !segments[2] ||
    segments.some((segment) => segment === "." || segment === ".." || segment.includes("\\"))
  ) {
    throw new Error("이 게시물에 속하지 않는 첨부파일입니다.");
  }
  return path;
}

export async function removePostAttachments(postId: string, files: { url: string }[]) {
  if (files.length === 0) return;
  const paths = [...new Set(files.map((file) => getPostAttachmentPath(postId, file.url)))];
  const supabase = getStorageClient();
  // Removal is idempotent, so a transient failure can be retried safely.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (!error) return;
  }
  throw new Error("첨부파일을 저장소에서 정리하지 못했습니다.");
}
