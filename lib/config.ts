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
