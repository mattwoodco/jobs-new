import type {
  RecursiveItem,
  RecursiveView,
} from "@/components/recursive-browser";
import type {
  ConversationThread,
  ConversationMessage,
  ConversationAttachment,
} from "./types/conversation";

export function transformConversationToRecursiveItem(
  thread: ConversationThread,
  messages?: ConversationMessage[],
): RecursiveItem {
  const metadata = thread.metadata || {};
  const company = metadata.company || "Unknown Company";
  const status = metadata.status || "Active";
  const messageCount =
    metadata.messageCount || messages?.length.toString() || "0";

  // Parse attachments if they exist
  let attachments: ConversationAttachment[] = [];
  if (metadata.attachments) {
    try {
      attachments = JSON.parse(metadata.attachments);
    } catch (e) {
      console.error("Error parsing attachments:", e);
    }
  }

  // Build views
  const views: RecursiveView[] = [];

  // Messages view
  if (messages && messages.length > 0) {
    const messageContent = messages
      .map((msg) => {
        const sender = msg.role === "user" ? "You" : company;
        const time = new Date(msg.createdAt).toLocaleString();
        return `[${time}] ${sender}: ${msg.content}`;
      })
      .join("\n\n");

    views.push({
      id: `${thread.id}-messages`,
      title: "Messages",
      description: "View conversation history",
      content: messageContent || "No messages yet",
    });
  }

  // Thread info view
  const threadInfo = [
    `Started: ${thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : "Unknown"}`,
    `Status: ${status}`,
    `Message count: ${messageCount}`,
    metadata.lastActivity
      ? `Last activity: ${new Date(metadata.lastActivity).toLocaleString()}`
      : null,
    metadata.jobTitle ? `Related job: ${metadata.jobTitle}` : null,
  ]
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join("\n");

  views.push({
    id: `${thread.id}-info`,
    title: "Thread Info",
    description: "Details about this conversation",
    content: threadInfo,
  });

  // Attachments view (if any)
  if (attachments.length > 0) {
    const attachmentContent = attachments
      .map((att) => `• ${att.name} (${att.type}, ${att.size})`)
      .join("\n");

    views.push({
      id: `${thread.id}-attachments`,
      title: "Attachments",
      description: "Files and documents shared",
      content: attachmentContent,
    });
  }

  // Additional metadata view
  const additionalMetadata = Object.entries(metadata)
    .filter(
      ([key]) =>
        ![
          "company",
          "jobTitle",
          "status",
          "messageCount",
          "lastActivity",
          "attachments",
        ].includes(key),
    )
    .map(([key, value]) => `• ${key}: ${value}`)
    .join("\n");

  if (additionalMetadata) {
    views.push({
      id: `${thread.id}-metadata`,
      title: "Additional Info",
      description: "Other conversation details",
      content: additionalMetadata,
    });
  }

  return {
    id: thread.id,
    title: thread.title,
    description: `${company} - ${status}`,
    metadata: {
      company,
      messageCount: `${messageCount} messages`,
      status,
    },
    views,
  };
}
