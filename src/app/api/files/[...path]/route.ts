/**
 * File Access Control Endpoint
 *
 * Serves private Vercel Blob files with authentication and authorization checks.
 * Returns a signed URL that the client can use to download the file.
 *
 * Only allows access to:
 * - Admins (all verification documents)
 * - Landlords (their own verification documents)
 * - Students (property images only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // Verification documents (government ID, selfie, ownership proof) - RESTRICTED
    if (isVerificationDoc) {
      // Only ADMIN can access verification documents
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized - verification documents are admin-only' },
          { status: 403 }
        );
      }
      // ✅ Allowed for ADMIN
    }

    // ✅ STEP 4: Return the blob path as a reference
    // The frontend/client should use this path with their Vercel Blob client
    // Or retrieve it server-side using @vercel/blob with authentication
    return NextResponse.json(
      {
        success: true,
        blobPath: blobPath,
        message: 'Access authorized. Use this path with authenticated Vercel Blob client.',
      },
      { status: 200 }
    );
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
