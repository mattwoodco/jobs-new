"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import { mockJobs } from "@/lib/mock-data";
import { useViewStore } from "@/lib/store";
import { MastraLink } from "./mastra-link";

export function Header() {
  const { toggleViewMode } = useViewStore();

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

          <Select defaultValue={mockJobs[0].title}>
            <SelectTrigger className="w-[220px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockJobs.map((job) => (
                <SelectItem key={job.id} value={job.title}>
                  {job.title}
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

        {/* Right side: Dropdown icon buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleViewMode}
            className="cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
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
