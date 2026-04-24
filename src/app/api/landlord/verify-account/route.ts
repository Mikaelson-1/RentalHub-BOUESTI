/**
 * GET /api/landlord/verify-account?account_number=XXX&bank_code=XXX
 * Resolves a bank account name via Paystack.
 * Used client-side to auto-fill the account name for landlord verification.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "LANDLORD") {
      return NextResponse.json({ success: false, error: "Only landlords can verify accounts" }, { status: 403 });
    }

    // V26 fix: rate limit to prevent PII harvesting via Paystack account resolution.
    // Without this, any landlord could enumerate 10^10 account numbers → real names.
    const rl = await rateLimit(`verify-account:${session.user.id}`, { limit: 10, windowSeconds: 3600 });
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: `Too many account-verification attempts. Try again in ${rl.retryAfter} seconds.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }

    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get("account_number");
    const bankCode = searchParams.get("bank_code");

    if (!accountNumber || !bankCode) {
      return NextResponse.json({ success: false, error: "account_number and bank_code are required" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json({ success: false, error: "Account number must be 10 digits" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        { success: false, error: data.message || "Could not resolve account. Check the details and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      accountName: data.data.account_name,
      accountNumber: data.data.account_number,
    });
  } catch (error) {
    console.error("[VERIFY ACCOUNT ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
