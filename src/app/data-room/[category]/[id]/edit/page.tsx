import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updatePostAction } from "@/app/data-room/actions";
import AdminToolbar from "@/components/AdminToolbar";
import PostForm from "@/components/PostForm";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "게시물 수정 | 자료실",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  const { category, id } = await params;
  const [post, categories] = await Promise.all([
    prisma.resourcePost.findFirst({
      where: { id, categoryId: category },
      include: { files: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.resourceCategory.findMany({
      orderBy: { order: "asc" },
      select: { id: true, label: true },
    }),
  ]);
  if (!post) notFound();

  const postHref = `/data-room/${post.categoryId}/${post.id}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={postHref} className="text-sm font-medium text-muted hover:text-primary">
          게시물로 돌아가기
        </Link>
        <AdminToolbar />
      </div>
      <p className="mt-6 text-xs font-semibold tracking-wide text-primary">자료실</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">게시물 수정</h1>
      <PostForm
        categories={categories}
        action={updatePostAction.bind(null, post.id, post.updatedAt.toISOString())}
        cancelHref={postHref}
        post={{
          categoryId: post.categoryId,
          title: post.title,
          body: post.body,
          attachments: post.attachments,
          files: post.files.map(({ id, fileName, url, size }) => ({ id, fileName, url, size })),
        }}
      />
    </div>
  );
}
