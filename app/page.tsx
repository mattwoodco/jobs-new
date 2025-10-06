import { Button } from "@/components/ui/button";
import Link from "next/link";

const ENTITIES = [
  {
    name: "Accounts",
    path: "/accounts",
    description: "Account settings & configurations",
  },
  {
    name: "Analytics",
    path: "/analytics",
    description: "Job search performance metrics",
  },
  {
    name: "Calendar",
    path: "/calendar",
    description: "Interviews & deadlines",
  },
  {
    name: "Companies",
    path: "/companies",
    description: "Target company research",
  },
  {
    name: "Documents",
    path: "/documents",
    description: "Resumes & cover letters",
  },
  { name: "Events", path: "/events", description: "Activity feed & timeline" },
  {
    name: "Network",
    path: "/network",
    description: "Professional connections",
  },
  {
    name: "Notifications",
    path: "/notifications",
    description: "Activity notifications",
  },
  { name: "Searches", path: "/searches", description: "Job search queries" },
  { name: "Skills", path: "/skills", description: "Skills & certifications" },
  { name: "Teams", path: "/teams", description: "Team members & contacts" },
  {
    name: "Templates",
    path: "/templates",
    description: "Email & document templates",
  },
  { name: "Threads", path: "/threads", description: "Communication threads" },
  {
    name: "Workflows",
    path: "/workflows",
    description: "Application workflows",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-8 overflow-auto h-full">
      <h1 className="text-3xl font-bold mb-2">Job Application Tracker</h1>
      <p className="text-muted-foreground mb-8">
        Select an entity type to browse
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto">
        {ENTITIES.map((entity) => (
          <Link key={entity.path} href={entity.path}>
            <Button
              variant="outline"
              className="w-full h-32 flex flex-col items-start justify-start p-6 text-left"
            >
              <span className="text-xl font-semibold mb-2 whitespace-normal break-words">
                {entity.name}
              </span>
              <span className="text-sm text-muted-foreground whitespace-normal break-words">
                {entity.description}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
