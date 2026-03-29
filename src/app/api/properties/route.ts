/**
 * GET  /api/properties       — List/search properties
 * POST /api/properties       — Create a property (landlords only)
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { PropertyStatus } from '@prisma/client';

// ── GET — Browse approved properties ─────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const location  = searchParams.get('location') ?? undefined;
    const status    = (searchParams.get('status') as PropertyStatus) ?? 'APPROVED';
    const minPrice  = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice  = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const page      = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const pageSize  = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? '12')));
    const sortBy    = (searchParams.get('sortBy') ?? 'createdAt') as 'price' | 'createdAt' | 'distanceToCampus';
    const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc';

    const where = {
      status,
      ...(location && { location: { name: { contains: location, mode: 'insensitive' as const } } }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) } }
        : {}),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          landlord: { select: { id: true, name: true, email: true, verificationStatus: true } },
          location: true,
          _count:   { select: { bookings: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items:      properties,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('[PROPERTIES GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties.' }, { status: 500 });
  }
}

// ── POST — Create a property listing ─────────────────────

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    if (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Only landlords can list properties.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, locationId, distanceToCampus, amenities = [], images = [] } = body;

    if (!title?.trim() || !description?.trim() || !price || !locationId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, price, and location are required.' },
        { status: 400 },
      );
    }

    const locationExists = await prisma.location.findUnique({ where: { id: locationId } });
    if (!locationExists) {
      return NextResponse.json({ success: false, error: 'Invalid location.' }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        title:            title.trim(),
        description:      description.trim(),
        price,
        locationId,
        landlordId:       session.user.id,
        distanceToCampus: distanceToCampus ? Number(distanceToCampus) : null,
        amenities,
        images,
        status:           'PENDING',
      },
      include: { location: true },
    });

    return NextResponse.json(
      { success: true, data: property, message: 'Property submitted for review.' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[PROPERTIES POST ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to create property.' }, { status: 500 });
  }
}
