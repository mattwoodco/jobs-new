import { ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BrowserConfig, RecursiveItem } from "../recursive-browser";
import { MetadataDisplay } from "./metadata-display";

interface ItemListProps {
  items: RecursiveItem[];
  selectedItem: RecursiveItem | null;
  onSelectItem: (item: RecursiveItem) => void;
  config: BrowserConfig;
  onAddNewItem?: () => void;
}

export function ItemList({
  items,
  selectedItem,
  onSelectItem,
  config,
  onAddNewItem,
}: ItemListProps) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold">{config.labels.listTitle}</h2>
            <span className="text-xs text-muted-foreground">
              {items.length}
            </span>
          </div>
          {onAddNewItem && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAddNewItem}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0">
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`w-full text-left px-4 py-4 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                  isSelected ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <MetadataDisplay
                      metadata={item.metadata}
                      fields={config.metadataFields}
                      variant="compact"
                    />
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground md:hidden" />
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
