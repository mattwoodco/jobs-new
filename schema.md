# Nested JSON Schema: Entities > Collections > Items

## Structure Overview

```
Entities
  └── Collections
        └── Items
```

## JSON Schema

```json
{
  "entities": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "metadata": {
        "createdAt": "ISO 8601 timestamp",
        "updatedAt": "ISO 8601 timestamp",
        "tags": ["string"]
      },
      "collections": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "metadata": {
            "createdAt": "ISO 8601 timestamp",
            "updatedAt": "ISO 8601 timestamp",
            "tags": ["string"]
          },
          "items": [
            {
              "id": "string",
              "name": "string",
              "description": "string",
              "type": "string",
              "value": "any",
              "metadata": {
                "createdAt": "ISO 8601 timestamp",
                "updatedAt": "ISO 8601 timestamp",
                "tags": ["string"]
              },
              "properties": {
                "key": "value"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Example

```json
{
  "entities": [
    {
      "id": "ent_001",
      "name": "Customer Database",
      "description": "Main customer data storage",
      "metadata": {
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-20T14:30:00Z",
        "tags": ["production", "customer-facing"]
      },
      "collections": [
        {
          "id": "col_001",
          "name": "Active Customers",
          "description": "Currently active customer records",
          "metadata": {
            "createdAt": "2025-01-15T10:30:00Z",
            "updatedAt": "2025-01-20T14:30:00Z",
            "tags": ["active"]
          },
          "items": [
            {
              "id": "item_001",
              "name": "John Doe",
              "description": "Premium customer account",
              "type": "customer",
              "value": {
                "email": "john.doe@example.com",
                "phone": "+1-555-0100"
              },
              "metadata": {
                "createdAt": "2025-01-16T09:00:00Z",
                "updatedAt": "2025-01-20T11:00:00Z",
                "tags": ["premium", "verified"]
              },
              "properties": {
                "accountStatus": "active",
                "tier": "gold",
                "lifetimeValue": 15000
              }
            },
            {
              "id": "item_002",
              "name": "Jane Smith",
              "description": "Standard customer account",
              "type": "customer",
              "value": {
                "email": "jane.smith@example.com",
                "phone": "+1-555-0200"
              },
              "metadata": {
                "createdAt": "2025-01-18T14:00:00Z",
                "updatedAt": "2025-01-19T16:00:00Z",
                "tags": ["verified"]
              },
              "properties": {
                "accountStatus": "active",
                "tier": "silver",
                "lifetimeValue": 5000
              }
            }
          ]
        },
        {
          "id": "col_002",
          "name": "Archived Customers",
          "description": "Inactive or archived customer records",
          "metadata": {
            "createdAt": "2025-01-15T10:30:00Z",
            "updatedAt": "2025-01-17T12:00:00Z",
            "tags": ["archived"]
          },
          "items": []
        }
      ]
    }
  ]
}
```

## Field Descriptions

### Entity Level
- **id**: Unique identifier for the entity
- **name**: Human-readable name of the entity
- **description**: Detailed description of the entity's purpose
- **metadata**: Metadata about the entity (timestamps, tags, etc.)
- **collections**: Array of collections belonging to this entity

### Collection Level
- **id**: Unique identifier for the collection
- **name**: Human-readable name of the collection
- **description**: Detailed description of the collection
- **metadata**: Metadata about the collection (timestamps, tags, etc.)
- **items**: Array of items belonging to this collection

### Item Level
- **id**: Unique identifier for the item
- **name**: Human-readable name of the item
- **description**: Detailed description of the item
- **type**: Type classification of the item
- **value**: The actual data/value stored (can be any type)
- **metadata**: Metadata about the item (timestamps, tags, etc.)
- **properties**: Additional custom properties specific to the item

## TypeScript Interface

```typescript
interface Entity {
  id: string;
  name: string;
  description: string;
  metadata: Metadata;
  collections: Collection[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  metadata: Metadata;
  items: Item[];
}

interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  value: any;
  metadata: Metadata;
  properties: Record<string, any>;
}

interface Metadata {
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  tags: string[];
}

interface Schema {
  entities: Entity[];
}
```
