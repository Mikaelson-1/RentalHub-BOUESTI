import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const [totalProperties, pendingApprovals, totalUsers, totalBookings] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.booking.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        pendingApprovals,
        totalUsers,
        totalBookings,
      },
    });
  } catch (error) {
    console.error("[ADMIN SUMMARY GET ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin summary." }, { status: 500 });
  }
}
