"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useJobSearchStore } from "@/lib/store";
import { BrowseModeView } from "./browser/browse-mode-view";
import { CreateModeView } from "./browser/create-mode-view";
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

  // Check if we're in create mode
  const isCreatingNewJobSearch = useJobSearchStore(
    (state) => state.isCreatingNewJobSearch,
  );

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col overscroll-none">
      <div className="w-full order-2 shrink-0 md:order-0">
        <Header />
      </div>
      <div className="flex-1 overflow-x-auto snap-x snap-mandatory md:overflow-y-auto overscroll-none">
        <div className="h-full flex md:contents">
          {isCreatingNewJobSearch ? (
            <div className="w-full h-full shrink-0 snap-start md:contents">
              <CreateModeView
                leftPanelSize={leftPanelSize}
                setLeftPanelSize={setLeftPanelSize}
                isHydrated={isHydrated}
              />
            </div>
          ) : (
            <BrowseModeView
              items={items}
              config={config}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              selectedSubView={selectedSubView}
              setSelectedSubView={setSelectedSubView}
              leftPanelSize={leftPanelSize}
              rightPanelSize={rightPanelSize}
              setLeftPanelSize={setLeftPanelSize}
              setRightPanelSize={setRightPanelSize}
              isHydrated={isHydrated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

