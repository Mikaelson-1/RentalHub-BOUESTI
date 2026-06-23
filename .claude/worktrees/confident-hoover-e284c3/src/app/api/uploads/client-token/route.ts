/**
 * POST /api/uploads/client-token
 *
 * V28/V29 fix: issues a tightly-scoped Vercel Blob client-upload token.
 * - Narrow allowedContentTypes per category.
 * - Reasonable per-category size caps (not blanket 100 MB).
 * - Server generates the pathname; the client-declared pathname is IGNORED.
 *   Prior version allowed the client to choose the blob path, which let a
 *   malicious landlord overwrite another user's verification document.
 * - Per-user rate limit.
 *
 * Only authenticated LANDLORDs and ADMINs may request a token.
 */

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const CATEGORY_RULES = {
  video: {
    types: ["video/mp4", "video/webm", "video/quicktime"],
    maxBytes: 50 * 1024 * 1024, // 50 MB
    restricted: false,
  },
  image: {
    types: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
    restricted: false,
  },
  verificationDocument: {
    types: ["application/pdf", "image/jpeg", "image/png"],
    maxBytes: 5 * 1024 * 1024,
    restricted: true,
  },
  governmentId: {
    types: ["application/pdf", "image/jpeg", "image/png"],
    maxBytes: 5 * 1024 * 1024,
    restricted: true,
  },
  selfie: {
    types: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
    restricted: true,
  },
  ownershipProof: {
    types: ["application/pdf", "image/jpeg", "image/png"],
    maxBytes: 5 * 1024 * 1024,
    restricted: true,
  },
} as const;
type Category = keyof typeof CATEGORY_RULES;

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only landlords can upload files." }, { status: 403 });
  }

  // Per-user rate limit: 20 client tokens / 10 min. Tight enough to blunt
  // bulk uploads; loose enough for a landlord uploading a property video.
  const rl = await rateLimit(`client-token:${session.user.id}`, { limit: 20, windowSeconds: 600 });
  if (!rl.success) {
    return NextResponse.json(
      { error: `Too many upload requests. Try again in ${rl.retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  // Require the caller to declare which category this upload is for so we can
  // size-cap and content-type-restrict appropriately. Accepts ?category=...
  const url = new URL(request.url);
  const category = (url.searchParams.get("category") ?? "video") as Category;
  const rules = CATEGORY_RULES[category];
  if (!rules) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // V29 fix: DISCARD the client-provided pathname entirely. Generate a
        // server-controlled path that cannot collide with or overwrite any
        // other user's upload.
        const ts = Date.now();
        const ext = rules.types[0].startsWith("video") ? ".mp4"
          : rules.types[0].startsWith("image") ? ".jpg"
          : ".pdf";
        const finalName = `${ts}-${randomUUID()}${ext}`;
        const pathname = rules.restricted
          ? `uploads/${category}/${session.user.id}/${finalName}`
          : `uploads/${category}/${finalName}`;
        return {
          allowedContentTypes: rules.types as unknown as string[],
          maximumSizeInBytes: rules.maxBytes,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ userId: session.user.id, pathname, category }),
          pathname,
        } as unknown as Awaited<ReturnType<NonNullable<Parameters<typeof handleUpload>[0]["onBeforeGenerateToken"]>>>;
      },
      onUploadCompleted: async () => {
        // Nothing to do post-upload — URL returned directly to the client.
        // V16's magic-byte sniff applies on small uploads via /api/uploads.
        // For client-direct uploads we rely on Paystack-style trust +
        // category + size caps. Future: add a post-upload validator.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CLIENT TOKEN ERROR]", msg);
    return NextResponse.json({ error: "Upload token request failed." }, { status: 400 });
  }
}
