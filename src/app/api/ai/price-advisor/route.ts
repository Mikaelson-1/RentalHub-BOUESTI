/**
 * GET /api/ai/price-advisor?locationId=&propertyType=
 * Returns market pricing stats and an AI insight for a given location/type.
 * No auth required — public data.
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import anthropic from "@/lib/anthropic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId") ?? undefined;
    const propertyType = searchParams.get("propertyType") ?? "";

    // Get APPROVED properties for the given location (or all if not specified)
    let properties = await prisma.property.findMany({
      where: {
        status: "APPROVED",
        ...(locationId ? { locationId } : {}),
      },
      select: { price: true },
      take: 500,
    });

    // Fallback: if fewer than 3 results, widen search to all approved properties
    if (properties.length < 3) {
      properties = await prisma.property.findMany({
        where: { status: "APPROVED" },
        select: { price: true },
        take: 500,
      });
    }

    if (properties.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          min: 0,
          max: 0,
          median: 0,
          average: 0,
          count: 0,
          insight: "No listings found in this area yet. Be the first to set the market price!",
          currency: "NGN",
        },
      });
    }

    const prices = properties
      .map((p) => Number(p.price))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    const min = prices[0];
    const max = prices[prices.length - 1];
    const average = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
    const mid = Math.floor(prices.length / 2);
    const median =
      prices.length % 2 === 0
        ? Math.round((prices[mid - 1] + prices[mid]) / 2)
        : prices[mid];

    const statsText = `Property type: ${propertyType || "general"}\nListings analysed: ${prices.length}\nMin: ₦${min.toLocaleString("en-NG")}\nMax: ₦${max.toLocaleString("en-NG")}\nAverage: ₦${average.toLocaleString("en-NG")}\nMedian: ₦${median.toLocaleString("en-NG")}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 150,
      system:
        "You are a rental pricing advisor for Nigerian student housing. Given market statistics, write a friendly 1-2 sentence insight to help a landlord price their property competitively. Be concise and specific. Mention the median as the sweet spot.",
      messages: [{ role: "user", content: statsText }],
    });

    const insight =
      message.content[0].type === "text"
        ? message.content[0].text.trim()
        : "Price competitively around the market median for best results.";

    return NextResponse.json({
      success: true,
      data: { min, max, median, average, count: prices.length, insight, currency: "NGN" },
    });
  } catch (error) {
    console.error("[AI PRICE ADVISOR ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load price advisor." },
      { status: 500 },
    );
  }
}
