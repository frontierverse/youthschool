import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "youthschool-site";

function getStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function uploadPostAttachment(postId: string, file: File) {
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
