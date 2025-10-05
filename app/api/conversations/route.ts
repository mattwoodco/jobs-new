import { NextResponse } from "next/server";
import { memory } from "@/lib/mastra/memory";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId") || "default";

    // Get all threads for the resource
    const threads = await memory.getThreadsByResourceId({
      resourceId,
      orderBy: "createdAt",
      sortDirection: "DESC",
    });

    return NextResponse.json({ conversations: threads });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}
