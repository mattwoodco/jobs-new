import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Schema } from "@/lib/types/schema";

const VALID_ENTITIES = [
  "accounts",
  "analytics",
  "calendar",
  "companies",
  "documents",
  "events",
  "network",
  "notifications",
  "searches",
  "skills",
  "teams",
  "templates",
  "threads",
  "workflows",
] as const;

export type EntityType = (typeof VALID_ENTITIES)[number];

export function isValidEntity(entity: string): entity is EntityType {
  return VALID_ENTITIES.includes(entity as EntityType);
}

export async function getEntityData(entity: EntityType): Promise<Schema> {
  const filePath = join(process.cwd(), "_sample", `${entity}.json`);
  const fileContents = await readFile(filePath, "utf8");
  return JSON.parse(fileContents) as Schema;
}
