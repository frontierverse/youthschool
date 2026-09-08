export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_UPLOAD_FILES = 10;
export const MAX_POST_TITLE_LENGTH = 200;
export const MAX_POST_BODY_LENGTH = 100_000;

export function validateAttachmentFiles(files: { name: string; size: number }[]): string | undefined {
  if (files.length > MAX_UPLOAD_FILES) {
    return `첨부파일은 한 번에 최대 ${MAX_UPLOAD_FILES}개까지 선택할 수 있습니다.`;
  }
  if (files.some((file) => !file.name.trim() || file.size <= 0)) {
    return "이름이 없거나 비어 있는 파일은 첨부할 수 없습니다.";
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_UPLOAD_BYTES) {
    return "새로 첨부하는 파일의 전체 용량은 20MB 이하여야 합니다.";
  }
}

export function parsePostForm(formData: FormData) {
  const categoryId = String(formData.get("categoryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const bodyRaw = String(formData.get("body") || "");
  const entries = formData.getAll("files");
  // An untouched file input submits an empty File with no name.
  const files = entries.filter((entry): entry is File => entry instanceof File && Boolean(entry.name));
  let error: string | undefined;

  if (!categoryId || !title || !bodyRaw.trim()) {
    error = "카테고리, 제목, 본문은 필수입니다.";
  } else if (categoryId.length > 200 || title.length > MAX_POST_TITLE_LENGTH) {
    error = `제목은 ${MAX_POST_TITLE_LENGTH}자 이내로 입력해 주세요.`;
  } else if (bodyRaw.length > MAX_POST_BODY_LENGTH) {
    error = `본문은 ${MAX_POST_BODY_LENGTH.toLocaleString("ko-KR")}자 이내로 입력해 주세요.`;
  } else if (entries.some((entry) => !(entry instanceof File))) {
    error = "첨부파일 형식이 올바르지 않습니다.";
  } else {
    error = validateAttachmentFiles(files);
  }

  return {
    error,
    files,
    data: {
      categoryId,
      title,
      body: bodyRaw.split("\n").map((line) => line.trim()).filter(Boolean),
    },
  };
}
