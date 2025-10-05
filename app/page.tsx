"use client";

import type { RecursiveItem } from "@/components/recursive-browser";
import { RecursiveBrowser } from "@/components/recursive-browser";
import { jobBrowserConfig, threadBrowserConfig } from "@/lib/config";
import { mockThreads } from "@/lib/mock-thread";
import { useViewStore, useJobSearchStore } from "@/lib/store";

export default function Home() {
  const { viewMode } = useViewStore();
  const { jobSearches, selectedJobSearchId } = useJobSearchStore();

  // Get the selected job search
  const selectedJobSearch = jobSearches.find(
    (search) => search.id === selectedJobSearchId
  );

  // Transform job data to RecursiveItem type
  const jobItems: RecursiveItem[] =
    selectedJobSearch?.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      metadata: {
        company: job.company,
        location: job.location,
        salary: job.salary,
      },
      views: job.views,
    })) || [];

  // Transform thread data to RecursiveItem type
  const threadItems: RecursiveItem[] = mockThreads.map((thread) => ({
    id: thread.id,
    title: thread.title,
    description: thread.description,
    metadata: {
      company: thread.company,
      location: thread.location,
      salary: thread.salary,
    },
    views: thread.views,
  }));

  return (
    <RecursiveBrowser
      items={viewMode === "jobs" ? jobItems : threadItems}
      config={viewMode === "jobs" ? jobBrowserConfig : threadBrowserConfig}
    />
  );
}
