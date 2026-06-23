/**
 * GET  /api/bookings/[id] — Get a single booking (student own or landlord or admin)
 * PATCH /api/bookings/[id] — Landlord-only: confirm or cancel a booking for their property.
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { BookingStatus } from '@prisma/client';
import {
  sendBookingCancelledToStudent,
  sendBookingConfirmedToStudent,
} from '@/lib/email';
import { notifyUser } from '@/lib/notifications';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            location: true,
            landlord: { select: { id: true, name: true, email: true, phoneNumber: true } },
          },
        },
        student: { select: { id: true, name: true, email: true } },
        payments: {
          where: { status: "SUCCESS" },
          select: { paystackRef: true, amount: true, channel: true, paidAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });

    const role = session.user.role;
    const userId = session.user.id;
    const isOwner = role === "STUDENT" && booking.studentId === userId;
    const isLandlord = role === "LANDLORD" && booking.property.landlordId === userId;
    const isAdmin = role === "ADMIN";

    if (!isOwner && !isLandlord && !isAdmin) {
      return NextResponse.json({ success: false, error: "Not authorized." }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[BOOKING GET ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    if (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Only landlords can update booking status.' }, { status: 403 });
    }

    const body = await request.json();
    const { status }: { status: BookingStatus } = body;

    if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be CONFIRMED or CANCELLED.' },
        { status: 400 },
      );
    }

    // Fetch the booking and verify the landlord owns the property
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        bidAmount: true,
        amount: true,
        studentId: true,
        property: {
          select: {
            id: true,
            landlordId: true,
            title: true,
            price: true,
            landlord: { select: { name: true } },
            location: { select: { name: true } },
          },
        },
        student: { select: { id: true, email: true, name: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    // Landlords can only update bookings for their own properties
    if (session.user.role === 'LANDLORD' && booking.property.landlordId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'You can only manage bookings for your own properties.' }, { status: 403 });
    }

    if (status === "CONFIRMED" && booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: `Cannot confirm a booking that is already ${booking.status}.` },
        { status: 409 },
      );
    }

    let transactionError: { status: number; error: string } | null = null;
    let autoCancelledLosingBids: {
      id: string;
      student: { id: string; name: string; email: string };
      property: { title: string; location: { name: string } };
    }[] = [];

    const updated = await prisma.$transaction(async (tx) => {
      if (status === "CONFIRMED") {
        await tx.$queryRaw`SELECT id FROM "properties" WHERE id = ${booking.property.id} FOR UPDATE`;

        const currentBooking = await tx.booking.findUnique({
          where: { id },
          select: {
            id: true,
            status: true,
            propertyId: true,
            bidAmount: true,
            amount: true,
            property: { select: { price: true } },
          },
        });

        if (!currentBooking) {
          transactionError = { status: 404, error: "Booking not found." };
          return null;
        }

        if (currentBooking.status !== "PENDING") {
          transactionError = { status: 409, error: `Cannot confirm a booking that is already ${currentBooking.status}.` };
          return null;
        }

        const [pendingForProperty, acceptedBooking] = await Promise.all([
          tx.booking.findMany({
            where: { propertyId: currentBooking.propertyId, status: "PENDING" },
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
          const highestBid = Math.max(...pendingForProperty.map((entry) => Number(entry.bidAmount ?? currentBooking.property.price)));
          const currentBid = Number(currentBooking.bidAmount ?? currentBooking.property.price);
          if (currentBid < highestBid) {
            transactionError = {
              status: 409,
              error: `Only highest bid can be accepted. Highest bid is ₦${Math.round(highestBid).toLocaleString("en-NG")}.`,
            };
            return null;
          }
        }

        autoCancelledLosingBids = await tx.booking.findMany({
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

        const selected = await tx.booking.update({
          where: { id },
          data: {
            status: "AWAITING_PAYMENT",
            amount: currentBooking.bidAmount ?? currentBooking.amount ?? currentBooking.property.price,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          },
          include: {
            student:  { select: { id: true, name: true, email: true } },
            property: {
              select: {
                id: true,
                title: true,
                location: { select: { name: true } },
                landlord: { select: { id: true, name: true } },
              },
            },
          },
        });

        await tx.booking.updateMany({
          where: {
            propertyId: currentBooking.propertyId,
            id: { not: currentBooking.id },
            status: "PENDING",
          },
          data: { status: "CANCELLED" },
        });

        return selected;
      }

      return tx.booking.update({
        where: { id },
        data: { status },
        include: {
          student:  { select: { id: true, name: true, email: true } },
          property: {
            select: {
              id: true,
              title: true,
              location: { select: { name: true } },
              landlord: { select: { id: true, name: true } },
            },
          },
        },
      });
    });

    const txError = transactionError as { status: number; error: string } | null;
    if (txError) {
      return NextResponse.json({ success: false, error: txError.error }, { status: txError.status });
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Failed to update booking." }, { status: 500 });
    }

    if (status === "CONFIRMED") {
      sendBookingConfirmedToStudent({
        studentEmail: updated.student.email,
        studentName: updated.student.name,
        propertyTitle: updated.property.title,
        propertyLocation: updated.property.location.name,
        landlordName: updated.property.landlord.name,
      }).catch(console.error);

      await notifyUser({
        userId: updated.student.id,
        type: "BOOKING",
        title: "Booking confirmed",
        message: `${updated.property.title} was confirmed. Complete payment within 48 hours.`,
        link: `/student/bookings/${updated.id}`,
      });

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
      sendBookingCancelledToStudent({
        studentEmail: updated.student.email,
        studentName: updated.student.name,
        propertyTitle: updated.property.title,
        propertyLocation: updated.property.location.name,
        cancelledBy: "landlord",
      }).catch(console.error);

      await notifyUser({
        userId: updated.student.id,
        type: "BOOKING",
        title: "Booking cancelled",
        message: `Your booking for ${updated.property.title} was cancelled by the landlord.`,
        link: "/student",
      });
    }

    return NextResponse.json({
      success: true,
      data:    updated,
      message: status === "CONFIRMED" ? "Booking confirmed. Awaiting student payment." : "Booking cancelled successfully.",
    });
  } catch (error) {
    console.error('[BOOKING PATCH ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking.' }, { status: 500 });
  }
}
