"use client";

import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import Link from "next/link";

export function DrizzleLink() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button variant="outline" asChild className="cursor-pointer">
      <Link
        href="https://local.drizzle.studio/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Database />
      </Link>
    </Button>
  );
}
