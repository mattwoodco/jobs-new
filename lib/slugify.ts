export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findBySlug<T extends { id: string; name: string }>(
  items: T[],
  slug: string,
): T | undefined {
  return items.find((item) => slugify(item.name) === slug || item.id === slug);
}
