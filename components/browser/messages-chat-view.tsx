"use client";

import { Button } from "@/components/ui/button";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@assistant-ui/react-ui";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { DefaultChatTransport } from "ai";

interface MessagesChatViewProps {
  subViewId: string;
  title: string;
  description?: string;
  onBack: () => void;
}

export function MessagesChatView({
  subViewId,
  title,
  description,
  onBack,
}: MessagesChatViewProps) {
  // Extract threadId from subViewId (format: {threadId}-messages)
  const threadId = useMemo(() => {
    return subViewId.replace(/-messages$/, "");
  }, [subViewId]);

  console.log("🔍 [FRONTEND] MessagesChatView initialized:", {
    subViewId,
    threadId,
    title,
  });

  // Create runtime with Mastra API endpoint
  const runtime = useChatRuntime({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        threadId,
        resourceId: "workflowAgent", // Match the resourceId used to fetch conversations
      },
    }),
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <Thread runtime={runtime} />
      </div>
    </div>
  );
}
