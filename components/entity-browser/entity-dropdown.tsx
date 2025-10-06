import { cn } from "@/lib/utils";
import type { Entity } from "@/lib/types/schema";

interface EntityDropdownProps {
  entities: Entity[];
  selectedEntity?: Entity | null;
  entityType: string;
  onSelect: (entity: Entity | null) => void;
  className?: string;
}

export function EntityDropdown({
  entities,
  selectedEntity,
  entityType,
  onSelect,
  className,
}: EntityDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    if (!Number.isNaN(selectedIndex) && selectedIndex >= 0) {
      onSelect(entities[selectedIndex]);
    }
  };

  const selectedIndex = selectedEntity
    ? entities.findIndex((e) => e.id === selectedEntity.id)
    : -1;

  // Capitalize and format entity type for display
  const formattedEntityType =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  return (
    <select
      onChange={handleChange}
      value={selectedIndex >= 0 ? selectedIndex : ""}
      className={cn(
        "flex h-9 w-auto bg-transparent px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <option value="" disabled>
        Select {formattedEntityType.toLowerCase()}...
      </option>
      {entities.map((entity, index) => (
        <option key={index} value={index}>
          {entity.name}
        </option>
      ))}
    </select>
  );
}
