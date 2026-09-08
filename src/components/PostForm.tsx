"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import type { CreatePostState } from "@/app/data-room/actions";
import {
  MAX_POST_BODY_LENGTH,
  MAX_POST_TITLE_LENGTH,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  validateAttachmentFiles,
} from "@/lib/post-validation";

type PostFormProps = {
  categories: { id: string; label: string }[];
  action: (state: CreatePostState, formData: FormData) => Promise<CreatePostState>;
  cancelHref: string;
  post?: {
    categoryId: string;
    title: string;
    body: string[];
    attachments: string[];
    files: { id: string; fileName: string; url: string; size: number }[];
  };
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function PostForm({ categories, action, cancelHref, post }: PostFormProps) {
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? categories[0]?.id ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body.join("\n\n") ?? "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [removedLegacyAttachments, setRemovedLegacyAttachments] = useState<string[]>([]);
  const [clientError, setClientError] = useState<string>();
  const [errorDismissed, setErrorDismissed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(
    async (previousState: CreatePostState, formData: FormData) => {
      // Keep files available for retry if React resets the native file input.
      formData.delete("files");
      selectedFiles.forEach((file) => formData.append("files", file));
      return action(previousState, formData);
    },
    {},
  );

  const legacyAttachments = [...new Set(post?.attachments ?? [])].filter(
    (fileName) => !post?.files.some((file) => file.fileName === fileName),
  );
  const selectedBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const error = clientError || (!pending && !errorDismissed ? state.error : undefined);
  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary";

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5"
      aria-busy={pending}
      onReset={(event) => event.preventDefault()}
      onChange={() => setErrorDismissed(true)}
      onSubmit={(event) => {
        const validationError = validateAttachmentFiles(selectedFiles);
        setClientError(validationError);
        setErrorDismissed(false);
        if (pending || validationError) event.preventDefault();
      }}
    >
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-ink">카테고리</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={inputClassName}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink">제목</label>
          <input
            id="title"
            name="title"
            required
            maxLength={MAX_POST_TITLE_LENGTH}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-ink">
            본문 <span className="font-normal text-muted">(줄바꿈으로 문단을 구분합니다)</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={10}
            maxLength={MAX_POST_BODY_LENGTH}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className={inputClassName}
          />
        </div>

        {post && (post.files.length > 0 || legacyAttachments.length > 0) && (
          <fieldset className="rounded-xl border border-line p-4">
            <legend className="px-1 text-sm font-medium text-ink">기존 첨부파일</legend>
            <p className="text-xs leading-5 text-muted">
              삭제할 항목을 선택하세요. 파일을 교체하려면 기존 파일을 선택하고 아래에서 새 파일을
              첨부하세요. 변경 사항은 저장할 때 반영됩니다.
            </p>
            <ul className="mt-3 space-y-3">
              {post.files.map((file) => (
                <li key={file.id} className="flex flex-wrap items-start gap-x-3 gap-y-1 text-sm">
                  <label className="flex min-w-0 flex-1 items-start gap-2 text-ink">
                    <input
                      type="checkbox"
                      name="removeFileIds"
                      value={file.id}
                      checked={removedFileIds.includes(file.id)}
                      onChange={(event) =>
                        setRemovedFileIds((ids) =>
                          event.target.checked ? [...ids, file.id] : ids.filter((id) => id !== file.id),
                        )
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 break-all">
                      {file.fileName} <span className="text-xs text-muted">({formatFileSize(file.size)}) · 삭제</span>
                    </span>
                  </label>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-primary underline underline-offset-4"
                    aria-label={`${file.fileName} 파일 보기 (새 창)`}
                  >파일 보기</a>
                </li>
              ))}
              {legacyAttachments.map((fileName) => (
                <li key={fileName}>
                  <label className="flex items-start gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      name="removeLegacyAttachments"
                      value={fileName}
                      checked={removedLegacyAttachments.includes(fileName)}
                      onChange={(event) =>
                        setRemovedLegacyAttachments((names) =>
                          event.target.checked
                            ? [...names, fileName]
                            : names.filter((name) => name !== fileName),
                        )
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 break-all">
                      {fileName} <span className="text-xs text-muted">(파일명 안내만 있음) · 삭제</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        <div>
          <label htmlFor="files" className="block text-sm font-medium text-ink">
            {post ? "새 첨부파일" : "첨부파일"} <span className="font-normal text-muted">(선택)</span>
          </label>
          <p id="files-help" className="mt-1 text-xs leading-5 text-muted">
            한 번에 최대 {MAX_UPLOAD_FILES}개, 새로 선택한 파일의 합계 {MAX_UPLOAD_BYTES / (1024 * 1024)}MB까지 첨부할 수 있습니다.
          </p>
          <input
            ref={fileInputRef}
            id="files"
            name="files"
            type="file"
            multiple
            aria-describedby={clientError ? "files-help post-form-error" : "files-help"}
            aria-invalid={Boolean(clientError)}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setSelectedFiles(files);
              setClientError(validateAttachmentFiles(files));
            }}
            className="mt-2 block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary hover:file:bg-primary/20"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-3 rounded-lg bg-surface p-3 text-xs text-muted">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p role="status">선택한 파일 {selectedFiles.length}개 · 합계 {formatFileSize(selectedBytes)}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);
                    setClientError(undefined);
                    setErrorDismissed(true);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="font-medium text-primary underline underline-offset-4"
                >선택 비우기</button>
              </div>
              <ul className="mt-2 space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="break-all">
                    {file.name} ({formatFileSize(file.size)})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </fieldset>

      {error && (
        <p id="post-form-error" role="alert" className="text-sm font-medium text-red-600">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || Boolean(clientError)}
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "저장 중..." : post ? "수정 사항 저장" : "게시물 등록"}
        </button>
        {!pending && (
          <Link href={cancelHref} className="rounded-full border border-line px-6 py-3 text-sm font-medium text-muted hover:text-primary">
            취소
          </Link>
        )}
      </div>
      {pending && <p role="status" className="text-xs text-muted">첨부파일과 게시물을 저장하고 있습니다.</p>}
    </form>
  );
}
