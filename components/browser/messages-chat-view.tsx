"use client";

import { Button } from "@/components/ui/button";
import { useExternalStoreRuntime } from "@assistant-ui/react";
import { Thread } from "@assistant-ui/react-ui";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";

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

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing messages from the thread
  useEffect(() => {
    async function fetchMessages() {
      try {
        setIsLoading(true);
        console.log(
          "🔍 [MESSAGES VIEW] Fetching messages for thread:",
          threadId,
        );
        const response = await fetch(`/api/conversations/${threadId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("🔍 [MESSAGES VIEW] Received data:", {
            hasThread: !!data.thread,
            messageCount: data.messages?.length || 0,
            uiMessageCount: data.uiMessages?.length || 0,
          });

          // Filter messages to only include text parts
          const filteredMessages = (data.uiMessages || []).map(
            (msg: UIMessage) => ({
              ...msg,
              parts: msg.parts?.filter((part) => part.type === "text") || [],
            }),
          );

          setMessages(filteredMessages);
        } else {
          console.error("🔍 [MESSAGES VIEW] Response not ok:", response.status);
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [threadId]);

  // Create runtime using ExternalStoreRuntime for full control over messages
  const runtime = useExternalStoreRuntime({
    messages,
    convertMessage: (message) => {
      const textParts = (message.parts || []).filter(
        (part) => part.type === "text",
      );
      const content = textParts.map((part) => part.text).join("");
      return {
        id: message.id,
        role: message.role,
        content: [{ type: "text", text: content }],
      };
    },
    onNew: async (message) => {
      console.log("🔍 [MESSAGES VIEW] Sending new message:", message);

      // Extract text content from message parts
      const textContent = message.content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");

      // Add user message optimistically
      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: textContent }],
      };
      setMessages((prev) => [...prev, userMessage]);

      // Call API
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            threadId,
            resourceId: "workflowAgent",
          }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        // Stream the response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantText = "";
        let assistantMessage: UIMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [{ type: "text", text: "" }],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const content = line.substring(2).trim().replace(/^"|"$/g, "");
              assistantText += content;
              assistantMessage = {
                ...assistantMessage,
                parts: [{ type: "text", text: assistantText }],
              };
              setMessages((prev) => [...prev.slice(0, -1), assistantMessage]);
            }
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
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
