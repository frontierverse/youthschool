"use client";

import { useActionState } from "react";
import { createPostAction, type CreatePostState } from "@/app/admin/actions";

const initialState: CreatePostState = {};

export default function NewPostForm({
  categories,
}: {
  categories: { id: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-ink">
          카테고리
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={categories[0]?.id}
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink">
          제목
        </label>
        <input
          id="title"
          name="title"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-ink">
          작성일
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={today}
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
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
          rows={8}
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="files" className="block text-sm font-medium text-ink">
          첨부파일 <span className="font-normal text-muted">(선택, 여러 개 선택 가능, 최대 20MB)</span>
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          className="mt-1.5 block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary hover:file:bg-primary/20"
        />
      </div>

      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "등록 중..." : "게시물 등록"}
      </button>
    </form>
  );
}
