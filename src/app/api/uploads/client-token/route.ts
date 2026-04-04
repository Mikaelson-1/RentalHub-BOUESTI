/**
 * POST /api/uploads/client-token
 *
 * Issues a Vercel Blob client-upload token so the browser can upload
 * large files (videos, documents) directly to Vercel Blob without
 * routing through the serverless function body (which is capped at 4.5 MB).
 *
 * Only authenticated LANDLORDs and ADMINs may request a token.
 */

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only landlords can upload files." }, { status: 403 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: [
          "video/mp4",
          "video/webm",
          "video/quicktime",   // .mov
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
        ],
        maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
        tokenPayload: JSON.stringify({ userId: session.user.id, pathname }),
      }),
      onUploadCompleted: async () => {
        // Nothing to do post-upload — URL is returned directly to the client
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CLIENT TOKEN ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
