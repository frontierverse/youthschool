"use client";

import { useEffect } from "react";
import { recordPostView } from "@/app/data-room/actions";

export default function RecordPostView({ postId }: { postId: string }) {
  useEffect(() => {
    recordPostView(postId);
  }, [postId]);

  return null;
}
