/**
 * POST /api/ai/check-listing
 * Detects potential scam/fraud signals in a property listing using Claude claude-haiku-4-5
 */

import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "title and description are required." },
        { status: 400 },
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system:
        "You are a fraud detection assistant for a Nigerian student housing platform. Analyze property listing text for scam signals commonly seen in Nigeria advance-fee fraud, particularly targeting students. Check for: urgency pressure ('pay now or lose it', 'only today'), requests to pay via WhatsApp or personal bank transfer instead of platform, suspiciously low prices far below market rate for Nigerian student housing, promises that seem too good to be true, requests for advance payment before viewing, threats or emotional manipulation, unrealistic claims (mansion for ₦10k/month). Respond ONLY with valid JSON: { \"flagged\": boolean, \"confidence\": \"low\"|\"medium\"|\"high\", \"reasons\": string[] }. If not flagged, reasons should be empty array.",
      messages: [
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "{}";

    let parsed: { flagged: boolean; confidence: string; reasons: string[] };
    try {
      // Strip markdown code fences if present
      const clean = rawText.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { flagged: false, confidence: "low", reasons: [] };
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("[AI CHECK LISTING ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to check listing." },
      { status: 500 },
    );
  }
}
