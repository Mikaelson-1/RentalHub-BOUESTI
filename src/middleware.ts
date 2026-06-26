import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "hazard.rentalhub.ng";
const ADMIN_LOGIN = "/admin-login";
const STAFF_ROLES = new Set(["ADMIN", "MODERATOR", "AUDITOR"]);
const INSPECTOR_LOGIN = "/login";

export function middleware(req: NextRequest) {
  const host = req.nextUrl.hostname;
  const { pathname } = req.nextUrl;

  const isAdminHost = host === ADMIN_HOST;
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminHost) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
    }
    if (!isAdminRoute) {
      return new NextResponse(null, { status: 404 });
    }
    // /admin-login itself is always accessible; all other admin routes require a staff session.
    if (pathname !== ADMIN_LOGIN) {
      const role = req.cookies.get("rh_role")?.value ?? "";
      if (!STAFF_ROLES.has(role)) {
        return NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
      }
    }
  }

  if (!isAdminHost && isAdminRoute) {
    // rentalhub.ng/admin* → genuine 404, no hint the route exists
    return new NextResponse(null, { status: 404 });
  }

  // Inspector dashboard requires an active INSPECTOR session.
  if (pathname.startsWith("/inspector")) {
    const role = req.cookies.get("rh_role")?.value ?? "";
    if (role !== "INSPECTOR") {
      return NextResponse.redirect(new URL(INSPECTOR_LOGIN, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-export).*)"],
};
