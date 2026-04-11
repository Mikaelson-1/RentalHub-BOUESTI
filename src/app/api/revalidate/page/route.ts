import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint for homepage and properties.
 * Trigger manually when properties are added/updated.
 *
 * Usage:
 * POST /api/revalidate/page?path=/&secret=YOUR_SECRET
 * POST /api/revalidate/page?path=/properties&secret=YOUR_SECRET
 */

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const path = req.nextUrl.searchParams.get('path') || '/';

  // Validate secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    await revalidatePath(path);
    return NextResponse.json(
      { message: `Revalidated: ${path}`, revalidated: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    );
  }
}
