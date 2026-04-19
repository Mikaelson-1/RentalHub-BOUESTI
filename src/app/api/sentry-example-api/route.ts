import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// V9 fix: Sentry example route gated in production. Dev/preview can still use
// it freely; prod requires ADMIN role so it can't be weaponised for noise.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }
  Sentry.logger.info("Sentry example API called");
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );
}
