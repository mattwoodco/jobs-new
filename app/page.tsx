"use client";

import type { RecursiveItem } from "@/components/recursive-browser";
import { RecursiveBrowser } from "@/components/recursive-browser";
import { jobBrowserConfig, threadBrowserConfig } from "@/lib/config";
import { mockJobs } from "@/lib/mock-data";
import { mockThreads } from "@/lib/mock-thread";
import { useViewStore } from "@/lib/store";

export default function Home() {
  const { viewMode } = useViewStore();

  // Transform job data to RecursiveItem type
  const jobItems: RecursiveItem[] = mockJobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    metadata: {
      company: job.company,
      location: job.location,
      salary: job.salary,
    },
    views: job.views,
  }));

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
