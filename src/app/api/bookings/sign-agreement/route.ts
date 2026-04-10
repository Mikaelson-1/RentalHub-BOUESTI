/**
 * POST /api/bookings/sign-agreement
 * Records a student's signed tenancy agreement before payment.
 * Body: { bookingId, signedName }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ success: false, error: "Only students can sign agreements" }, { status: 403 });
    }

    const { bookingId, signedName } = await request.json();

    if (!bookingId || !signedName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Booking ID and full name are required" },
        { status: 400 }
      );
    }

    if (signedName.trim().split(/\s+/).length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (first and last name)" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, studentId: true, status: true, agreementSignedAt: true },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Not your booking" }, { status: 403 });
    }
    if (booking.status !== "AWAITING_PAYMENT") {
      return NextResponse.json(
        { success: false, error: "Agreement can only be signed for bookings awaiting payment" },
        { status: 409 }
      );
    }

    // Idempotent — if already signed just return success
    if (booking.agreementSignedAt) {
      return NextResponse.json({ success: true, message: "Agreement already signed" });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        agreementSignedAt: new Date(),
        agreementSignedName: signedName.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tenancy agreement signed successfully.",
      data: {
        signedName: signedName.trim(),
        signedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[SIGN AGREEMENT ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
