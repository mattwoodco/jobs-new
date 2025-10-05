import { gateway } from "@ai-sdk/gateway";

import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { dummyWorkflow } from "../workflows/dummy-workflow";

export const workflowAgent = new Agent({
  name: "Workflow Agent",
  instructions: `
      You are a helpful assistant that can execute workflows to process data.

      Your primary function is to help users process data through a multi-step workflow. When responding:
      - Ask the user what input they'd like to process if none is provided
      - Use the dummy_workflow to process the input through 3 sequential steps
      - Explain the results from each step clearly
      - Keep responses concise but informative

      Use the dummy_workflow tool to process user input through a 3-step pipeline.
`,
  model: gateway("fireworks/gpt-oss-120b"),
  workflows: {
    dummy_workflow: dummyWorkflow,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
