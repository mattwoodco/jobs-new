// Types for conversations loaded from Mastra memory

export type ConversationThread = {
  id: string;
  resourceId: string;
  title: string;
  metadata?: {
    company?: string;
    jobTitle?: string;
    status?: string;
    messageCount?: string;
    lastActivity?: string;
    attachments?: string; // JSON stringified array of attachment objects
    [key: string]: string | undefined;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ConversationMessage = {
  id: string;
  threadId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date | string;
  metadata?: Record<string, unknown>;
};

export type ConversationAttachment = {
  name: string;
  type: string;
  size: string;
  url?: string;
};

export type ConversationDetail = {
  thread: ConversationThread;
  messages: ConversationMessage[];
  uiMessages?: unknown[];
};

export type ConversationsResponse = {
  conversations: ConversationThread[];
};
