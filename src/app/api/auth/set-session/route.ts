import { NextRequest, NextResponse } from "next/server";

const VALID_ROLES = new Set(["STUDENT", "LANDLORD", "INSPECTOR", "ADMIN", "MODERATOR", "AUDITOR"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { role } = body as { role?: string };
  if (!role || !VALID_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("rh_role", role.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("rh_role", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res;
}
