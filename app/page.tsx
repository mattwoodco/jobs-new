"use client";

import type { RecursiveItem } from "@/components/recursive-browser";
import { RecursiveBrowser } from "@/components/recursive-browser";
import { jobBrowserConfig, threadBrowserConfig } from "@/lib/config";
import { transformConversationToRecursiveItem } from "@/lib/conversation-utils";
import type { JobSearchWithJobs, JobViewWithSubViews } from "@/lib/db/schema";
import {
  useConversationStore,
  useJobSearchStore,
  useViewStore,
} from "@/lib/store";
import type { ConversationThread } from "@/lib/types/conversation";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { viewMode } = useViewStore();
  const {
    jobSearches,
    selectedJobSearchId,
    selectedJobId,
    setJobSearches,
    setSelectedJobSearchId,
    setSelectedJobId,
    initialized,
    initialize,
  } = useJobSearchStore();
  const { selectedConversationId, setSelectedConversationId } =
    useConversationStore();
  const [conversations, setConversations] = useState<RecursiveItem[]>([]);
  const [_isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [_isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Helper function to transform database views to recursive structure
  const transformViewsToRecursive = useCallback(
    (views: JobViewWithSubViews[]): RecursiveItem["views"] => {
      return views.map((view) => ({
        id: view.id,
        title: view.title,
        description: view.description,
        content: view.content,
        subViews: view.subViews
          ? transformViewsToRecursive(view.subViews)
          : undefined,
      }));
    },
    [],
  );

  // Fetch all job searches (for dropdown)
  useEffect(() => {
    async function fetchAllJobSearches() {
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();

        if (data.jobSearches && data.jobSearches.length > 0) {
          // Transform database job searches to store format (without jobs initially)
          const transformedSearches = data.jobSearches.map(
            (search: JobSearchWithJobs) => ({
              id: search.id,
              title: search.title,
              description: search.description,
              jobs: [],
            }),
          );

          setJobSearches(transformedSearches);

          // Set the first job search as selected if none is selected
          if (!selectedJobSearchId && transformedSearches.length > 0) {
            setSelectedJobSearchId(transformedSearches[0].id);
          }
        } else if (!initialized) {
          // Fallback to mock data if no database data exists
          initialize();
        }
      } catch (error) {
        console.error("Error fetching job searches:", error);
        // Fallback to mock data on error
        if (!initialized) {
          initialize();
        }
      }
    }

    if (viewMode === "jobs") {
      fetchAllJobSearches();
    }
  }, [
    viewMode,
    initialized,
    initialize,
    setJobSearches,
    selectedJobSearchId,
    setSelectedJobSearchId,
  ]);

  // Fetch jobs for the selected job search
  useEffect(() => {
    async function fetchJobsForSearch() {
      if (!selectedJobSearchId) return;

      // Only fetch if the selected job search exists in our list
      const jobSearchExists = jobSearches.some(
        (search) => search.id === selectedJobSearchId,
      );
      if (!jobSearchExists) return;

      try {
        setIsLoadingJobs(true);
        const response = await fetch(
          `/api/jobs?jobSearchId=${selectedJobSearchId}`,
        );
        const data = await response.json();

        if (data && data.jobs) {
          // Update the specific job search with its jobs
          const jobSearch: JobSearchWithJobs = data;
          const transformedJobs = jobSearch.jobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            description: job.description,
            views: transformViewsToRecursive(job.views),
          }));

          // Update only the jobs for this specific search
          setJobSearches(
            jobSearches.map((search) =>
              search.id === selectedJobSearchId
                ? { ...search, jobs: transformedJobs }
                : search,
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching jobs for search:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    }

    if (viewMode === "jobs" && selectedJobSearchId) {
      fetchJobsForSearch();
    }
  }, [
    viewMode,
    selectedJobSearchId,
    jobSearches.map, // Update only the jobs for this specific search
    setJobSearches,
    transformViewsToRecursive,
  ]);

  // Fetch conversations from Mastra memory
  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoadingConversations(true);

        // Determine resourceId based on selected job search
        // Map selectedJobSearchId to resourceId
        // Default to job-search-1 for demo purposes
        const resourceId = selectedJobSearchId || "job-search-1";

        // Fetch all conversations with messages for each thread
        const response = await fetch(
          `/api/conversations?resourceId=${resourceId}`,
        );
        const data = await response.json();

        if (data.conversations) {
          // Fetch messages for each conversation
          const conversationsWithMessages = await Promise.all(
            data.conversations.map(async (thread: ConversationThread) => {
              try {
                const detailResponse = await fetch(
                  `/api/conversations/${thread.id}`,
                );
                const detailData = await detailResponse.json();

                // Transform with messages
                return transformConversationToRecursiveItem(
                  detailData.thread,
                  detailData.messages,
                );
              } catch (error) {
                console.error(
                  `Error fetching messages for thread ${thread.id}:`,
                  error,
                );
                // Transform without messages on error
                return transformConversationToRecursiveItem(thread);
              }
            }),
          );

          setConversations(conversationsWithMessages);

          // Auto-select the most recently selected conversation, or the first one if none selected
          if (conversationsWithMessages.length > 0) {
            if (selectedConversationId) {
              // Check if the previously selected conversation still exists
              const stillExists = conversationsWithMessages.find(
                (c) => c.id === selectedConversationId,
              );
              if (!stillExists) {
                // If it doesn't exist, select the first conversation
                setSelectedConversationId(conversationsWithMessages[0].id);
              }
            } else {
              // No conversation selected, select the first one
              setSelectedConversationId(conversationsWithMessages[0].id);
            }
          } else {
            // No conversations available
            setSelectedConversationId(null);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
        setSelectedConversationId(null);
      } finally {
        setIsLoadingConversations(false);
      }
    }

    if (viewMode === "threads") {
      fetchConversations();
    }
  }, [
    viewMode,
    selectedJobSearchId,
    selectedConversationId,
    setSelectedConversationId,
  ]);

  // Get the selected job search
  const selectedJobSearch = jobSearches.find(
    (search) => search.id === selectedJobSearchId,
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

  // Handler for adding a new job
  const handleAddNewJob = async () => {
    if (!selectedJobSearchId) return;

    try {
      // Create a blank job via API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobSearchId: selectedJobSearchId,
          title: "New Job",
          company: "",
          location: "",
          salary: "",
          description: "",
        }),
      });

      if (response.ok) {
        const newJob = await response.json();

        // Refetch jobs for the current search to include the new job
        const jobsResponse = await fetch(
          `/api/jobs?jobSearchId=${selectedJobSearchId}`,
        );
        const data = await jobsResponse.json();

        if (data && data.jobs) {
          const jobSearch: JobSearchWithJobs = data;
          const transformedJobs = jobSearch.jobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            description: job.description,
            views: transformViewsToRecursive(job.views),
          }));

          // Update jobs in store
          setJobSearches(
            jobSearches.map((search) =>
              search.id === selectedJobSearchId
                ? { ...search, jobs: transformedJobs }
                : search,
            ),
          );

          // Select the newly created job
          setSelectedJobId(newJob.id);
        }
      }
    } catch (error) {
      console.error("Error creating new job:", error);
    }
  };

  return (
    <RecursiveBrowser
      items={viewMode === "jobs" ? jobItems : conversations}
      config={viewMode === "jobs" ? jobBrowserConfig : threadBrowserConfig}
      selectedItemId={
        viewMode === "jobs" ? selectedJobId : selectedConversationId
      }
      onSelectItemId={
        viewMode === "jobs" ? setSelectedJobId : setSelectedConversationId
      }
      onAddNewItem={viewMode === "jobs" ? handleAddNewJob : undefined}
    />
  );
}
