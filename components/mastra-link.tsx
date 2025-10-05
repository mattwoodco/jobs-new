"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MastraLink() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button variant="ghost" size="icon" asChild className="cursor-pointer">
      <Link href="http://localhost:3020/" target="_blank" rel="noopener noreferrer">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </Link>
    </Button>
  );
}
