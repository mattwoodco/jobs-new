import { ChevronRight, Plus, Trash2 } from "lucide-react";

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
  onDeleteItem?: (itemId: string) => void;
}

export function ItemList({
  items,
  selectedItem,
  onSelectItem,
  config,
  onAddNewItem,
  onDeleteItem,
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
              <div
                key={item.id}
                className={`w-full text-left px-4 py-4 border-b transition-colors group ${
                  isSelected ? "md:bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectItem(item)}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <MetadataDisplay
                      metadata={item.metadata}
                      fields={config.metadataFields}
                      variant="compact"
                    />
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    {onDeleteItem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground md:hidden" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
