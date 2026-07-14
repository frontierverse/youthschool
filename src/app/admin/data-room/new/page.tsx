import { prisma } from "@/lib/prisma";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const categories = await prisma.resourceCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, label: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs font-semibold tracking-wide text-primary">ADMIN</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">새 게시물 작성</h1>
      <NewPostForm categories={categories} />
    </div>
  );
}
