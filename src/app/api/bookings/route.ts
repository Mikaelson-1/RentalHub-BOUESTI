/**
 * GET  /api/bookings   — List user's bookings
 * POST /api/bookings   — Create a booking (students only)
 * PATCH /api/bookings  — Update booking status
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { Prisma } from "@prisma/client";
import {
  sendBookingRequestToLandlord,
  sendBookingConfirmedToStudent,
  sendBookingCancelledToStudent,
  sendBookingCancelledToLandlord,
} from '@/lib/email';
import { notifyRole, notifyUser } from '@/lib/notifications';

const bookingWithRelationsInclude = {
  student: { select: { id: true, name: true, email: true } },
  property: { include: { location: true, landlord: { select: { id: true, name: true, email: true } } } },
} satisfies Prisma.BookingInclude;

type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof bookingWithRelationsInclude }>;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const where =
      session.user.role === 'STUDENT'
        ? { studentId: session.user.id }
        : session.user.role === 'LANDLORD'
        ? { property: { landlordId: session.user.id } }
        : {}; // ADMIN sees all

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true } },
        property: {
          include: {
            location: true,
            landlord: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('[BOOKINGS GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Only students can make bookings.' }, { status: 403 });
    }

    const { propertyId, bidAmount } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID is required.' }, { status: 400 });
    }

    // Verify property exists and is approved
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found.' }, { status: 404 });
    }
    if (property.status !== 'APPROVED') {
      return NextResponse.json({ success: false, error: 'This property is not available for booking.' }, { status: 400 });
    }

    // Prevent duplicate active bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        studentId:  session.user.id,
        propertyId,
        status:     { in: ['PENDING', 'CONFIRMED', 'AWAITING_PAYMENT'] },
      },
    });
    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'You already have an active booking for this property.' },
        { status: 409 },
      );
    }

    const normalizedBidAmount =
      bidAmount === undefined || bidAmount === null || bidAmount === ""
        ? Number(property.price)
        : Number(bidAmount);

    if (!Number.isFinite(normalizedBidAmount) || normalizedBidAmount <= 0) {
      return NextResponse.json({ success: false, error: "Bid amount must be a valid number greater than 0." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId:  session.user.id,
        propertyId,
        status:     'PENDING',
        bidAmount:  normalizedBidAmount,
      },
      include: {
        student:  { select: { id: true, name: true, email: true } },
        property: {
          include: {
            location: true,
            landlord: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // Notify the landlord about the new booking request (fire-and-forget)
    sendBookingRequestToLandlord({
      landlordEmail:    booking.property.landlord.email,
      landlordName:     booking.property.landlord.name,
      studentName:      booking.student.name,
      propertyTitle:    booking.property.title,
      propertyLocation: booking.property.location.name,
      bookingId:        booking.id,
    }).catch((err) => console.error('[email] booking request notification failed:', err));

    await Promise.all([
      notifyUser({
        userId: booking.property.landlord.id,
        type: "BOOKING",
        title: "New booking request",
        message: `${booking.student.name} requested to book ${booking.property.title}.`,
        link: "/landlord",
      }),
      notifyUser({
        userId: booking.student.id,
        type: "BOOKING",
        title: "Booking request submitted",
        message: `Your bid of ₦${Math.round(normalizedBidAmount).toLocaleString("en-NG")} for ${booking.property.title} was sent to the landlord.`,
        link: "/student",
      }),
      notifyRole(
        "ADMIN",
        "New booking request",
        `${booking.student.name} requested ${booking.property.title}.`,
        "BOOKING",
        "/admin",
      ),
    ]);

    return NextResponse.json(
      { success: true, data: booking, message: 'Booking request submitted successfully.' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[BOOKINGS POST ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });

    const { bookingId, status } = await request.json();
    if (!bookingId || !status) return NextResponse.json({ success: false, error: "Booking ID and status are required." }, { status: 400 });
    if (!["CONFIRMED", "CANCELLED"].includes(status)) return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        property: {
          include: {
            location: true,
            landlord: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!booking) return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });

    if (session.user.role === "STUDENT") {
      if (booking.studentId !== session.user.id) return NextResponse.json({ success: false, error: "Not your booking." }, { status: 403 });
      if (status !== "CANCELLED") return NextResponse.json({ success: false, error: "Students can only cancel bookings." }, { status: 403 });
    }

    if (session.user.role === "LANDLORD") {
      if (booking.property.landlordId !== session.user.id) return NextResponse.json({ success: false, error: "Not your listing." }, { status: 403 });
    }

    if (status === "CONFIRMED" && session.user.role !== "LANDLORD") {
      return NextResponse.json({ success: false, error: "Only landlords can confirm bookings." }, { status: 403 });
    }

    if (status === "CONFIRMED" && booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: `Cannot confirm booking because it is already ${booking.status}.` },
        { status: 409 },
      );
    }

    let updateData: Record<string, unknown> = { status };
    let autoCancelledLosingBids: {
      id: string;
      student: { id: string; name: string; email: string };
      property: { title: string; location: { name: string } };
    }[] = [];
    let transactionError: { status: number; error: string } | null = null;

    if (status === "CONFIRMED" && session.user.role === "LANDLORD") {
      updateData = {
        status: "AWAITING_PAYMENT",
        amount: booking.bidAmount ?? booking.property.price,
        agencyFee: 0,
        cautionFee: 0,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      };
    }

    // Student/landlord cancels a PAID booking → trigger refund
    if (status === "CANCELLED" && booking.status === "PAID") {
      try {
        const refundResponse = await fetch(new URL("/api/payments/refund", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json", Cookie: request.headers.get("cookie") ?? "" },
          body: JSON.stringify({ bookingId }),
        });
        const refundPayload = await refundResponse.json().catch(() => null);
        if (!refundResponse.ok || !refundPayload?.success) {
          return NextResponse.json(
            { success: false, error: refundPayload?.error || "Failed to initiate refund." },
            { status: refundResponse.status || 500 },
          );
        }
        return NextResponse.json({ success: true, message: "Cancellation and refund initiated." });
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to initiate refund. Please try again." },
          { status: 500 },
        );
      }
    }

    let updatedBooking: BookingWithRelations | null = null;

    if (status === "CONFIRMED" && session.user.role === "LANDLORD") {
      updatedBooking = await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM "properties" WHERE id = ${booking.propertyId} FOR UPDATE`;

        const currentBooking = await tx.booking.findUnique({
          where: { id: bookingId },
          select: {
            id: true,
            status: true,
            propertyId: true,
            bidAmount: true,
            property: { select: { price: true } },
          },
        });

        if (!currentBooking) {
          transactionError = { status: 404, error: "Booking not found." };
          return null;
        }

        if (currentBooking.status !== "PENDING") {
          transactionError = {
            status: 409,
            error: `Cannot confirm booking because it is already ${currentBooking.status}.`,
          };
          return null;
        }

        const [pendingForProperty, acceptedBooking] = await Promise.all([
          tx.booking.findMany({
            where: {
              propertyId: currentBooking.propertyId,
              status: "PENDING",
            },
            select: { id: true, bidAmount: true },
          }),
          tx.booking.findFirst({
            where: {
              propertyId: currentBooking.propertyId,
              id: { not: currentBooking.id },
              status: { in: ["AWAITING_PAYMENT", "PAID"] },
            },
            select: { id: true },
          }),
        ]);

        if (acceptedBooking) {
          transactionError = {
            status: 409,
            error: "A booking for this property is already accepted. Cancel it first to accept another bid.",
          };
          return null;
        }

        if (pendingForProperty.length >= 2) {
          const highestBid = Math.max(
            ...pendingForProperty.map((item) => Number(item.bidAmount ?? currentBooking.property.price)),
          );
          const currentBid = Number(currentBooking.bidAmount ?? currentBooking.property.price);

          if (currentBid < highestBid) {
            transactionError = {
              status: 409,
              error: `Only the highest bid can be accepted when there are multiple booking requests. Highest bid is ₦${Math.round(highestBid).toLocaleString("en-NG")}.`,
            };
            return null;
          }
        }

        const losers = await tx.booking.findMany({
          where: {
            propertyId: currentBooking.propertyId,
            id: { not: currentBooking.id },
            status: "PENDING",
          },
          select: {
            id: true,
            student: { select: { id: true, name: true, email: true } },
            property: { select: { title: true, location: { select: { name: true } } } },
          },
        });
        autoCancelledLosingBids = losers;

        const confirmedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: "AWAITING_PAYMENT",
            amount: currentBooking.bidAmount ?? currentBooking.property.price,
            agencyFee: 0,
            cautionFee: 0,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          },
          include: bookingWithRelationsInclude,
        });

        await tx.booking.updateMany({
          where: {
            propertyId: currentBooking.propertyId,
            id: { not: bookingId },
            status: "PENDING",
          },
          data: { status: "CANCELLED" },
        });

        return confirmedBooking;
      });
    } else {
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: bookingWithRelationsInclude,
      });
    }

    const txError = transactionError as { status: number; error: string } | null;
    if (txError) {
      return NextResponse.json({ success: false, error: txError.error }, { status: txError.status });
    }

    if (!updatedBooking) {
      return NextResponse.json({ success: false, error: "Failed to update booking." }, { status: 500 });
    }

    const { student, property } = updatedBooking;
    const locationName = property.location.name;

    if (updateData.status === "AWAITING_PAYMENT") {
      sendBookingConfirmedToStudent({
        studentEmail: student.email,
        studentName: student.name,
        propertyTitle: property.title,
        propertyLocation: locationName,
        landlordName: property.landlord.name,
      }).catch(console.error);

      await notifyUser({
        userId: student.id,
        type: "BOOKING",
        title: "Booking confirmed",
        message: `${property.title} was confirmed at ₦${Math.round(Number(updatedBooking.amount ?? booking.property.price)).toLocaleString("en-NG")}. Complete payment within 48 hours.`,
        link: `/student/bookings/${updatedBooking.id}`,
      });

      await notifyRole(
        "ADMIN",
        "Winning bid accepted",
        `${property.landlord.name} accepted a bid for ${property.title}.`,
        "BOOKING",
        "/admin",
      );

      if (autoCancelledLosingBids.length > 0) {
        await Promise.all(
          autoCancelledLosingBids.map(async (loser) => {
            await notifyUser({
              userId: loser.student.id,
              type: "BOOKING",
              title: "Bid not selected",
              message: `Another student placed a higher winning bid for ${loser.property.title}.`,
              link: "/student?tab=bookings",
            });
            await sendBookingCancelledToStudent({
              studentEmail: loser.student.email,
              studentName: loser.student.name,
              propertyTitle: loser.property.title,
              propertyLocation: loser.property.location.name,
              cancelledBy: "landlord",
            });
          }),
        );
      }
    }

    if (status === "CANCELLED") {
      const cancelledBy = session.user.role === "STUDENT" ? "student" : "landlord";
      sendBookingCancelledToStudent({
        studentEmail: student.email,
        studentName: student.name,
        propertyTitle: property.title,
        propertyLocation: locationName,
        cancelledBy,
      }).catch(console.error);
      if (cancelledBy === "student") {
        sendBookingCancelledToLandlord({
          landlordEmail: property.landlord.email,
          landlordName: property.landlord.name,
          studentName: student.name,
          propertyTitle: property.title,
          propertyLocation: locationName,
        }).catch(console.error);

        await notifyUser({
          userId: property.landlord.id,
          type: "BOOKING",
          title: "Booking cancelled by student",
          message: `${student.name} cancelled booking for ${property.title}.`,
          link: "/landlord",
        });
      } else {
        await notifyUser({
          userId: student.id,
          type: "BOOKING",
          title: "Booking cancelled by landlord",
          message: `Your booking for ${property.title} was cancelled by the landlord.`,
          link: "/student",
        });
      }
    }

    return NextResponse.json({ success: true, data: updatedBooking, message: `Booking updated.` });
  } catch (error) {
    console.error("[BOOKINGS PATCH ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update booking." }, { status: 500 });
  }
}
