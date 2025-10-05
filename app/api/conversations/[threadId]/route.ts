import { NextResponse } from "next/server";
import { memory } from "@/lib/mastra/memory";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

    // Get thread details directly from Memory instance
    const thread = await memory.getThreadById({ threadId });

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Get messages for the thread directly from Memory instance
    const messagesData = await memory.query({ threadId });

    return NextResponse.json({
      thread,
      messages: messagesData?.messages || [],
      uiMessages: messagesData?.uiMessages || [],
    });
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation details" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

    console.log("🗑️  [DELETE] Attempting to delete thread:", threadId);

    // Delete thread from Memory instance
    await memory.deleteThread(threadId);

    console.log("✅ [DELETE] Thread deleted successfully:", threadId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ [DELETE] Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 },
    );
  }
}
