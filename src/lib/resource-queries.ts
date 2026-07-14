import { prisma } from "@/lib/prisma";

export async function getCategoriesWithPosts() {
  const categories = await prisma.resourceCategory.findMany({
    orderBy: { order: "asc" },
    include: { posts: { orderBy: { date: "desc" } } },
  });

  return categories.map((category) => ({
    id: category.id,
    label: category.label,
    posts: category.posts.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date.toISOString().slice(0, 10),
    })),
  }));
}

export async function getCategory(categoryId: string) {
  const category = await prisma.resourceCategory.findUnique({ where: { id: categoryId } });
  if (!category) return null;
  return { id: category.id, label: category.label };
}

export async function getPost(categoryId: string, id: string) {
  const post = await prisma.resourcePost.findFirst({
    where: { id, categoryId },
    include: { files: { orderBy: { createdAt: "asc" } } },
  });
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    date: post.date.toISOString().slice(0, 10),
    body: post.body,
    attachments: post.attachments,
    sourceHref: post.sourceHref,
    files: post.files.map((f) => ({ fileName: f.fileName, url: f.url, size: f.size })),
  };
}

export async function getCategoryPostList(categoryId: string) {
  const posts = await prisma.resourcePost.findMany({
    where: { categoryId },
    orderBy: { date: "desc" },
    select: { id: true, title: true },
  });
  return posts;
}
