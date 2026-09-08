import { createPostAction } from "@/app/data-room/actions";
import PostForm from "@/components/PostForm";

export default function NewPostForm({
  categories,
}: {
  categories: { id: string; label: string }[];
}) {
  return <PostForm categories={categories} action={createPostAction} cancelHref="/data-room" />;
}
