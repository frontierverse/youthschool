"use client";

import { useActionState, useState } from "react";
import { deletePostAction, type CreatePostState } from "@/app/data-room/actions";

export default function DeletePostButton({
  postId,
  expectedUpdatedAt,
}: {
  postId: string;
  expectedUpdatedAt: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState<CreatePostState, FormData>(
    deletePostAction.bind(null, postId, expectedUpdatedAt),
    {},
  );

  return (
    <div>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >게시물 삭제</button>
      ) : (
        <form action={formAction} className="rounded-xl border border-red-200 bg-red-50 p-4" aria-busy={pending}>
          <p className="text-sm font-medium text-red-700">게시물과 첨부파일을 삭제할까요?</p>
          <p className="mt-1 text-xs text-red-700">삭제한 내용은 복구할 수 없습니다.</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirming(false)}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
            >취소</button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >{pending ? "삭제 중..." : "삭제 확인"}</button>
          </div>
          {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
        </form>
      )}
    </div>
  );
}
