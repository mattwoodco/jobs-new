"use client";

import { ArrowLeft, Briefcase, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "./header";

// Generic types for recursive data structure
export type RecursiveView = {
  id: string;
  title: string;
  description: string;
  content: string;
  subViews?: RecursiveView[];
};

export type RecursiveItem = {
  id: string;
  title: string;
  description: string;
  metadata: Record<string, string>;
  views: RecursiveView[];
};

// Configuration for the browser
export type BrowserConfig = {
  labels: {
    listTitle: string;
    listCount: string;
    backToList: string;
    backToDetail: string;
    noItemSelected: string;
    selectPrompt: string;
    moreInfo: string;
    moreDetails: string;
  };
  metadataFields: Array<{
    key: string;
    label?: string;
    separator?: string;
  }>;
  storageKey: string;
};

// Helper component for rendering metadata
function MetadataDisplay({
  metadata,
  fields,
  variant = "default",
}: {
  metadata: Record<string, string>;
  fields: BrowserConfig["metadataFields"];
  variant?: "default" | "compact";
}) {
  if (fields.length === 0) return null;

  return (
    <>
      <p
        className={
          variant === "compact"
            ? "text-sm text-muted-foreground truncate"
            : "text-muted-foreground"
        }
      >
        {metadata[fields[0].key]}
      </p>
      {fields.length > 1 && (
        <div
          className={
            variant === "compact"
              ? "flex gap-2 mt-1 text-xs text-muted-foreground"
              : "flex gap-3 mt-2 text-sm text-muted-foreground"
          }
        >
          {fields.slice(1).map((field, idx) => (
            <span key={field.key}>
              {idx > 0 && field.separator && `${field.separator} `}
              {metadata[field.key]}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

// Helper component for rendering view selection button
function ViewSelectionButton({
  view,
  isSelected,
  onSelect,
}: {
  view: RecursiveView;
  isSelected: boolean;
  onSelect: (view: RecursiveView) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(view)}
      className={`w-full text-left p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? "bg-accent border-primary" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{view.title}</h4>
          <p className="text-sm text-muted-foreground">{view.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </button>
  );
}

// Store for panel sizes
interface PanelStore {
  leftPanelSize: number;
  rightPanelSize: number;
  setLeftPanelSize: (size: number) => void;
  setRightPanelSize: (size: number) => void;
}

const createPanelStore = (storageKey: string) =>
  create<PanelStore>()(
    persist(
      (set) => ({
        leftPanelSize: 30,
        rightPanelSize: 25,
        setLeftPanelSize: (size) => set({ leftPanelSize: size }),
        setRightPanelSize: (size) => set({ rightPanelSize: size }),
      }),
      {
        name: storageKey,
      },
    ),
  );

interface RecursiveBrowserProps {
  items: RecursiveItem[];
  config: BrowserConfig;
}

export function RecursiveBrowser({ items, config }: RecursiveBrowserProps) {
  const [selectedItem, setSelectedItem] = useState<RecursiveItem | null>(null);
  const [selectedView, setSelectedView] = useState<RecursiveView | null>(null);
  const [selectedSubView, setSelectedSubView] = useState<RecursiveView | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [panelStore] = useState(() => createPanelStore(config.storageKey));

  const { leftPanelSize, rightPanelSize, setLeftPanelSize, setRightPanelSize } =
    panelStore();

  const itemListRef = useRef<HTMLDivElement>(null);
  const itemDetailRef = useRef<HTMLDivElement>(null);
  const viewDetailRef = useRef<HTMLDivElement>(null);
  const subViewDetailRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
    <div className="h-[100dvh] flex flex-col overscroll-none">
      <div className="w-full order-2 shrink-0 md:order-0">
        <Header />
      </div>
      <div className="flex-1 overflow-x-auto snap-x snap-mandatory md:overflow-y-auto overscroll-none">
        <div className="h-full flex md:contents">
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
        </div>
      </div>
    </div>
  );
}

// Item List Component
function ItemList({
  items,
  selectedItem,
  onSelectItem,
  config,
}: {
  items: RecursiveItem[];
  selectedItem: RecursiveItem | null;
  onSelectItem: (item: RecursiveItem) => void;
  config: BrowserConfig;
}) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <h2 className="text-lg font-semibold">{config.labels.listTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} {config.labels.listCount}
        </p>
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

// Item Detail Component
function ItemDetail({
  item,
  selectedView,
  onSelectView,
  onBack,
  config,
}: {
  item: RecursiveItem;
  selectedView: RecursiveView | null;
  onSelectView: (view: RecursiveView) => void;
  onBack: () => void;
  config: BrowserConfig;
}) {
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

// View Detail Component
function ViewDetail({
  view,
  selectedSubView,
  onSelectSubView,
  onBack,
  config,
}: {
  view: RecursiveView;
  selectedSubView: RecursiveView | null;
  onSelectSubView: (subView: RecursiveView) => void;
  onBack: () => void;
  config: BrowserConfig;
}) {
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

// Sub-View Detail Component (simplified, delegates to ViewDetail)
function SubViewDetail({
  subView,
  onBack,
}: {
  subView: RecursiveView;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-bold">{subView.title}</h2>
        <p className="text-sm text-muted-foreground">{subView.description}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
              {subView.content}
            </pre>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
