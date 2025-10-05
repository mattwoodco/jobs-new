import { PostgresStore } from "@mastra/pg";

export const storage = new PostgresStore({
  connectionString: process.env.CHAT_MEMORY_DATABASE_URL as string,
});
