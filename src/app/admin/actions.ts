"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";

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

  redirect("/data-room");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin");
}
