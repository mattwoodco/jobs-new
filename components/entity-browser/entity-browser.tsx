"use client";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slugify";
import type { Collection, Entity, Item, Schema } from "@/lib/types/schema";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CollectionSidebar } from "./collection-sidebar";
import { EmptyState } from "./empty-state";
import { EntityDropdown } from "./entity-dropdown";
import { ItemDetailSidebar } from "./item-detail-sidebar";
import { ItemList } from "./item-list";

interface EntityBrowserProps {
  data: Schema;
  entityType: string;
  initialEntity?: Entity;
  initialCollection?: Collection;
  initialItem?: Item;
}

export function EntityBrowser({
  data,
  entityType,
  initialEntity,
  initialCollection,
  initialItem,
}: EntityBrowserProps) {
  const router = useRouter();
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(
    initialEntity ?? null,
  );
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(initialCollection ?? null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    initialItem ?? null,
  );

  // Set initial scroll position based on URL state (runs once on mount)
  useEffect(() => {
    const mainContent = document.querySelector(".flex-1.flex.overflow-hidden");
    if (!mainContent) return;

    // Only set initial scroll on mobile (viewport width < 768px)
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Determine which pane to scroll to based on initial state
    let scrollIndex = 0;
    if (initialItem) {
      scrollIndex = 2; // Properties pane
    } else if (initialCollection) {
      scrollIndex = 1; // Items pane
    } else if (initialEntity) {
      scrollIndex = 0; // Collections pane
    }

    // Set initial scroll position without animation
    const scrollTo = scrollIndex * mainContent.clientWidth;
    mainContent.scrollLeft = scrollTo;
  }, [initialEntity, initialCollection, initialItem]); // Empty dependency array - only run on mount

  // Handle ESC key to deselect in reverse order
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (selectedItem) {
          setSelectedItem(null);
        } else if (selectedCollection) {
          setSelectedCollection(null);
        } else if (selectedEntity) {
          setSelectedEntity(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEntity, selectedCollection, selectedItem]);

  const handleEntitySelect = useCallback(
    (entity: Entity | null) => {
      setSelectedEntity(entity);
      setSelectedCollection(null);
      setSelectedItem(null);

      if (entity) {
        router.push(`/${entityType}/${slugify(entity.name)}`);
      } else {
        router.push(`/${entityType}`);
      }
    },
    [entityType, router],
  );

  const handleCollectionSelect = useCallback(
    (collection: Collection) => {
      setSelectedCollection(collection);
      setSelectedItem(null);

      if (selectedEntity) {
        router.push(
          `/${entityType}/${slugify(selectedEntity.name)}/${slugify(collection.name)}`,
        );
      }
    },
    [entityType, selectedEntity, router],
  );

  const handleItemSelect = useCallback(
    (item: Item) => {
      // Toggle: if clicking the same item, deselect it
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
        if (selectedEntity && selectedCollection) {
          router.push(
            `/${entityType}/${slugify(selectedEntity.name)}/${slugify(selectedCollection.name)}`,
          );
        }
        return;
      }

      setSelectedItem(item);

      if (selectedEntity && selectedCollection) {
        router.push(
          `/${entityType}/${slugify(selectedEntity.name)}/${slugify(selectedCollection.name)}/${slugify(item.name)}`,
        );
      }
    },
    [entityType, selectedEntity, selectedCollection, selectedItem, router],
  );

  const handleItemClose = useCallback(() => {
    setSelectedItem(null);
    if (selectedEntity && selectedCollection) {
      router.push(
        `/${entityType}/${slugify(selectedEntity.name)}/${slugify(selectedCollection.name)}`,
      );
    }
  }, [entityType, selectedEntity, selectedCollection, router]);

  return (
    <div className="flex flex-col h-[100dvh] md:flex-col">
      {/* Header Row - moved to bottom on mobile with order-2 */}
      <div className="border-b flex order-2 md:order-1 md:border-b border-t md:border-t-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Menu className="h-5 w-5" />
          </Link>
        </Button>
        <EntityDropdown
          entities={data.entities}
          selectedEntity={selectedEntity}
          entityType={entityType}
          onSelect={handleEntitySelect}
        />
      </div>

      {/* Main Content Area - horizontal snap-scroll on mobile */}
      <div className="flex-1 flex overflow-hidden order-1 md:order-2 md:flex-row flex-row overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory md:snap-none">
        {!selectedEntity ? (
          <EmptyState />
        ) : (
          <>
            {/* Collections Sidebar */}
            <CollectionSidebar
              collections={selectedEntity.collections}
              selectedId={selectedCollection?.id}
              onSelect={handleCollectionSelect}
            />

            {/* Items List */}
            {selectedCollection && (
              <ItemList
                items={selectedCollection.items}
                selectedId={selectedItem?.id}
                onSelect={handleItemSelect}
              />
            )}

            {/* Item Detail Sidebar */}
            {selectedItem && (
              <ItemDetailSidebar
                item={selectedItem}
                onClose={handleItemClose}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
