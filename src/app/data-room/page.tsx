import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminToolbar from "@/components/AdminToolbar";
import ResourceBoard from "@/components/ResourceBoard";
import ScrollToTop from "@/components/ScrollToTop";
import { getCategoriesWithPosts } from "@/lib/resource-queries";
import { getCurrentAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "자료실 | 사회적협동조합 청소년자립학교",
  description:
    "사회적협동조합 청소년자립학교의 공고, 소식, 공익법인 결산·공시 자료를 확인하세요.",
};

export default async function DataRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const [categories, admin, query] = await Promise.all([
    getCategoriesWithPosts(),
    getCurrentAdmin(),
    searchParams,
  ]);

  return (
    <>
      <ScrollToTop />
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-xl font-black tracking-tight text-ink">자료실</h1>
                <p className="text-xs font-semibold tracking-wide text-primary">RESOURCES</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-body">
                공고와 소식, 공익법인 결산·공시 자료를 모아 확인하실 수 있습니다.
                게시물을 클릭하면 상세 내용을 바로 볼 수 있습니다.
              </p>
            </div>

            {admin && (
              <AdminToolbar>
                <Link
                  href="/data-room/new"
                  className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  + 작성하기
                </Link>
              </AdminToolbar>
            )}
          </div>
          {admin && query.notice === "attachment-cleanup-failed" && (
            <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              게시물 변경은 반영됐지만 일부 첨부파일을 저장소에서 정리하지 못했습니다.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <Suspense>
          <ResourceBoard categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
