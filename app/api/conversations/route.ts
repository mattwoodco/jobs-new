import { NextResponse } from "next/server";

const MASTRA_API_URL = "http://localhost:3020";
const AGENT_ID = "workflowAgent";
const RESOURCE_ID = "test-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId") || RESOURCE_ID;

    // Fetch threads from Mastra API for persistent database storage
    const url = `${MASTRA_API_URL}/api/memory/threads?resourceid=${resourceId}&agentId=${AGENT_ID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mastra API returned ${response.status}`);
    }

    const threads = await response.json();
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

    // Create thread via Mastra API for persistent database storage
    const url = `${MASTRA_API_URL}/api/memory/threads?agentId=${AGENT_ID}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        resourceId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mastra API returned ${response.status}`);
    }

    const thread = await response.json();
    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
