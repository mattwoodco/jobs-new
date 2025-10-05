import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RecursiveView } from "../recursive-browser";
import { MessagesChatView } from "./messages-chat-view";

interface SubViewDetailProps {
  subView: RecursiveView;
  onBack: () => void;
}

export function SubViewDetail({ subView, onBack }: SubViewDetailProps) {
  // If this is a Messages subview, render the chat interface
  if (subView.title === "Messages") {
    return (
      <MessagesChatView
        subViewId={subView.id}
        title={subView.title}
        description={subView.description}
        onBack={onBack}
      />
    );
  }

  // For all other subviews, render the default content view
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-bold">{subView.title}</h2>
        <p className="text-sm text-muted-foreground">{subView.description}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
              {subView.content}
            </pre>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
