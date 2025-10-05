import { Mastra } from "@mastra/core/mastra";
import { workflowAgent } from "./agents/workflow-agent";
import { dummyWorkflow } from "./workflows/dummy-workflow";
import { storage } from "./stores";

export const mastra = new Mastra({
  agents: { workflowAgent },
  workflows: { dummyWorkflow },
  storage,
  // logger: new PinoLogger({
  //   name: "Mastra",
  //   level: "info",
  // }),
});
