"use client";

import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types/schema";

interface ItemListProps {
  items: Item[];
  selectedId?: string;
  onSelect: (item: Item) => void;
}

export function ItemList({ items, selectedId, onSelect }: ItemListProps) {
  return (
    <div className="w-full md:flex-1 min-w-full md:min-w-0 snap-center md:snap-align-none overflow-auto flex-shrink-0">
      <div className="p-6 h-full">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:bg-accent w-full",
                selectedId === item.id && "bg-accent ring-2 ring-ring",
              )}
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
