"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Collection } from "@/lib/types/schema";

interface CollectionSidebarProps {
  collections: Collection[];
  selectedId?: string;
  onSelect: (collection: Collection) => void;
}

export function CollectionSidebar({
  collections,
  selectedId,
  onSelect,
}: CollectionSidebarProps) {
  return (
    <aside className="w-full md:w-64 min-w-full md:min-w-0 snap-center md:snap-align-none border-r bg-background flex-shrink-0">
      <div className="flex flex-col h-full overflow-auto">
        {collections.map((collection) => (
          <Button
            key={collection.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              selectedId === collection.id &&
                "bg-accent text-accent-foreground",
            )}
            onClick={() => onSelect(collection)}
          >
            {collection.name}
          </Button>
        ))}
      </div>
    </aside>
  );
}
