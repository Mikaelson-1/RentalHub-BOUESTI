/**
 * GET /api/locations
 *
 * Returns all locations ordered by classification and name.
 * Used to populate dropdowns in the property listing form.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: [
        { classification: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error('[LOCATIONS GET ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations.' },
      { status: 500 },
    );
  }
}
