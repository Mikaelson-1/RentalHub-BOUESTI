/**
 * GET /api/properties/[id]  — Fetch a single property
 * PUT /api/properties/[id]  — Update a property (landlord owner or admin only)
 * DELETE /api/properties/[id] — Delete a property (landlord owner or admin only)
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sanitizeText, sanitizeStringArray } from '@/lib/sanitize';
import { notifyUser } from '@/lib/notifications';
import { sendBookingCancelledToStudent } from '@/lib/email';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: { select: { id: true, name: true, email: true } },
        location: true,
        _count:   { select: { bookings: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('[PROPERTY GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch property.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    // Fetch existing property to verify ownership
    const existing = await prisma.property.findUnique({
      where: { id },
      select: { landlordId: true, status: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Property not found.' }, { status: 404 });
    }

    const isOwner = session.user.role === 'LANDLORD' && existing.landlordId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'You are not authorised to edit this property.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, locationId, distanceToCampus, amenities } = body;

    if (!title?.trim() || !description?.trim() || !price) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and price are required.' },
        { status: 400 },
      );
    }

    if (locationId) {
      const locationExists = await prisma.location.findUnique({ where: { id: locationId } });
      if (!locationExists) {
        return NextResponse.json({ success: false, error: 'Invalid location.' }, { status: 400 });
      }
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title:            sanitizeText(title, 200),
        description:      sanitizeText(description, 5000),
        price,
        ...(locationId && { locationId }),
        distanceToCampus: distanceToCampus ? Number(distanceToCampus) : null,
        ...(amenities && { amenities: sanitizeStringArray(amenities) }),
        // Editing resets to PENDING so admin re-reviews the updated listing
        status: 'PENDING',
        rejectionReason: null,
      },
      include: { location: true },
    });

    return NextResponse.json({
      success: true,
      data:    updated,
      message: 'Property updated and resubmitted for admin review.',
    });
  } catch (error) {
    console.error('[PROPERTY PUT ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to update property.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const existing = await prisma.property.findUnique({
      where: { id },
      select: { landlordId: true, title: true, location: { select: { name: true } } },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Property not found.' }, { status: 404 });
    }

    const isOwner = session.user.role === 'LANDLORD' && existing.landlordId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'You are not authorised to delete this property.' }, { status: 403 });
    }

    // V39 fix: block deletion of any property with a live or paid booking.
    // Previously only checked `status: 'CONFIRMED'` — which never fires in the
    // current state machine (PENDING → AWAITING_PAYMENT → PAID). That meant a
    // landlord could DELETE a property with a PAID, moved-in tenant, nuking
    // Booking + Payment records via Prisma cascade.
    const blockingCount = await prisma.booking.count({
      where: {
        propertyId: id,
        status: { in: ['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED', 'PAID'] },
      },
    });

    if (blockingCount > 0) {
      // Even admins can't do this through the API — must soft-delete / archive
      // via a future dedicated endpoint with explicit audit trail.
      return NextResponse.json(
        {
          success: false,
          error:
            'Cannot delete a property with active bookings. Cancel or complete all bookings first, or contact engineering for soft-delete.',
        },
        { status: 409 },
      );
    }

    // Also block if the property has EVER had a successful payment — financial
    // record retention (audit, tax, fraud investigation).
    const everPaid = await prisma.payment.count({
      where: { booking: { propertyId: id }, status: { in: ['SUCCESS', 'REFUNDED'] } },
    });
    if (everPaid > 0 && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete a property with payment history. Contact support.',
        },
        { status: 409 },
      );
    }

    // Find unpaid bookings so we can notify those students before the cascade delete
    const unpaidBookings = await prisma.booking.findMany({
      where: { propertyId: id, status: { in: ['PENDING', 'AWAITING_PAYMENT'] } },
      select: {
        id: true,
        student: { select: { id: true, name: true, email: true } },
      },
    });

    if (unpaidBookings.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: unpaidBookings.map((b) => b.id) } },
        data: { status: 'CANCELLED' },
      });

      // Notify students in parallel — don't let a notification failure block deletion
      await Promise.allSettled(
        unpaidBookings.map((b) =>
          Promise.allSettled([
            notifyUser({
              userId:  b.student.id,
              type:    'BOOKING',
              title:   'Booking cancelled',
              message: `Your booking for ${existing.title} has been cancelled because the landlord removed the listing.`,
              link:    '/student',
            }),
            sendBookingCancelledToStudent({
              studentName:     b.student.name ?? 'Student',
              studentEmail:    b.student.email,
              propertyTitle:   existing.title,
              propertyLocation: existing.location.name,
              cancelledBy:     'landlord',
            }),
          ]),
        ),
      );
    }

    // Cascade in schema handles remaining Booking → Payment rows automatically
    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    console.error('[PROPERTY DELETE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property.' }, { status: 500 });
  }
}
