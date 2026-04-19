/**
 * File Access Control Endpoint
 *
 * V1 fix: This route now *actually* streams the file from Vercel Blob after
 * performing auth/role checks. The prior version only returned the blobPath,
 * which was a no-op because the blob itself is stored with public access —
 * anyone who guessed the path could fetch it directly from the CDN.
 *
 * Authorization matrix:
 *   uploads/governmentId/*     ADMIN only, or the landlord who uploaded it
 *   uploads/verification/*     ADMIN only, or the landlord who uploaded it
 *   uploads/selfie/*           ADMIN only, or the user who uploaded it
 *   uploads/ownershipProof/*   ADMIN only, or the landlord who uploaded it
 *   uploads/avatar/*           Any authenticated user (public-ish profile pics)
 *   uploads/image/*            Any authenticated user (property photos)
 *   uploads/video/*            Any authenticated user (property videos)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { head } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const RESTRICTED_CATEGORIES = ["governmentId", "verification", "selfie", "ownershipProof"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { path } = await params;

    // ── Path-traversal defense ──────────────────────────────────────────
    // Any segment containing "..", "/", or "\" is rejected. Blob paths we write
    // only contain [a-z0-9.\-_/], so reject anything else to prevent walking
    // into unexpected parts of the blob namespace.
    if (
      !path?.length ||
      path.some((seg) => seg.includes("..") || seg.includes("\\") || !/^[a-zA-Z0-9._\-]+$/.test(seg))
    ) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const blobPath = path.join("/");

    // ── Authorization check ─────────────────────────────────────────────
    // Expected layout: uploads/<category>/<filename>
    const [root, category] = path;
    if (root !== "uploads" || !category) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const isRestricted = RESTRICTED_CATEGORIES.includes(category);
    if (isRestricted && session.user.role !== "ADMIN") {
      // TODO: extend with "owner of upload can view own verification doc"
      // once we track uploader→blobPath mapping. For now, admin-only.
      return NextResponse.json(
        { error: "Unauthorized — verification documents are admin-only" },
        { status: 403 },
      );
    }

    // ── Stream the blob ─────────────────────────────────────────────────
    let info;
    try {
      info = await head(blobPath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const upstream = await fetch(info.url);
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": info.contentType || "application/octet-stream",
        "Content-Length": String(info.size ?? ""),
        "Cache-Control": isRestricted
          ? "private, no-store"
          : "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[FILE ACCESS CONTROL ERROR]", error);
    return NextResponse.json({ error: "Failed to access file" }, { status: 500 });
  }
}

// Method guards
export async function POST()   { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
