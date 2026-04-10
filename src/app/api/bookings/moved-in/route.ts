/**
 * POST /api/bookings/moved-in
 * Student confirms they have moved in.
 * Sets movedInConfirmedAt, updates moveInDate if provided,
 * then initiates a Paystack transfer to the landlord's bank account.
 * Body: { bookingId, moveInDate? }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ success: false, error: "Only students can confirm move-in" }, { status: 403 });
    }

    const { bookingId, moveInDate } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          include: {
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
                paystackRecipientCode: true,
                bankAccountName: true,
                bankName: true,
              },
            },
          },
        },
        student: { select: { id: true, name: true } },
        payments: { where: { status: "SUCCESS" }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Not your booking" }, { status: 403 });
    }
    if (booking.status !== "PAID") {
      return NextResponse.json({ success: false, error: "Booking must be paid before confirming move-in" }, { status: 409 });
    }
    if (booking.movedInConfirmedAt) {
      return NextResponse.json({ success: false, error: "Move-in already confirmed" }, { status: 409 });
    }

    const landlord = booking.property.landlord;
    if (!landlord.paystackRecipientCode) {
      return NextResponse.json(
        { success: false, error: "The landlord has not set up their payout account yet. Please contact them to set it up before confirming move-in." },
        { status: 409 }
      );
    }

    // Amount to transfer — the rent amount paid
    const amountNaira = Number(booking.amount ?? booking.property.price);
    const amountKobo = Math.round(amountNaira * 100);

    // Initiate Paystack transfer
    const transferRes = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amountKobo,
        recipient: landlord.paystackRecipientCode,
        reason: `Rent payment — ${booking.property.title} (Booking ${bookingId})`,
        reference: `PAYOUT-${bookingId}-${Date.now()}`,
      }),
    });

    const transferData = await transferRes.json();

    if (!transferData.status) {
      console.error("[MOVED-IN TRANSFER ERROR]", transferData);
      return NextResponse.json(
        { success: false, error: transferData.message || "Failed to initiate landlord payout. Please try again." },
        { status: 500 }
      );
    }

    // Update booking: confirmed move-in + payout PROCESSING
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        movedInConfirmedAt: new Date(),
        payoutStatus: "PROCESSING",
        ...(moveInDate && { moveInDate: new Date(moveInDate) }),
      },
    });

    // Notify landlord
    notifyUser({
      userId: landlord.id,
      type: "PAYMENT",
      title: "Tenant has moved in",
      message: `${booking.student.name} confirmed move-in for ${booking.property.title}. Your payout is being processed.`,
      link: "/landlord",
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Move-in confirmed! The landlord payout is now being processed.",
      data: { payoutStatus: "PROCESSING", transferReference: transferData.data?.reference },
    });
  } catch (error) {
    console.error("[MOVED-IN ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
