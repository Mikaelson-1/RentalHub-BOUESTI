/**
 * Test Error Endpoint
 * V9 fix: gated behind NODE_ENV + admin session so production can't be used
 * as an error-noise oracle or DoS vector.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }
  throw new Error("Test error from RentalHub - Sentry is working!");
}
