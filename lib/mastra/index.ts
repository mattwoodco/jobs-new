import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { Mastra } from "@mastra/core/mastra";
import { workflowAgent } from "./agents/workflow-agent";
import { dummyWorkflow } from "./workflows/dummy-workflow";

export const mastra = new Mastra({
  agents: { workflowAgent },
  workflows: { dummyWorkflow },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    port: 3020,
    host: "localhost",
  },
});
