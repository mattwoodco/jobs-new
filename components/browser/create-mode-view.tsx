import { Briefcase } from "lucide-react";

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
import { NewJobSearchForm } from "@/components/new-job-search-form";

interface CreateModeViewProps {
  leftPanelSize: number;
  setLeftPanelSize: (size: number) => void;
  isHydrated: boolean;
}

export function CreateModeView({
  leftPanelSize,
  setLeftPanelSize,
  isHydrated,
}: CreateModeViewProps) {
  if (!isHydrated) return null;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full"
      onLayout={(sizes) => {
        if (sizes[0]) setLeftPanelSize(sizes[0]);
      }}
    >
      {/* Left Panel - Empty State */}
      <ResizablePanel
        defaultSize={leftPanelSize}
        minSize={20}
        maxSize={40}
        className="overflow-y-auto"
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-4 border-b shrink-0">
            <h2 className="text-lg font-semibold">New Job Search</h2>
            <p className="text-sm text-muted-foreground">
              Create a new job search to get started
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Briefcase />
                </EmptyMedia>
                <EmptyTitle>No jobs yet</EmptyTitle>
                <EmptyDescription>
                  Add jobs to your search to get started
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="hidden md:flex" />

      {/* Right Panel - Job Search Form */}
      <ResizablePanel
        defaultSize={100 - leftPanelSize}
        className="overflow-y-auto hidden md:block"
      >
        <NewJobSearchForm />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
