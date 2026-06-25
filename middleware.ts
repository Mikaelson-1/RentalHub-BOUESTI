import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "hazard.rentalhub.ng";
const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentalhub.ng";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  const isAdminHost = host === ADMIN_HOST;
  // Covers /admin, /admin-login, /admin/properties/... etc.
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminHost && !isAdminRoute) {
    // Someone hit admin.rentalhub.ng/<non-admin-path> → send them to main site
    return NextResponse.redirect(`${PUBLIC_URL}${pathname}`);
  }

  if (!isAdminHost && isAdminRoute) {
    // Someone hit rentalhub.ng/admin* → genuine 404, no hint the route exists
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-export).*)"],
};
