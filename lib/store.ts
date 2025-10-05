import { create } from "zustand";
import { Job, mockJobSearches } from "./mock-data";

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
    set((state) => ({
      viewMode: state.viewMode === "jobs" ? "threads" : "jobs",
    })),
}));

export type JobSearch = {
  id: string;
  title: string;
  description: string;
  jobs: Job[];
};

interface JobSearchStore {
  jobSearches: JobSearch[];
  selectedJobSearchId: string | null;
  isCreatingNewJobSearch: boolean;
  initialized: boolean;
  initialize: () => void;
  addJobSearch: (jobSearch: JobSearch) => void;
  addJobToSearch: (jobSearchId: string, job: Job) => void;
  setSelectedJobSearchId: (id: string | null) => void;
  setIsCreatingNewJobSearch: (isCreating: boolean) => void;
}

export const useJobSearchStore = create<JobSearchStore>()((set, get) => ({
  jobSearches: [],
  selectedJobSearchId: null,
  isCreatingNewJobSearch: false,
  initialized: false,
  initialize: () => {
    const state = get();
    if (!state.initialized) {
      set({
        jobSearches: mockJobSearches,
        selectedJobSearchId: mockJobSearches[0]?.id || null,
        initialized: true,
      });
    }
  },
  addJobSearch: (jobSearch) =>
    set((state) => ({
      jobSearches: [...state.jobSearches, jobSearch],
      selectedJobSearchId: jobSearch.id,
      isCreatingNewJobSearch: false,
    })),
  addJobToSearch: (jobSearchId, job) =>
    set((state) => ({
      jobSearches: state.jobSearches.map((search) =>
        search.id === jobSearchId
          ? { ...search, jobs: [...search.jobs, job] }
          : search
      ),
    })),
  setSelectedJobSearchId: (id) => set({ selectedJobSearchId: id }),
  setIsCreatingNewJobSearch: (isCreating) =>
    set({ isCreatingNewJobSearch: isCreating }),
}));
