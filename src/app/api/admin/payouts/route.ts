/**
 * Admin Payouts API
 * GET  /api/admin/payouts — list bookings awaiting manual payout
 * PATCH /api/admin/payouts — mark a payout COMPLETED or FAILED
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const payouts = await prisma.booking.findMany({
      where: {
        movedInConfirmedAt: { not: null },
        payoutStatus: { in: ["PENDING", "PROCESSING"] },
        status: "PAID",
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: { select: { name: true } },
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                bankAccountNumber: true,
                bankName: true,
                bankAccountName: true,
              },
            },
          },
        },
        payments: {
          where: { status: "SUCCESS" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { amount: true, paidAt: true },
        },
      },
      orderBy: { movedInConfirmedAt: "asc" }, // oldest first
    });

    return NextResponse.json({ success: true, data: payouts });
  } catch (error) {
    console.error("[ADMIN PAYOUTS GET ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch payouts." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const { bookingId, action } = await request.json();
    if (!bookingId || !["COMPLETE", "FAIL"].includes(action)) {
      return NextResponse.json({ success: false, error: "bookingId and action (COMPLETE|FAIL) required." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true } },
        property: {
          select: {
            title: true,
            landlord: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }
    if (!booking.movedInConfirmedAt) {
      return NextResponse.json({ success: false, error: "Student has not confirmed move-in yet." }, { status: 409 });
    }
    if (booking.payoutStatus === "COMPLETED") {
      return NextResponse.json({ success: false, error: "Payout already marked as completed." }, { status: 409 });
    }

    const newStatus = action === "COMPLETE" ? "COMPLETED" : "FAILED";

    await prisma.booking.update({
      where: { id: bookingId },
      data: { payoutStatus: newStatus },
    });

    // Notify landlord
    notifyUser({
      userId: booking.property.landlord.id,
      type: "PAYMENT",
      title: action === "COMPLETE" ? "Rent payment received" : "Payout issue",
      message:
        action === "COMPLETE"
          ? `Your rent payment for ${booking.property.title} has been transferred to your bank account.`
          : `There was an issue releasing your payment for ${booking.property.title}. Please contact RentalHub support.`,
      link: "/landlord",
    }).catch(console.error);

    // Notify student
    notifyUser({
      userId: booking.student.id,
      type: "PAYMENT",
      title: action === "COMPLETE" ? "Payment released to landlord" : "Payout issue",
      message:
        action === "COMPLETE"
          ? `Your landlord has been paid for ${booking.property.title}.`
          : `There was an issue releasing the payment for ${booking.property.title}. RentalHub support will reach out.`,
      link: "/student",
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: action === "COMPLETE" ? "Payout marked as completed." : "Payout marked as failed.",
    });
  } catch (error) {
    console.error("[ADMIN PAYOUTS PATCH ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update payout." }, { status: 500 });
  }
}
