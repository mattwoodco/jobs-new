"use client";

import { Briefcase } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type {
  BrowserConfig,
  RecursiveItem,
  RecursiveView,
} from "../recursive-browser";
import { ItemDetail } from "./item-detail";
import { ItemList } from "./item-list";
import { SubViewDetail } from "./subview-detail";
import { ViewDetail } from "./view-detail";

interface BrowseModeViewProps {
  items: RecursiveItem[];
  config: BrowserConfig;
  selectedItem: RecursiveItem | null;
  setSelectedItem: (item: RecursiveItem | null) => void;
  selectedView: RecursiveView | null;
  setSelectedView: (view: RecursiveView | null) => void;
  selectedSubView: RecursiveView | null;
  setSelectedSubView: (subView: RecursiveView | null) => void;
  leftPanelSize: number;
  rightPanelSize: number;
  setLeftPanelSize: (size: number) => void;
  setRightPanelSize: (size: number) => void;
  isHydrated: boolean;
  onAddNewItem?: () => void;
  resetScrollTrigger?: number;
}

export function BrowseModeView({
  items,
  config,
  selectedItem,
  setSelectedItem,
  selectedView,
  setSelectedView,
  selectedSubView,
  setSelectedSubView,
  leftPanelSize,
  rightPanelSize,
  setLeftPanelSize,
  setRightPanelSize,
  isHydrated,
  onAddNewItem,
  resetScrollTrigger,
}: BrowseModeViewProps) {
  const itemListRef = useRef<HTMLDivElement>(null);
  const itemDetailRef = useRef<HTMLDivElement>(null);
  const viewDetailRef = useRef<HTMLDivElement>(null);
  const subViewDetailRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isNavigatingBack = useRef(false);

  // Reset isInitialMount when resetScrollTrigger changes (view mode or job search changes)
  useEffect(() => {
    if (resetScrollTrigger && resetScrollTrigger > 0) {
      isInitialMount.current = true;
    }
  }, [resetScrollTrigger]);

  // Auto-scroll on mobile when item is selected (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't auto-scroll if we're navigating back to the list
    if (isNavigatingBack.current) {
      return;
    }

    if (selectedItem) {
      itemDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedItem]);

  // Auto-scroll on mobile when view is selected
  useEffect(() => {
    if (selectedView) {
      viewDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedView]);

  // Auto-scroll on mobile when sub-view is selected
  useEffect(() => {
    if (selectedSubView) {
      subViewDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedSubView]);

  // Scroll back to item list when job search changes (mobile only)
  useEffect(() => {
    if (resetScrollTrigger && resetScrollTrigger > 0) {
      itemListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [resetScrollTrigger]);

  const handleBackToViewDetail = () => {
    viewDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => setSelectedSubView(null), 300);
  };

  const handleBackToItemDetail = () => {
    // Clear all selections to go back to list
    setSelectedItem(null);
    setSelectedView(null);
    setSelectedSubView(null);

    // Scroll back to item list
    setTimeout(() => {
      itemListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }, 10);
  };

  const handleBackToItemList = () => {
    // Set flag to prevent auto-scroll
    isNavigatingBack.current = true;

    // Find the scroll container
    const scrollContainer = itemListRef.current?.closest(".overflow-x-auto");

    if (scrollContainer) {
      // Temporarily disable scroll snap by removing Tailwind classes
      scrollContainer.classList.remove("snap-x", "snap-mandatory");

      // Scroll to the start
      scrollContainer.scrollTo({
        left: 0,
        behavior: "smooth",
      });

      // Re-enable scroll snap after scroll completes and reset flag
      setTimeout(() => {
        scrollContainer.classList.add("snap-x", "snap-mandatory");
        isNavigatingBack.current = false;
      }, 600);
    }

    // Clear selection after starting scroll
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedView(null);
      setSelectedSubView(null);
    }, 100);
  };

  return (
    <>
      {/* First snap point: Desktop resizable panels / Mobile item list */}
      <div
        ref={itemListRef}
        className="w-full h-full shrink-0 snap-start md:contents"
      >
        {isHydrated && (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
            onLayout={(sizes) => {
              if (sizes[0]) setLeftPanelSize(sizes[0]);
            }}
          >
            {/* Item List Panel */}
            <ResizablePanel
              defaultSize={leftPanelSize}
              minSize={20}
              maxSize={40}
              className="overflow-y-auto"
            >
              <ItemList
                items={items}
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                config={config}
                onAddNewItem={onAddNewItem}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden md:flex" />

            {/* Item Detail Panel (Desktop only) */}
            <ResizablePanel
              defaultSize={
                selectedView
                  ? 100 - leftPanelSize - rightPanelSize
                  : 100 - leftPanelSize
              }
              className="overflow-y-auto hidden md:block"
            >
              {selectedItem ? (
                <ItemDetail
                  item={selectedItem}
                  selectedView={selectedView}
                  onSelectView={setSelectedView}
                  onBack={handleBackToItemList}
                  config={config}
                />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Briefcase />
                    </EmptyMedia>
                    <EmptyTitle>{config.labels.noItemSelected}</EmptyTitle>
                    <EmptyDescription>
                      {config.labels.selectPrompt}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </ResizablePanel>

            {/* View Detail Panel (Desktop only, conditional) */}
            {selectedView && (
              <>
                <ResizableHandle withHandle className="hidden md:flex" />
                <ResizablePanel
                  defaultSize={rightPanelSize}
                  minSize={20}
                  maxSize={40}
                  className="overflow-y-auto hidden md:block"
                  onResize={(size) => setRightPanelSize(size)}
                >
                  <ViewDetail
                    view={selectedView}
                    selectedSubView={selectedSubView}
                    onSelectSubView={setSelectedSubView}
                    onBack={handleBackToItemDetail}
                    config={config}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>

      {/* Second snap point: Item Detail (Mobile only) */}
      <div
        ref={itemDetailRef}
        className="w-full h-full shrink-0 snap-start md:hidden"
      >
        {selectedItem ? (
          <ItemDetail
            item={selectedItem}
            selectedView={selectedView}
            onSelectView={setSelectedView}
            onBack={handleBackToItemList}
            config={config}
          />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Briefcase />
              </EmptyMedia>
              <EmptyTitle>{config.labels.noItemSelected}</EmptyTitle>
              <EmptyDescription>{config.labels.selectPrompt}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      {/* Third snap point: View Detail (Mobile only) */}
      {selectedView && (
        <div
          ref={viewDetailRef}
          className="w-full h-full shrink-0 snap-start md:hidden"
        >
          <ViewDetail
            view={selectedView}
            selectedSubView={selectedSubView}
            onSelectSubView={setSelectedSubView}
            onBack={handleBackToItemDetail}
            config={config}
          />
        </div>
      )}

      {/* Fourth snap point: Sub-View Detail (Mobile only) */}
      {selectedSubView && (
        <div
          ref={subViewDetailRef}
          className="w-full h-full shrink-0 snap-start md:hidden"
        >
          <SubViewDetail
            subView={selectedSubView}
            onBack={handleBackToViewDetail}
          />
        </div>
      )}
    </>
  );
}
