"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";
import { uploadPostAttachment } from "@/lib/storage";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해 주세요." };
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = await createSessionToken({
    sub: user.id,
    username: user.username,
    name: user.name,
  });
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  redirect("/admin/data-room");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin");
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
  const dateStr = String(formData.get("date") || "");
  const bodyRaw = String(formData.get("body") || "");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (!categoryId || !title || !dateStr || !bodyRaw.trim()) {
    return { error: "카테고리, 제목, 작성일, 본문은 필수입니다." };
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
      date: new Date(dateStr),
      body,
    },
  });

  if (files.length > 0) {
    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadPostAttachment(post.id, file)),
      );
      await prisma.postAttachment.createMany({
        data: uploaded.map((f) => ({ ...f, postId: post.id })),
      });
    } catch (e) {
      return { error: e instanceof Error ? e.message : "파일 업로드 중 오류가 발생했습니다." };
    }
  }

  redirect(`/data-room/${categoryId}/${post.id}`);
}
