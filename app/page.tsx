import { RecursiveBrowser } from "@/components/recursive-browser";
import { mockJobs } from "@/lib/mock-data";

export default function Home() {
  return <RecursiveBrowser items={mockJobs} />;
}
