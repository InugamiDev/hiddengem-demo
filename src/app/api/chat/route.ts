import { NextRequest, NextResponse } from "next/server";
import { generateTravelResponse } from "@/lib/gemini";

const chatHistories: Record<string, Array<{ role: "user" | "assistant"; content: string }>> = {};

export async function POST(req: NextRequest) {
  try {
    const { message, formData, sessionId = "default" } = await req.json();

    if (!chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }

    chatHistories[sessionId].push({
      role: "user",
      content: message
    });

    const aiResponse = await generateTravelResponse(
      message,
      formData
    );

    chatHistories[sessionId].push({
      role: "assistant",
      content: aiResponse.response
    });

    if (aiResponse.formData && Object.keys(aiResponse.formData).length > 0) {
      console.log("Received form data:", aiResponse.formData);
    }

    if (aiResponse.functionCall?.data?.suggestions) {
      console.log("Received suggestions:", aiResponse.functionCall.data.suggestions);
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}