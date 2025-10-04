import { create } from "zustand";

export type ViewMode = "jobs" | "threads";

interface ViewStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

export const useViewStore = create<ViewStore>()((set) => ({
  viewMode: "jobs",
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === "jobs" ? "threads" : "jobs" })),
}));
