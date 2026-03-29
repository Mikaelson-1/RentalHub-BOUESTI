/**
 * GET  /api/bookings   — List user's bookings
 * POST /api/bookings   — Create a booking (students only)
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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

    const { propertyId } = await request.json();

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
        status:     { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'You already have an active booking for this property.' },
        { status: 409 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        studentId:  session.user.id,
        propertyId,
        status:     'PENDING',
      },
      include: {
        property: { include: { location: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: booking, message: 'Booking request submitted successfully.' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[BOOKINGS POST ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking.' }, { status: 500 });
  }
}
