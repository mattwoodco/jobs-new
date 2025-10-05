"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";

export function MastraLink() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button variant="outline" asChild className="cursor-pointer">
      <Link
        href="http://localhost:3020/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Bot />
        <span className="hidden md:inline">Playground</span>
      </Link>
    </Button>
  );
}
