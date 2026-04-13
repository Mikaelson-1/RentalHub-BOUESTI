/**
 * POST /api/auth/setup-role
 *
 * Called once after a brand-new Google OAuth user completes the role-picker
 * page. Updates the user's role in the DB. The client then calls
 * NextAuth's `update()` to refresh the JWT so the new role is reflected
 * immediately without a fresh sign-in.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type AllowedRole = "STUDENT" | "LANDLORD";
const ALLOWED_ROLES: AllowedRole[] = ["STUDENT", "LANDLORD"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  // Only allow this endpoint while the needsRoleSetup flag is active
  if (!session.user.needsRoleSetup) {
    return NextResponse.json(
      { success: false, error: "Role is already configured." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { role } = body as { role?: string };

  if (!role || !ALLOWED_ROLES.includes(role as AllowedRole)) {
    return NextResponse.json(
      { success: false, error: "Invalid role. Choose STUDENT or LANDLORD." },
      { status: 400 },
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: role as AllowedRole,
    },
  });

  console.log("[Setup Role API] Updated user:", { id: updatedUser.id, role: updatedUser.role });

  return NextResponse.json({ success: true, role });
}
