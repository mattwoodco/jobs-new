import { NextResponse } from "next/server";
import { memory } from "@/lib/mastra/memory";

const RESOURCE_ID = "test-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId") || RESOURCE_ID;

    console.log("📋 [GET] Fetching conversations for resourceId:", resourceId);

    // Fetch threads directly from Memory instance
    const threads = await memory.getThreadsByResourceId({
      resourceId,
    });

    console.log(
      "📋 [GET] Found",
      threads.length,
      "conversations:",
      threads.map((t) => ({ id: t.id, title: t.title })),
    );

    return NextResponse.json({ conversations: threads });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, resourceId } = body;

    if (!title || !resourceId) {
      return NextResponse.json(
        { error: "title and resourceId are required" },
        { status: 400 },
      );
    }

    // Create thread directly using Memory instance
    const thread = await memory.createThread({
      title,
      resourceId,
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
