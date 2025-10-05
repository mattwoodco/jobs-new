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
import { useViewStore, useJobSearchStore } from "@/lib/store";
import { MastraLink } from "./mastra-link";

export function Header() {
  const { viewMode, setViewMode } = useViewStore();
  const {
    jobSearches,
    selectedJobSearchId,
    setSelectedJobSearchId,
    setIsCreatingNewJobSearch,
    initialize,
  } = useJobSearchStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
            onValueChange={setSelectedJobSearchId}
          >
            <SelectTrigger className="w-[220px] cursor-pointer">
              <SelectValue placeholder="Select job search" />
            </SelectTrigger>
            <SelectContent>
              {jobSearches.map((search) => (
                <SelectItem key={search.id} value={search.id}>
                  {search.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreatingNewJobSearch(true)}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </Button>

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
          <ButtonGroup>
            <Button
              variant={viewMode === "jobs" ? "secondary" : "outline"}
              size="icon"
              onClick={() => setViewMode("jobs")}
              className="cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "threads" ? "secondary" : "outline"}
              size="icon"
              onClick={() => setViewMode("threads")}
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
          <MastraLink />
        </div>
      </div>
    </header>
  );
}
