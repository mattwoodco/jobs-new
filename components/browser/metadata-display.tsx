import type { BrowserConfig } from "../recursive-browser";

interface MetadataDisplayProps {
  metadata: Record<string, string>;
  fields: BrowserConfig["metadataFields"];
  variant?: "default" | "compact";
}

export function MetadataDisplay({
  metadata,
  fields,
  variant = "default",
}: MetadataDisplayProps) {
  if (fields.length === 0) return null;

  return (
    <>
      <p
        className={
          variant === "compact"
            ? "text-sm text-muted-foreground truncate"
            : "text-muted-foreground"
        }
      >
        {metadata[fields[0].key]}
      </p>
      {fields.length > 1 && (
        <div
          className={
            variant === "compact"
              ? "flex gap-2 mt-1 text-xs text-muted-foreground"
              : "flex gap-3 mt-2 text-sm text-muted-foreground"
          }
        >
          {fields.slice(1).map((field, idx) => (
            <span key={field.key}>
              {idx > 0 && field.separator && `${field.separator} `}
              {metadata[field.key]}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
