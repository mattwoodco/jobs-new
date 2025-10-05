import { mastra } from "@/lib/mastra";
import { streamText, convertToCoreMessages } from "ai";
import type { UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("🚀 [CHAT API] Request received");
    const body = await req.json();

    // AI SDK v5 sends messages in the body
    const messages: UIMessage[] = body.messages || [];
    const threadId = body.threadId;
    const resourceId = body.resourceId;

    const lastMessage = messages[messages.length - 1];
    const lastContent = lastMessage?.content;
    const contentPreview =
      typeof lastContent === "string"
        ? lastContent.substring(0, 50)
        : Array.isArray(lastContent)
          ? JSON.stringify(lastContent).substring(0, 50)
          : String(lastContent);

    console.log("📨 [CHAT API] Parsed request:", {
      messageCount: messages.length,
      threadId,
      resourceId,
      lastMessagePreview: contentPreview,
      lastMessageType: typeof lastContent,
    });

    // Get the workflowAgent to access its model and config
    const agent = mastra.getAgent("workflowAgent");
    console.log("🤖 [CHAT API] Agent retrieved:", agent ? "✓" : "✗");

    // Determine resource ID - use provided resourceId or default to "workflowAgent"
    const _effectiveResourceId = resourceId || "workflowAgent";

    console.log(
      "⏳ [CHAT API] Using AI SDK streamText for proper streaming...",
    );
    const streamStartTime = Date.now();

    // Convert UIMessages to CoreMessages for AI SDK v5
    const coreMessages = convertToCoreMessages(messages);
    console.log(
      "🔄 [CHAT API] Converted messages:",
      JSON.stringify(coreMessages, null, 2),
    );

    // Use AI SDK's streamText directly for proper AI SDK v5 compatibility
    const result = streamText({
      model: agent.model,
      system:
        typeof agent.getInstructions === "function"
          ? agent.getInstructions()
          : agent.instructions,
      messages: coreMessages,
    });

    console.log(
      "✅ [CHAT API] streamText created in",
      Date.now() - streamStartTime,
      "ms",
    );

    // Return AI SDK v5 compatible streaming response
    const response = result.toTextStreamResponse();

    console.log("📤 [CHAT API] Response created:", {
      type: typeof response,
      isResponse: response instanceof Response,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (error) {
    console.error("Error in chat API route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
