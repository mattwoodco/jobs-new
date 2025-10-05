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
import type { BrowserConfig, RecursiveItem, RecursiveView } from "../recursive-browser";
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
}: BrowseModeViewProps) {
  const itemListRef = useRef<HTMLDivElement>(null);
  const itemDetailRef = useRef<HTMLDivElement>(null);
  const viewDetailRef = useRef<HTMLDivElement>(null);
  const subViewDetailRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Auto-scroll on mobile when item is selected (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
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

  const handleBackToViewDetail = () => {
    viewDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => setSelectedSubView(null), 300);
  };

  const handleBackToItemDetail = () => {
    itemDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => {
      setSelectedView(null);
      setSelectedSubView(null);
    }, 300);
  };

  const handleBackToItemList = () => {
    itemListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedView(null);
      setSelectedSubView(null);
    }, 300);
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
              <EmptyDescription>
                {config.labels.selectPrompt}
              </EmptyDescription>
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
