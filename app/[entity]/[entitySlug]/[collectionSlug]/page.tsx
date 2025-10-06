import { EntityBrowser } from "@/components/entity-browser";
import { getEntityData, isValidEntity } from "@/lib/get-entity-data";
import { findBySlug } from "@/lib/slugify";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    entity: string;
    entitySlug: string;
    collectionSlug: string;
  }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { entity, entitySlug, collectionSlug } = await params;

  if (!isValidEntity(entity)) {
    notFound();
  }

  const data = await getEntityData(entity);
  const entityItem = findBySlug(data.entities, entitySlug);

  if (!entityItem) {
    notFound();
  }

  const collection = findBySlug(entityItem.collections, collectionSlug);

  if (!collection) {
    notFound();
  }

  return (
    <EntityBrowser
      data={data}
      entityType={entity}
      initialEntity={entityItem}
      initialCollection={collection}
    />
  );
}
