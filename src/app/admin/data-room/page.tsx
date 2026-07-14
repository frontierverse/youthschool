import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminDataRoomPage() {
  const admin = await getCurrentAdmin();
  const categories = await prisma.resourceCategory.findMany({
    orderBy: { order: "asc" },
    include: { posts: { orderBy: { date: "desc" } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary">ADMIN</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">자료실 관리</h1>
          <p className="mt-1 text-sm text-muted">
            {admin?.name || admin?.username}님으로 로그인됨
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/data-room/new"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            + 새 글 작성
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="text-sm font-bold text-ink">
              {category.label}{" "}
              <span className="font-normal text-muted">({category.posts.length})</span>
            </h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {category.posts.length === 0 ? (
                <li className="py-4 text-sm text-muted">게시물이 없습니다.</li>
              ) : (
                category.posts.map((post) => (
                  <li key={post.id} className="flex items-center justify-between gap-4 py-3">
                    <Link
                      href={`/data-room/${category.id}/${post.id}`}
                      target="_blank"
                      className="text-sm font-medium text-ink hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <span className="shrink-0 text-xs text-muted">
                      {post.date.toISOString().slice(0, 10)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
