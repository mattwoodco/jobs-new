import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { Mastra } from "@mastra/core/mastra";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
  agents: { weatherAgent },
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
