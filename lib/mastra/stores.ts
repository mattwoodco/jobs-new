import { PostgresStore } from "@mastra/pg";

export const storage = new PostgresStore({
  connectionString: (process.env.JOBS_CHAT_DATABASE_URL ||
    process.env.CHAT_MEMORY_DATABASE_URL) as string,
});
