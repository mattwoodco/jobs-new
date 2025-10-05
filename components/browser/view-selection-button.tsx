import { ChevronRight } from "lucide-react";

import type { RecursiveView } from "../recursive-browser";

interface ViewSelectionButtonProps {
  view: RecursiveView;
  isSelected: boolean;
  onSelect: (view: RecursiveView) => void;
}

export function ViewSelectionButton({
  view,
  isSelected,
  onSelect,
}: ViewSelectionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(view)}
      className={`w-full text-left p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? "bg-accent border-primary" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{view.title}</h4>
          <p className="text-sm text-muted-foreground">{view.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </button>
  );
}
