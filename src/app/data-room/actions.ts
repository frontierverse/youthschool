"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";
import { uploadPostAttachment } from "@/lib/storage";

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24시간 내 재방문은 조회수에 반영하지 않음

export async function recordPostView(postId: string) {
  const store = await cookies();
  const cookieName = `viewed_${postId}`;
  if (store.get(cookieName)) return;

  await prisma.resourcePost.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });

  store.set(cookieName, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VIEW_COOKIE_MAX_AGE,
  });
}

export type CreatePostState = { error?: string };

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "로그인이 필요합니다." };
  }

  const categoryId = String(formData.get("categoryId") || "");
  const title = String(formData.get("title") || "").trim();
  const bodyRaw = String(formData.get("body") || "");
  const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);

  if (!categoryId || !title || !bodyRaw.trim()) {
    return { error: "카테고리, 제목, 본문은 필수입니다." };
  }

  const category = await prisma.resourceCategory.findUnique({ where: { id: categoryId } });
  if (!category) {
    return { error: "존재하지 않는 카테고리입니다." };
  }

  const body = bodyRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const post = await prisma.resourcePost.create({
    data: {
      categoryId,
      title,
      date: new Date(),
      body,
    },
  });

  if (files.length > 0) {
    try {
      const uploaded = await Promise.all(files.map((file) => uploadPostAttachment(post.id, file)));
      await prisma.postAttachment.createMany({
        data: uploaded.map((file) => ({ ...file, postId: post.id })),
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다." };
    }
  }

  redirect(`/data-room/${categoryId}/${post.id}`);
}
