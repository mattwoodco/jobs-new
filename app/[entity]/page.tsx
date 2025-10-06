import { EntityBrowser } from "@/components/entity-browser";
import { getEntityData, isValidEntity } from "@/lib/get-entity-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ entity: string }>;
}

export default async function EntityPage({ params }: PageProps) {
  const { entity } = await params;

  if (!isValidEntity(entity)) {
    notFound();
  }

  try {
    const data = await getEntityData(entity);
    const firstEntity = data.entities[0] || null;
    return (
      <EntityBrowser
        data={data}
        entityType={entity}
        initialEntity={firstEntity}
      />
    );
  } catch (error) {
    console.error(`Error loading ${entity}:`, error);
    notFound();
  }
}

export async function generateStaticParams() {
  return [
    { entity: "notifications" },
    { entity: "searches" },
    { entity: "threads" },
    { entity: "workflows" },
  ];
}
