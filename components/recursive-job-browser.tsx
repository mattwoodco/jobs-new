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
import type { Job, JobView } from "@/lib/mock-data";
import { mockJobs } from "@/lib/mock-data";
import { Header } from "./header";

// Store for panel sizes
interface PanelStore {
  leftPanelSize: number;
  rightPanelSize: number;
  setLeftPanelSize: (size: number) => void;
  setRightPanelSize: (size: number) => void;
}

const usePanelStore = create<PanelStore>()(
  persist(
    (set) => ({
      leftPanelSize: 30,
      rightPanelSize: 25,
      setLeftPanelSize: (size) => set({ leftPanelSize: size }),
      setRightPanelSize: (size) => set({ rightPanelSize: size }),
    }),
    {
      name: "job-browser-panels",
    },
  ),
);

export function RecursiveJobBrowser() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedView, setSelectedView] = useState<JobView | null>(null);
  const [selectedSubView, setSelectedSubView] = useState<JobView | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const { leftPanelSize, rightPanelSize, setLeftPanelSize, setRightPanelSize } =
    usePanelStore();

  const jobListRef = useRef<HTMLDivElement>(null);
  const jobDetailRef = useRef<HTMLDivElement>(null);
  const viewDetailRef = useRef<HTMLDivElement>(null);
  const subViewDetailRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-scroll on mobile when job is selected (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedJob) {
      jobDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedJob]);

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

  const handleBackToJobDetail = () => {
    jobDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => {
      setSelectedView(null);
      setSelectedSubView(null);
    }, 300);
  };

  const handleBackToJobList = () => {
    jobListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => {
      setSelectedJob(null);
      setSelectedView(null);
      setSelectedSubView(null);
    }, 300);
  };

  return (
    <div className="h-[100dvh] flex flex-col overscroll-none">
      <div className="w-full order-2 shrink-0 md:order-0">
        <Header />
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory md:overflow-hidden overscroll-none">
        <div className="h-full flex md:contents">
          {/* First snap point: Desktop resizable panels / Mobile job list */}
          <div
            ref={jobListRef}
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
                {/* Job List Panel */}
                <ResizablePanel
                  defaultSize={leftPanelSize}
                  minSize={20}
                  maxSize={40}
                  className="overflow-hidden"
                >
                  <JobList
                    jobs={mockJobs}
                    selectedJob={selectedJob}
                    onSelectJob={setSelectedJob}
                  />
                </ResizablePanel>

                <ResizableHandle withHandle className="hidden md:flex" />

                {/* Job Detail Panel (Desktop only) */}
                <ResizablePanel
                  defaultSize={
                    selectedView
                      ? 100 - leftPanelSize - rightPanelSize
                      : 100 - leftPanelSize
                  }
                  className="overflow-hidden hidden md:block"
                >
                  {selectedJob ? (
                    <JobDetail
                      job={selectedJob}
                      selectedView={selectedView}
                      onSelectView={setSelectedView}
                      onBack={handleBackToJobList}
                    />
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Briefcase />
                        </EmptyMedia>
                        <EmptyTitle>No job selected</EmptyTitle>
                        <EmptyDescription>
                          Select a job from the list to view details
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
                      className="overflow-hidden hidden md:block"
                      onResize={(size) => setRightPanelSize(size)}
                    >
                      <ViewDetail
                        view={selectedView}
                        selectedSubView={selectedSubView}
                        onSelectSubView={setSelectedSubView}
                        onBack={handleBackToJobDetail}
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            )}
          </div>

          {/* Second snap point: Job Detail (Mobile only) */}
          <div
            ref={jobDetailRef}
            className="w-full h-full shrink-0 snap-start md:hidden"
          >
            {selectedJob && (
              <JobDetail
                job={selectedJob}
                selectedView={selectedView}
                onSelectView={setSelectedView}
                onBack={handleBackToJobList}
              />
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
                onBack={handleBackToJobDetail}
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

// Job List Component
function JobList({
  jobs,
  selectedJob,
  onSelectJob,
}: {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job) => void;
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b shrink-0">
        <h2 className="text-lg font-semibold">Job Listings</h2>
        <p className="text-sm text-muted-foreground">{jobs.length} positions</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0">
          {jobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <button
                type="button"
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`w-full text-left px-4 py-4 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                  isSelected ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{job.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.company}
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
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

// Job Detail Component
function JobDetail({
  job,
  selectedView,
  onSelectView,
  onBack,
}: {
  job: Job;
  selectedView: JobView | null;
  onSelectView: (view: JobView) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-2 md:hidden"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to jobs
        </Button>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground">{job.company}</p>
        <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
          <span>{job.location}</span>
          <span>•</span>
          <span>{job.salary}</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-base leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              More Information
            </h3>
            <div className="space-y-2">
              {job.views.map((view) => {
                const isSelected = selectedView?.id === view.id;
                return (
                  <button
                    type="button"
                    key={view.id}
                    onClick={() => onSelectView(view)}
                    className={`w-full text-left p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                      isSelected ? "bg-accent border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{view.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {view.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
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
}: {
  view: JobView;
  selectedSubView: JobView | null;
  onSelectSubView: (subView: JobView) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
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
                More Details
              </h3>
              <div className="space-y-2">
                {view.subViews.map((subView) => {
                  const isSelected = selectedSubView?.id === subView.id;
                  return (
                    <button
                      type="button"
                      key={subView.id}
                      onClick={() => onSelectSubView(subView)}
                      className={`w-full text-left p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        isSelected ? "bg-accent border-primary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{subView.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {subView.description}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Sub-View Detail Component
function SubViewDetail({
  subView,
  onBack,
}: {
  subView: JobView;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
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
