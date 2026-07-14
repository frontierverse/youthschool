"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@/components/icons";

type BoardCategory = {
  id: string;
  label: string;
  posts: { id: string; title: string; date: string }[];
};

export default function ResourceBoard({ categories }: { categories: BoardCategory[] }) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeId, setActiveId] = useState(
    categories.some((c) => c.id === initialTab) ? (initialTab as string) : categories[0].id,
  );
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line">
        {categories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`relative -mb-px px-4 py-3 text-sm font-bold transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-ink"
              }`}
            >
              {category.label}
              <span
                className={`ml-1.5 text-xs font-semibold ${
                  isActive ? "text-primary" : "text-muted"
                }`}
              >
                {category.posts.length}
              </span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        {active.posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-sm font-semibold text-ink">등록된 게시물이 없습니다.</p>
            <p className="text-sm text-muted">
              &apos;{active.label}&apos; 자료는 준비 중입니다.
            </p>
          </div>
        ) : (
          <ul>
            {active.posts.map((post) => (
              <li key={post.id} className="border-b border-line">
                <Link
                  href={`/data-room/${active.id}/${post.id}`}
                  className="group flex items-center justify-between gap-6 py-4 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium leading-6 text-ink group-hover:text-primary sm:text-base">
                    {post.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-muted">
                    {post.date}
                    <IconArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted opacity-0 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
