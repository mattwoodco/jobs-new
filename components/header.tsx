"use client";

import { Briefcase, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { navConfig } from "@/lib/config";
import {
  useJobSearchStore,
  useViewStore,
  useConversationStore,
} from "@/lib/store";

export function Header() {
  const { viewMode, setViewMode } = useViewStore();
  const {
    jobSearches,
    selectedJobSearchId,
    setSelectedJobSearchId,
    setIsCreatingNewJobSearch,
    initialize,
  } = useJobSearchStore();
  const { setSelectedConversationId } = useConversationStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleNewChat = async () => {
    try {
      // Create thread via Mastra API with a default title
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Conversation ${new Date().toLocaleDateString()}`,
          resourceId: "workflowAgent",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newThread = result.thread;

        // Select the new thread to open it
        setSelectedConversationId(newThread.id);

        // Force a page refresh to load the new thread
        window.location.reload();
      } else {
        console.error("Failed to create thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <header className="w-full bg-background border-b">
      <div className="flex items-center justify-between pl-2 pr-2 md:pr-8 h-14">
        {/* Left side: Location dropdown + icon buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile: Three-dot menu (before location) */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navConfig.map((item) => (
                <DropdownMenuItem key={item.label}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Desktop: Home button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden md:flex cursor-pointer"
          >
            <Link href="/">
              {(() => {
                const HomeIcon = navConfig[0].icon;
                return <HomeIcon className="w-4 h-4" />;
              })()}
            </Link>
          </Button>

          <Select
            value={selectedJobSearchId || ""}
            onValueChange={(value) => {
              if (value === "new") {
                setIsCreatingNewJobSearch(true);
              } else {
                setSelectedJobSearchId(value);
              }
            }}
          >
            <SelectTrigger className="w-[220px] cursor-pointer">
              <SelectValue placeholder="Select job search" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new" className="font-medium">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add new Search
                </div>
              </SelectItem>
              {jobSearches.map((search) => (
                <SelectItem key={search.id} value={search.id}>
                  {search.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Desktop: Individual icon buttons */}
          {/* <div className="hidden md:flex items-center gap-2">
            {navConfig.slice(1, 6).map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="icon"
                className="cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
          </div> */}
        </div>

        {/* Right side: Button group and other actions */}
        <div className="flex items-center gap-2">
          {viewMode === "threads" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
          <ButtonGroup>
            <Button
              id="job-view-button"
              variant={viewMode === "jobs" ? "secondary" : "outline"}
              size="icon"
              onClick={() => {
                setViewMode("jobs");
                // Remove focus to prevent hover state on first item
                (document.activeElement as HTMLElement)?.blur();
              }}
              className="cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
            </Button>
            <Button
              id="conversation-view-button"
              variant={viewMode === "threads" ? "secondary" : "outline"}
              size="icon"
              onClick={() => {
                setViewMode("threads");
                // Remove focus to prevent hover state on first item
                (document.activeElement as HTMLElement)?.blur();
              }}
              className="cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          {/* <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </Button> */}
          {/* <MastraLink />
          <DrizzleLink /> */}
        </div>
      </div>
    </header>
  );
}
