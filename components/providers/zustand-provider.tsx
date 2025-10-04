"use client";

import { useEffect, useRef } from "react";

export function ZustandProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize Zustand stores on client side
    if (!initialized.current) {
      initialized.current = true;
      // Any initialization logic can go here
      // The store will automatically hydrate from localStorage
    }
  }, []);

  return <>{children}</>;
}
