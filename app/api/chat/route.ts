import { mastra } from "@/lib/mastra";
import type { UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // AI SDK v5 sends messages in the body
    const messages: UIMessage[] = body.messages || [];
    const threadId = body.threadId;
    const resourceId = body.resourceId;

    // Get the workflowAgent from the Mastra instance
    const agent = mastra.getAgent("workflowAgent");

    // Determine resource ID - use provided resourceId or default to "workflowAgent"
    const effectiveResourceId = resourceId || "workflowAgent";

    // Stream the agent response with thread management
    // Use 'aisdk' format for AI SDK v5 compatibility
    const result = await agent.stream(messages, {
      format: "aisdk",
      memory: threadId
        ? {
            thread: threadId,
            resource: effectiveResourceId,
          }
        : undefined,
    });

    // Return streaming response compatible with AI SDK v5
    return result.toUIMessageStreamResponse();
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
