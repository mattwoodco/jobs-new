import { NextResponse } from "next/server";

const MASTRA_API_URL = "http://localhost:3020";
const AGENT_ID = "workflowAgent";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

    // Get thread details from Mastra API
    const threadUrl = `${MASTRA_API_URL}/api/memory/threads/${threadId}?agentId=${AGENT_ID}`;
    const threadResponse = await fetch(threadUrl);

    if (!threadResponse.ok) {
      if (threadResponse.status === 404) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 },
        );
      }
      throw new Error(`Mastra API returned ${threadResponse.status}`);
    }

    const thread = await threadResponse.json();

    // Get messages for the thread from Mastra API
    const messagesUrl = `${MASTRA_API_URL}/api/memory/threads/${threadId}/messages?agentId=${AGENT_ID}`;
    const messagesResponse = await fetch(messagesUrl);

    if (!messagesResponse.ok) {
      throw new Error(`Mastra API returned ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();

    return NextResponse.json({
      thread,
      messages: messagesData.messages || [],
      uiMessages: messagesData.uiMessages || [],
    });
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation details" },
      { status: 500 },
    );
  }
}
