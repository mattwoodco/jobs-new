"use client";

import { Button } from "@/components/ui/button";
import { Thread } from "@assistant-ui/react-ui";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk";

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

  const [isLoading, setIsLoading] = useState(true);

  // Use AI SDK's useChat hook with threadId and resourceId in the body
  const chat = useChat({
    api: "/api/chat",
    body: {
      threadId,
      resourceId: "workflowAgent",
    },
    initialMessages: [],
    onResponse: (response) => {
      console.log("📥 [CHAT UI] Response received:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        bodyUsed: response.bodyUsed,
      });
    },
    onFinish: (message) => {
      const content = message.content;
      const contentStr =
        typeof content === "string" ? content : JSON.stringify(content);
      console.log("✅ [CHAT UI] Message finished:", {
        role: message.role,
        contentType: typeof content,
        contentLength: contentStr?.length ?? 0,
        contentPreview: contentStr?.substring(0, 100) ?? "N/A",
      });
    },
    onError: (error) => {
      console.error("❌ [CHAT UI] Error:", error);
    },
  });

  // Fetch existing messages from the thread
  useEffect(() => {
    async function fetchMessages() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/conversations/${threadId}`);
        if (response.ok) {
          const data = await response.json();

          // Set initial messages from the thread
          if (data.uiMessages && data.uiMessages.length > 0) {
            chat.setMessages(data.uiMessages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, chat.setMessages]);

  // Log message updates
  useEffect(() => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    let lastMessageInfo = null;

    if (lastMsg) {
      const content = lastMsg.content;
      const contentStr =
        typeof content === "string" ? content : JSON.stringify(content);
      lastMessageInfo = {
        role: lastMsg.role,
        contentType: typeof content,
        contentLength: contentStr?.length ?? 0,
        contentPreview: contentStr?.substring(0, 50) ?? "N/A",
      };
    }

    console.log("💬 [CHAT UI] Messages updated:", {
      count: chat.messages.length,
      isLoading: chat.isLoading,
      lastMessage: lastMessageInfo,
    });
  }, [chat.messages, chat.isLoading]);

  // Use assistant-ui runtime adapter for AI SDK
  const runtime = useAISDKRuntime(chat);

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : (
          <Thread key={threadId} runtime={runtime} />
        )}
      </div>
    </div>
  );
}
