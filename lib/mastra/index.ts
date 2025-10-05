import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { Mastra } from "@mastra/core/mastra";
import { weatherAgent } from "./agents/weather-agent";
import { workflowAgent } from "./agents/workflow-agent";
import { dummyWorkflow } from "./workflows/dummy-workflow";

export const mastra = new Mastra({
  agents: { weatherAgent, workflowAgent },
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
