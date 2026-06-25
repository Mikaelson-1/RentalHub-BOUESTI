import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "hazard.rentalhub.ng";
const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentalhub.ng";

export function middleware(req: NextRequest) {
  const host = req.nextUrl.hostname;
  const { pathname } = req.nextUrl;

  const isAdminHost = host === ADMIN_HOST;
  // Covers /admin, /admin-login, /admin/properties/... etc.
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminHost) {
    if (pathname === "/") {
      // hazard.rentalhub.ng/ → take them straight to the login page
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    if (!isAdminRoute) {
      // Any other non-admin path on the admin host → 404
      return new NextResponse(null, { status: 404 });
    }
  }

  if (!isAdminHost && isAdminRoute) {
    // rentalhub.ng/admin* → genuine 404, no hint the route exists
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-export).*)"],
};
