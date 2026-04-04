/**
 * POST /api/ai/generate-description
 * Generates a property description using Claude claude-haiku-4-5
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import anthropic from "@/lib/anthropic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await request.json();
    const { title, propertyType, location, amenities, distanceToCampus, genderPreference, annualRent } = body;

    const userMessage = [
      title ? `Title: ${title}` : null,
      propertyType ? `Property Type: ${propertyType}` : null,
      location ? `Location: ${location}` : null,
      distanceToCampus ? `Distance to Campus: ${distanceToCampus}` : null,
      genderPreference ? `Gender Preference: ${genderPreference}` : null,
      annualRent ? `Annual Rent: ₦${annualRent}` : null,
      amenities && Array.isArray(amenities) && amenities.length > 0
        ? `Amenities: ${amenities.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system:
        "You are a Nigerian student housing listing assistant. Write compelling, honest property descriptions for off-campus accommodation listings near Nigerian universities. Keep descriptions concise (3-4 sentences), factual, and friendly. Focus on what students care about: proximity to campus, utilities, security, and value for money. Write in simple, clear English. Do NOT make up details not provided.",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const description =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ success: true, data: { description } });
  } catch (error) {
    console.error("[AI GENERATE DESCRIPTION ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate description." },
      { status: 500 },
    );
  }
}
