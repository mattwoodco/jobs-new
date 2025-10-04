"use client";

import { Analytics } from "@vercel/analytics/next";

import { CommandDialog } from "@/components/command-dialog";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ZustandProvider } from "@/components/providers/zustand-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ZustandProvider>
        {children}
        <Analytics />
        <CommandDialog />
      </ZustandProvider>
    </ThemeProvider>
  );
}
