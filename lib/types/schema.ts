export interface Metadata {
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  value: unknown;
  metadata: Metadata;
  properties: Record<string, unknown>;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  metadata: Metadata;
  items: Item[];
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  metadata: Metadata;
  collections: Collection[];
}

export interface Schema {
  entities: Entity[];
}
