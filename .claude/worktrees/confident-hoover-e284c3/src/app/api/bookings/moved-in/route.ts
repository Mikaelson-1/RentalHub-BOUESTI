/**
 * POST /api/bookings/moved-in
 * Student confirms they have moved in.
 * Sets movedInConfirmedAt, updates moveInDate if provided,
 * then notifies all admins so they can manually release the payout to the landlord.
 * Body: { bookingId, moveInDate? }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";
import { sendMoveInConfirmedToStudent, sendMoveInConfirmedToLandlord } from "@/lib/email";

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
            location: { select: { name: true } },
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
                bankAccountNumber: true,
                bankName: true,
                bankAccountName: true,
              },
            },
          },
        },
        student: { select: { id: true, name: true, email: true } },
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

    // Update booking: confirmed move-in, payout stays PENDING until admin releases it
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        movedInConfirmedAt: new Date(),
        payoutStatus: "PENDING",
        ...(moveInDate && { moveInDate: new Date(moveInDate) }),
      },
    });

    const amountNaira = Number(booking.amount ?? booking.property.price);
    const movedInDateStr = new Date().toLocaleDateString("en-NG", { dateStyle: "medium" });

    // Notify landlord (in-app)
    notifyUser({
      userId: landlord.id,
      type: "PAYMENT",
      title: "Tenant has moved in",
      message: `${booking.student.name} confirmed move-in for ${booking.property.title}. RentalHub will release your payment shortly.`,
      link: "/landlord",
    }).catch(console.error);

    // Email landlord
    sendMoveInConfirmedToLandlord({
      landlordEmail: landlord.email,
      landlordName: landlord.name,
      studentName: booking.student.name,
      propertyTitle: booking.property.title,
      amount: amountNaira.toLocaleString("en-NG"),
      movedInDate: movedInDateStr,
    }).catch(console.error);

    // Email student
    sendMoveInConfirmedToStudent({
      studentEmail: booking.student.email,
      studentName: booking.student.name,
      propertyTitle: booking.property.title,
      propertyLocation: booking.property.location?.name ?? "",
      landlordName: landlord.name,
      movedInDate: movedInDateStr,
    }).catch(console.error);

    // Notify all admins so they can manually process the payout
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    // V21 fix: do NOT store the landlord's full bank account number in the
    // Notification table. Admin can see full details on /admin/payouts when
    // they actively view the record. Mask to last-4 here.
    const maskedAccount = landlord.bankAccountNumber
      ? `•••• ${landlord.bankAccountNumber.slice(-4)}`
      : "(not set)";

    await Promise.all(
      admins.map((admin) =>
        notifyUser({
          userId: admin.id,
          type: "PAYMENT",
          title: "Payout action required",
          message: `${booking.student.name} has moved into ${booking.property.title}. Release ₦${amountNaira.toLocaleString("en-NG")} to ${landlord.name} (${landlord.bankName ?? "bank"} ${maskedAccount}). View full details in /admin/payouts.`,
          link: "/admin",
        }).catch(console.error),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "Move-in confirmed! RentalHub will release the payment to your landlord shortly.",
      data: { payoutStatus: "PENDING" },
    });
  } catch (error) {
    console.error("[MOVED-IN ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
