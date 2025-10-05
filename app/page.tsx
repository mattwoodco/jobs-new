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

  // Clear selections when switching view modes
  useEffect(() => {
    if (viewMode === "jobs") {
      setSelectedConversationId(null);
    } else if (viewMode === "threads") {
      setSelectedJobId(null);
    }
  }, [viewMode, setSelectedConversationId, setSelectedJobId]);

  // Helper function to transform database views to recursive structure
  const transformViewsToRecursive = useCallback(function transformViews(
    views: JobViewWithSubViews[],
  ): RecursiveItem["views"] {
    return views.map((view) => ({
      id: view.id,
      title: view.title,
      description: view.description,
      content: view.content,
      subViews: view.subViews ? transformViews(view.subViews) : undefined,
    }));
  }, []);

  // Fetch all job searches (for dropdown) - only run once on mount or when switching to jobs view
  useEffect(() => {
    async function fetchAllJobSearches() {
      if (initialized) return; // Only fetch once

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
        } else {
          // No job searches found in database
          setJobSearches([]);
          setSelectedJobSearchId(null);
        }
      } catch (_error) {
        setJobSearches([]);
        setSelectedJobSearchId(null);
      } finally {
        initialize();
      }
    }

    if (viewMode === "jobs" && !initialized) {
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
      if (!selectedJobSearchId || !initialized) return;

      // Check if we already have jobs for this search
      const selectedSearch = jobSearches.find(
        (search) => search.id === selectedJobSearchId,
      );
      if (!selectedSearch || selectedSearch.jobs.length > 0) return;

      try {
        const response = await fetch(
          `/api/jobs?jobSearchId=${selectedJobSearchId}`,
        );
        const data = await response.json();

        if (data?.jobs) {
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
      } catch (_error) {
        // Error handling
      }
    }

    if (viewMode === "jobs" && selectedJobSearchId && initialized) {
      fetchJobsForSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    viewMode,
    selectedJobSearchId,
    initialized,
    jobSearches.find,
    jobSearches.map, // Update only the jobs for this specific search
    setJobSearches,
    transformViewsToRecursive,
  ]);

  // Fetch conversations from Mastra memory
  useEffect(() => {
    async function fetchConversations() {
      try {
        // Use consistent resourceId "workflowAgent" to match threads from Mastra playground
        const resourceId = "workflowAgent";

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
              } catch (_error) {
                // Transform without messages on error
                return transformConversationToRecursiveItem(thread);
              }
            }),
          );

          setConversations(conversationsWithMessages);

          // Validate that the currently selected conversation still exists
          if (conversationsWithMessages.length > 0 && selectedConversationId) {
            // Check if the previously selected conversation still exists
            const stillExists = conversationsWithMessages.find(
              (c) => c.id === selectedConversationId,
            );
            if (!stillExists) {
              // If it doesn't exist anymore, clear the selection
              setSelectedConversationId(null);
            }
          } else if (conversationsWithMessages.length === 0) {
            // No conversations available
            setSelectedConversationId(null);
          }
        }
      } catch (_error) {
        setConversations([]);
        setSelectedConversationId(null);
      }
    }

    if (viewMode === "threads") {
      fetchConversations();
    }
  }, [viewMode, setSelectedConversationId, selectedConversationId]);

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

        if (data?.jobs) {
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
    } catch (_error) {
      // Error handling
    }
  };

  // Handler for deleting a conversation
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the conversation from the list
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));

        // If the deleted conversation was selected, clear selection
        if (selectedConversationId === conversationId) {
          setSelectedConversationId(null);
        }
      }
    } catch (_error) {
      // Error handling
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
      onDeleteItem={
        viewMode === "threads" ? handleDeleteConversation : undefined
      }
    />
  );
}
