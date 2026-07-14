import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin") {
    if (session) {
      return NextResponse.redirect(new URL("/data-room", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/data-room") {
    return NextResponse.redirect(new URL(session ? "/data-room" : "/admin", request.url));
  }

  if (pathname === "/admin/data-room/new") {
    return NextResponse.redirect(new URL(session ? "/data-room/new" : "/admin", request.url));
  }

  if (pathname.startsWith("/admin/")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
