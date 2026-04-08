import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTestEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const targetEmail =
      typeof body?.to === "string" && body.to.trim().length > 0
        ? body.to.trim().toLowerCase()
        : session.user.email;

    if (!targetEmail || !targetEmail.includes("@")) {
      return NextResponse.json({ success: false, error: "A valid email is required." }, { status: 400 });
    }

    await sendTestEmail({
      to: targetEmail,
      requestedBy: `${session.user.name} (${session.user.email})`,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${targetEmail}.`,
      data: { to: targetEmail },
    });
  } catch (error) {
    console.error("[DEBUG EMAIL TEST ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to send test email." }, { status: 500 });
  }
}

