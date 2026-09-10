import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  const isAdminHost = hostname.startsWith("admin.");
  const isAdminPath = url.pathname.startsWith("/admin");

  // Check auth for /admin routes
  if (isAdminHost || isAdminPath) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const isLoginPage =
      url.pathname === "/login" || url.pathname === "/admin/login";

    // Decrypt the session
    const session = await decrypt(sessionCookie);

    // If no valid session and not on login page, redirect to login
    if (!session && !isLoginPage) {
      if (isAdminHost) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      } else {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    // If user is already logged in, redirect away from login
    if (session && isLoginPage) {
      if (isAdminHost) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      } else {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  if (isAdminHost) {
    if (!isAdminPath) {
      const newPathname =
        url.pathname === "/" ? "/admin" : `/admin${url.pathname}`;
      url.pathname = newPathname;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
