import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BrowserConfig, RecursiveItem, RecursiveView } from "../recursive-browser";
import { MetadataDisplay } from "./metadata-display";
import { ViewSelectionButton } from "./view-selection-button";

interface ItemDetailProps {
  item: RecursiveItem;
  selectedView: RecursiveView | null;
  onSelectView: (view: RecursiveView) => void;
  onBack: () => void;
  config: BrowserConfig;
}

export function ItemDetail({
  item,
  selectedView,
  onSelectView,
  onBack,
  config,
}: ItemDetailProps) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-2 md:hidden"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {config.labels.backToList}
        </Button>
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <MetadataDisplay
          metadata={item.metadata}
          fields={config.metadataFields}
          variant="default"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-base leading-relaxed">{item.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {config.labels.moreInfo}
            </h3>
            <div className="space-y-2">
              {item.views.map((view) => (
                <ViewSelectionButton
                  key={view.id}
                  view={view}
                  isSelected={selectedView?.id === view.id}
                  onSelect={onSelectView}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
