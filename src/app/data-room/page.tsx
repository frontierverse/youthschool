import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ResourceBoard from "@/components/ResourceBoard";
import ScrollToTop from "@/components/ScrollToTop";
import { getCategoriesWithPosts } from "@/lib/resource-queries";
import { getCurrentAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "자료실 | 사회적협동조합 청소년자립학교",
  description:
    "사회적협동조합 청소년자립학교의 공고, 소식, 공익법인 결산·공시 자료를 확인하세요.",
};

export default async function DataRoomPage() {
  const [categories, admin] = await Promise.all([getCategoriesWithPosts(), getCurrentAdmin()]);

  return (
    <>
      <ScrollToTop />
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-8">
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
              <Link
                href="/admin/data-room/new"
                className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                + 작성하기
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Suspense>
          <ResourceBoard categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
