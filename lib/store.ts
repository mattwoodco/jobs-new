import { create } from "zustand";

export type JobView = {
  id: string;
  title: string;
  description: string;
  content: string;
  subViews?: JobView[];
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  views: JobView[];
};

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

interface ConversationStore {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
}

export const useConversationStore = create<ConversationStore>()((set) => ({
  selectedConversationId: null,
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
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
  selectedJobId: string | null;
  isCreatingNewJobSearch: boolean;
  isCreatingNewJob: boolean;
  initialized: boolean;
  refreshJobSearches: () => void;
  initialize: () => void;
  setJobSearches: (jobSearches: JobSearch[]) => void;
  addJobSearch: (jobSearch: JobSearch) => void;
  addJobToSearch: (jobSearchId: string, job: Job) => void;
  setSelectedJobSearchId: (id: string | null) => void;
  setSelectedJobId: (id: string | null) => void;
  setIsCreatingNewJobSearch: (isCreating: boolean) => void;
  setIsCreatingNewJob: (isCreating: boolean) => void;
}

export const useJobSearchStore = create<JobSearchStore>()((set, _get) => ({
  jobSearches: [],
  selectedJobSearchId: null,
  selectedJobId: null,
  isCreatingNewJobSearch: false,
  isCreatingNewJob: false,
  initialized: false,
  refreshJobSearches: () => {
    // This is a signal to trigger a re-fetch
    // The actual fetch happens in the component
    set({ initialized: false });
  },
  initialize: () => {
    // No longer using mock data - all data comes from the database
    set({ initialized: true });
  },
  setJobSearches: (jobSearches) =>
    set({
      jobSearches,
      initialized: true,
    }),
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
          : search,
      ),
      isCreatingNewJob: false,
    })),
  setSelectedJobSearchId: (id) => set({ selectedJobSearchId: id }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setIsCreatingNewJobSearch: (isCreating) =>
    set({ isCreatingNewJobSearch: isCreating }),
  setIsCreatingNewJob: (isCreating) => set({ isCreatingNewJob: isCreating }),
}));
