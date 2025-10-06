import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Select an entity to get started</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
