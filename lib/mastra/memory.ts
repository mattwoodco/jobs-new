import { Memory } from "@mastra/memory";
import { storage } from "./stores";

export const memory = new Memory({
  options: {
    threads: {
      generateTitle: true,
    },
    workingMemory: {
      enabled: true,
      scope: "resource",
      template: `# User Profile
 - **Name**:`,
    },
  },
  storage,
});
