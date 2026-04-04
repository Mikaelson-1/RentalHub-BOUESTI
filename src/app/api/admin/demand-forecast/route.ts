/**
 * GET /api/admin/demand-forecast?school=
 * AI-powered demand forecast for admin. Requires ADMIN role.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import anthropic from "@/lib/anthropic";
import { SCHOOL_LOCATION_KEYWORDS } from "@/lib/schools";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const school = searchParams.get("school") ?? undefined;

    // Build location filter
    const locationNameFilters = school
      ? (SCHOOL_LOCATION_KEYWORDS[school] ?? [school])
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    const locationFilter =
      locationNameFilters.length > 0
        ? {
            location: {
              OR: locationNameFilters.map((keyword) => ({
                name: { contains: keyword, mode: "insensitive" as const },
              })),
            },
          }
        : {};

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // For bookings, filter via property's location
    const bookingPropertyFilter =
      locationNameFilters.length > 0
        ? {
            property: {
              location: {
                OR: locationNameFilters.map((keyword) => ({
                  name: { contains: keyword, mode: "insensitive" as const },
                })),
              },
            },
          }
        : {};

    const [allBookings, totalApproved, totalPending] =
      await Promise.all([
        // All bookings in last 12 months
        prisma.booking.findMany({
          where: {
            createdAt: { gte: twelveMonthsAgo },
            ...bookingPropertyFilter,
          },
          select: { createdAt: true, status: true },
          take: 500,
        }),
        // Total approved properties
        prisma.property.count({
          where: { status: "APPROVED", ...locationFilter },
        }),
        // Total pending properties
        prisma.property.count({
          where: { status: "PENDING", ...locationFilter },
        }),
      ]);

    // Group bookings by month in JS
    const monthMap: Record<string, number> = {};
    const statusMap: Record<string, number> = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 };
    for (const booking of allBookings) {
      const d = new Date(booking.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] ?? 0) + 1;
      if (booking.status in statusMap) {
        statusMap[booking.status] = (statusMap[booking.status] ?? 0) + 1;
      }
    }

    // Build sorted monthly array for last 12 months
    const monthlyBookings: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyBookings.push({ month: key, count: monthMap[key] ?? 0 });
    }

    // Build status breakdown
    const bookingStatusBreakdown = {
      PENDING: statusMap.PENDING ?? 0,
      CONFIRMED: statusMap.CONFIRMED ?? 0,
      CANCELLED: statusMap.CANCELLED ?? 0,
    };

    const totalBookingsLast12 = allBookings.length;
    const avgMonthly = totalBookingsLast12 > 0 ? (totalBookingsLast12 / 12).toFixed(1) : "0";
    const peakMonth = monthlyBookings.reduce((a, b) => (b.count > a.count ? b : a), { month: "N/A", count: 0 });

    const dataSummary = `
School filter: ${school ?? "All schools"}
Total approved listings: ${totalApproved}
Total pending listings: ${totalPending}
Bookings in last 12 months: ${totalBookingsLast12}
Average bookings per month: ${avgMonthly}
Peak booking month: ${peakMonth.month} (${peakMonth.count} bookings)
Confirmed bookings: ${bookingStatusBreakdown.CONFIRMED}
Pending bookings: ${bookingStatusBreakdown.PENDING}
Cancelled bookings: ${bookingStatusBreakdown.CANCELLED}
Monthly breakdown (last 12 months): ${monthlyBookings.map((m) => `${m.month}: ${m.count}`).join(", ")}
`.trim();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system:
        "You are a housing demand analyst for a Nigerian university student housing platform. Based on booking trends, generate a brief demand forecast and actionable recommendations for the admin. Be specific about patterns you see.",
      messages: [{ role: "user", content: dataSummary }],
    });

    const forecast =
      message.content[0].type === "text"
        ? message.content[0].text.trim()
        : "Insufficient data to generate a forecast at this time.";

    return NextResponse.json({
      success: true,
      data: {
        monthlyBookings,
        bookingStatusBreakdown,
        totalApproved,
        totalPending,
        forecast,
      },
    });
  } catch (error) {
    console.error("[DEMAND FORECAST ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate demand forecast." },
      { status: 500 },
    );
  }
}
