import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin");
  }

  const categories = await prisma.resourceCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, label: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs font-semibold tracking-wide text-primary">자료실</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">새 게시물 작성</h1>
      <NewPostForm categories={categories} />
    </div>
  );
}
