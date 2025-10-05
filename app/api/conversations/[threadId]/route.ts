import { NextResponse } from "next/server";
import { memory } from "@/lib/mastra/memory";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

    // Get thread details
    const thread = await memory.getThreadById({ threadId });

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Get messages for the thread
    const { messages, uiMessages } = await memory.query({
      threadId,
    });

    return NextResponse.json({
      thread,
      messages,
      uiMessages,
    });
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation details" },
      { status: 500 },
    );
  }
}
