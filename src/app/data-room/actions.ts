"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/session";
import { removePostAttachments, uploadPostAttachment } from "@/lib/storage";
import { parsePostForm } from "@/lib/post-validation";

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24시간 내 재방문은 조회수에 반영하지 않음

export async function recordPostView(postId: string) {
  const store = await cookies();
  const cookieName = `viewed_${postId}`;
  if (store.get(cookieName)) return;

  // Visits must not change the content revision used to detect concurrent edits.
  const count = await prisma.$executeRaw`
    UPDATE "youthschool_site"."resource_posts"
    SET "views" = "views" + 1
    WHERE "id" = ${postId}
  `;
  if (!count) return;

  store.set(cookieName, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VIEW_COOKIE_MAX_AGE,
  });
}

export type CreatePostState = { error?: string };

type UploadedAttachment = Awaited<ReturnType<typeof uploadPostAttachment>>;
const EDIT_CONFLICT = "다른 곳에서 게시물이 변경되었거나 삭제되었습니다. 최신 내용을 확인한 뒤 다시 시도해 주세요.";

class PostEditConflict extends Error {}

async function cleanAttachments(postId: string, files: { url: string }[]): Promise<boolean> {
  if (files.length === 0) return true;
  try {
    await removePostAttachments(postId, files);
    return true;
  } catch {
    // Keep enough context for an operator to retry cleanup; the UI must not
    // describe a committed database change as a failed save.
    console.error("첨부파일 저장소 정리 실패", { postId, urls: files.map((file) => file.url) });
    return false;
  }
}

function validRevision(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

function postPath(categoryId: string, postId: string) {
  return `/data-room/${encodeURIComponent(categoryId)}/${encodeURIComponent(postId)}`;
}

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "로그인이 필요합니다." };
  }

  const parsed = parsePostForm(formData);
  if (parsed.error) return { error: parsed.error };
  const postId = randomUUID();
  const uploaded: UploadedAttachment[] = [];

  try {
    const category = await prisma.resourceCategory.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) return { error: "존재하지 않는 카테고리입니다." };

    // Stage files before publishing the post. Sequential uploads ensure every
    // completed file is known and can be cleaned if a later upload fails.
    for (const file of parsed.files) {
      uploaded.push(await uploadPostAttachment(postId, file));
    }
    // A nested create commits the post and all attachment records atomically.
    await prisma.resourcePost.create({
      data: {
        id: postId,
        ...parsed.data,
        date: new Date(),
        files: { create: uploaded },
      },
    });
  } catch {
    await cleanAttachments(postId, uploaded);
    return { error: "게시물을 등록하지 못했습니다. 입력 내용과 첨부파일을 유지했으니 다시 시도해 주세요." };
  }

  revalidatePath("/data-room");
  redirect(postPath(parsed.data.categoryId, postId));
}

export async function updatePostAction(
  postId: string,
  expectedUpdatedAt: string,
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  if (!(await getCurrentAdmin())) return { error: "로그인이 필요합니다." };
  if (!validRevision(expectedUpdatedAt)) return { error: EDIT_CONFLICT };
  const parsed = parsePostForm(formData);
  if (parsed.error) return { error: parsed.error };
  const removeIds = [...new Set(formData.getAll("removeFileIds").map(String))];
  const removeLegacy = new Set(formData.getAll("removeLegacyAttachments").map(String));
  const uploaded: UploadedAttachment[] = [];
  let removedFiles: { url: string }[] = [];
  let previousCategoryId: string;

  try {
    const post = await prisma.resourcePost.findUnique({ where: { id: postId }, include: { files: true } });
    if (!post || post.updatedAt.toISOString() !== expectedUpdatedAt) return { error: EDIT_CONFLICT };
    previousCategoryId = post.categoryId;
    if (removeIds.some((id) => !post.files.some((file) => file.id === id))) {
      return { error: "삭제할 첨부파일이 이 게시물에 속하지 않습니다." };
    }
    if ([...removeLegacy].some((name) => !post.attachments.includes(name))) {
      return { error: "삭제할 원본 첨부파일 안내가 올바르지 않습니다." };
    }
    const category = await prisma.resourceCategory.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) return { error: "존재하지 않는 카테고리입니다." };

    removedFiles = post.files.filter((file) => removeIds.includes(file.id));
    const removedNames = new Set(post.files.filter((file) => removeIds.includes(file.id)).map((file) => file.fileName));
    for (const file of parsed.files) {
      uploaded.push(await uploadPostAttachment(postId, file));
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.resourcePost.updateMany({
        where: { id: postId, updatedAt: new Date(expectedUpdatedAt) },
        data: {
          ...parsed.data,
          attachments: post.attachments.filter((name) => !removeLegacy.has(name) && !removedNames.has(name)),
          updatedAt: new Date(Math.max(Date.now(), post.updatedAt.getTime() + 1)),
        },
      });
      if (updated.count !== 1) throw new PostEditConflict();
      if (removeIds.length > 0) {
        await tx.postAttachment.deleteMany({ where: { postId, id: { in: removeIds } } });
      }
      if (uploaded.length > 0) {
        await tx.postAttachment.createMany({ data: uploaded.map((file) => ({ ...file, postId })) });
      }
    });
  } catch (error) {
    await cleanAttachments(postId, uploaded);
    return { error: error instanceof PostEditConflict ? EDIT_CONFLICT : "수정 내용을 저장하지 못했습니다. 기존 게시물은 유지되며, 입력한 내용으로 다시 시도할 수 있습니다." };
  }

  // Keep the original files until the database update has succeeded.
  const cleaned = await cleanAttachments(postId, removedFiles);
  revalidatePath("/data-room");
  revalidatePath(postPath(previousCategoryId, postId));
  revalidatePath(postPath(parsed.data.categoryId, postId));
  revalidatePath(`${postPath(previousCategoryId, postId)}/edit`);
  redirect(`${postPath(parsed.data.categoryId, postId)}${cleaned ? "" : "?notice=attachment-cleanup-failed"}`);
}

export async function deletePostAction(
  postId: string,
  expectedUpdatedAt: string,
): Promise<CreatePostState> {
  if (!(await getCurrentAdmin())) return { error: "로그인이 필요합니다." };
  if (!validRevision(expectedUpdatedAt)) return { error: EDIT_CONFLICT };
  let categoryId: string;
  let files: { url: string }[];

  try {
    const post = await prisma.resourcePost.findUnique({ where: { id: postId }, include: { files: true } });
    if (!post || post.updatedAt.toISOString() !== expectedUpdatedAt) return { error: EDIT_CONFLICT };
    categoryId = post.categoryId;
    files = post.files;
    const deleted = await prisma.resourcePost.deleteMany({
      where: { id: postId, updatedAt: new Date(expectedUpdatedAt) },
    });
    // Attachment rows are removed by the existing database cascade.
    if (deleted.count !== 1) return { error: EDIT_CONFLICT };
  } catch {
    return { error: "게시물을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const cleaned = await cleanAttachments(postId, files);
  revalidatePath("/data-room");
  revalidatePath(postPath(categoryId, postId));
  revalidatePath(`${postPath(categoryId, postId)}/edit`);
  redirect(`/data-room?tab=${encodeURIComponent(categoryId)}${cleaned ? "" : "&notice=attachment-cleanup-failed"}`);
}
