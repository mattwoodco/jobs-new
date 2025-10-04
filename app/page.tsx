import type { RecursiveItem } from "@/components/recursive-browser";
import { RecursiveBrowser } from "@/components/recursive-browser";
import { jobBrowserConfig } from "@/lib/config";
import { mockJobs } from "@/lib/mock-data";

export default function Home() {
  // Transform old Job type to new RecursiveItem type
  const items: RecursiveItem[] = mockJobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    metadata: {
      company: job.company,
      location: job.location,
      salary: job.salary,
    },
    views: job.views,
  }));

  return <RecursiveBrowser items={items} config={jobBrowserConfig} />;
}
