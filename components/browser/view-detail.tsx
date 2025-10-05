import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BrowserConfig, RecursiveView } from "../recursive-browser";
import { ViewSelectionButton } from "./view-selection-button";

interface ViewDetailProps {
  view: RecursiveView;
  selectedSubView: RecursiveView | null;
  onSelectSubView: (subView: RecursiveView) => void;
  onBack: () => void;
  config: BrowserConfig;
}

export function ViewDetail({
  view,
  selectedSubView,
  onSelectSubView,
  onBack,
  config,
}: ViewDetailProps) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {config.labels.backToDetail}
        </Button>
        <h2 className="text-xl font-bold">{view.title}</h2>
        <p className="text-sm text-muted-foreground">{view.description}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                {view.content}
              </pre>
            </div>
          </div>

          {view.subViews && view.subViews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {config.labels.moreDetails}
              </h3>
              <div className="space-y-2">
                {view.subViews.map((subView) => (
                  <ViewSelectionButton
                    key={subView.id}
                    view={subView}
                    isSelected={selectedSubView?.id === subView.id}
                    onSelect={onSelectSubView}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
