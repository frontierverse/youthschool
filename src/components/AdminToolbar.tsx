import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";

export default function AdminToolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {children}
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
        >로그아웃</button>
      </form>
    </div>
  );
}
