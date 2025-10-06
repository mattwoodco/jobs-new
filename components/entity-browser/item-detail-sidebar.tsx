"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import type { Item } from "@/lib/types/schema";

interface ItemDetailSidebarProps {
  item: Item | null;
  onClose?: () => void;
}

export function ItemDetailSidebar({ item, onClose }: ItemDetailSidebarProps) {
  if (!item) {
    return (
      <aside className="w-full md:w-80 min-w-full md:min-w-0 snap-center md:snap-align-none border-l bg-background flex-shrink-0">
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Select an item to view details
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-80 min-w-full md:min-w-0 snap-center md:snap-align-none border-l bg-background flex-shrink-0">
      <div className="flex h-full flex-col overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.type}</p>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {item.description && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="mb-2 text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </>
          )}

          {item.properties && Object.keys(item.properties).length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="mb-3 text-sm font-medium">Properties</h3>
                <dl className="space-y-3">
                  {Object.entries(item.properties).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="mt-1 text-sm">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
