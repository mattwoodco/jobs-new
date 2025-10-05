import type { LucideIcon } from "lucide-react";

import {
  Bell,
  Box,
  Home,
  MapPin,
  Network,
  Search,
  Sheet,
  Users,
} from "lucide-react";
import type { BrowserConfig } from "@/components/recursive-browser";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href?: string;
};

export const navConfig: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "Contacts" },
  { icon: Sheet, label: "Data" },
  { icon: MapPin, label: "Maps" },
  { icon: Box, label: "Spatial" },
  { icon: Network, label: "Workflows" },
  { icon: Search, label: "Search" },
  { icon: Bell, label: "Notifications" },
];

export const jobBrowserConfig: BrowserConfig = {
  labels: {
    listTitle: "Job Listings",
    listCount: "positions",
    backToList: "Back to jobs",
    backToDetail: "Back",
    noItemSelected: "No job selected",
    selectPrompt: "Select a job from the list to view details",
    moreInfo: "More Information",
    moreDetails: "More Details",
  },
  metadataFields: [
    { key: "company" },
    { key: "location", separator: "•" },
    { key: "salary", separator: "•" },
  ],
  storageKey: "job-browser-panels",
};

export const threadBrowserConfig: BrowserConfig = {
  labels: {
    listTitle: "Conversations",
    listCount: "threads",
    backToList: "Back to threads",
    backToDetail: "Back",
    noItemSelected: "No thread selected",
    selectPrompt: "Select a conversation to view messages",
    moreInfo: "Thread Details",
    moreDetails: "More Details",
  },
  metadataFields: [
    { key: "company" },
    { key: "messageCount", separator: "•" },
    { key: "timestamp", separator: "•" },
  ],
  storageKey: "thread-browser-panels",
};
