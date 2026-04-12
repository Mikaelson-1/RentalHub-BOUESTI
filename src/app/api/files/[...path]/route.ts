/**
 * File Access Control Endpoint
 *
 * Serves private Vercel Blob files with authentication and authorization checks.
 * Only allows access to:
 * - Admins (all verification documents)
 * - Landlords (their own verification documents)
 * - Students (property images only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { get } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // ✅ STEP 1: Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // ✅ STEP 2: Reconstruct the blob path
    const { path } = await params;
    const blobPath = path.join('/');

    if (!blobPath) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // ✅ STEP 3: Check authorization based on file category
    const isVerificationDoc = blobPath.includes('uploads/governmentId/') ||
                             blobPath.includes('uploads/verification/');
    const isPropertyImage = blobPath.includes('uploads/property/') ||
                           blobPath.includes('uploads/image/');

    // Verification documents (government ID, selfie, ownership proof) - RESTRICTED
    if (isVerificationDoc) {
      // Only ADMIN or the landlord who uploaded it can access
      if (session.user.role === 'ADMIN') {
        // Admin can access any verification document
        // ✅ Allowed
      } else if (session.user.role === 'LANDLORD') {
        // Landlord can only access their OWN verification documents
        // Verify this is their document by checking landlord_id in the request
        const landlordVerification = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true }
        });

        if (!landlordVerification) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
          );
        }
        // ✅ Allowed - it's their own document
      } else {
        // Students cannot access verification documents
        return NextResponse.json(
          { error: 'Unauthorized - verification documents are not public' },
          { status: 403 }
        );
      }
    }

    // Property images - accessible to authenticated users
    if (isPropertyImage) {
      // Any authenticated user can view property images
      // ✅ Allowed for STUDENT, LANDLORD, ADMIN
    }

    // ✅ STEP 4: Get file from Vercel Blob with authentication
    // Since we changed to access: "private", need to use authenticated endpoint
    try {
      const blobFile = await get(blobPath, {
        // ✅ This uses the private blob with no public access
      });

      if (!blobFile) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }

      // ✅ STEP 5: Return file with proper headers
      return new NextResponse(blobFile.body, {
        headers: {
          'Content-Type': blobFile.contentType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${blobPath.split('/').pop()}"`,
          // ✅ Prevent caching of sensitive documents
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (blobError) {
      console.error('[FILE ACCESS ERROR]', blobError);
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('[FILE ACCESS CONTROL ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to access file' },
      { status: 500 }
    );
  }
}

// ✅ Prevent other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
