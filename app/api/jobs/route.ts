import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobSearches, jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type {
  JobSearchWithJobs,
  JobView,
  JobViewWithSubViews,
} from "@/lib/db/schema";

// Helper function to build nested view structure
function buildViewHierarchy(views: JobView[]): JobViewWithSubViews[] {
  const viewMap = new Map<string, JobViewWithSubViews>();
  const rootViews: JobViewWithSubViews[] = [];

  // First pass: create all view objects
  for (const view of views) {
    viewMap.set(view.id, { ...view, subViews: [] });
  }

  // Second pass: build hierarchy
  for (const view of views) {
    const viewWithSubViews = viewMap.get(view.id);
    if (!viewWithSubViews) continue;
    if (view.parentViewId) {
      const parent = viewMap.get(view.parentViewId);
      if (parent) {
        parent.subViews = parent.subViews || [];
        parent.subViews.push(viewWithSubViews);
      }
    } else {
      rootViews.push(viewWithSubViews);
    }
  }

  return rootViews;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobSearchId = searchParams.get("jobSearchId");

    // If jobSearchId is provided, fetch specific job search
    if (jobSearchId) {
      const jobSearch = await db.query.jobSearches.findFirst({
        where: eq(jobSearches.id, jobSearchId),
        with: {
          jobs: {
            with: {
              views: true,
            },
          },
        },
      });

      if (!jobSearch) {
        return NextResponse.json(
          { error: "Job search not found" },
          { status: 404 },
        );
      }

      // Transform the data to include nested view structure
      const jobSearchWithNestedViews = {
        ...jobSearch,
        jobs: jobSearch.jobs.map((job) => ({
          ...job,
          views: buildViewHierarchy(
            job.views.sort(
              (a, b) =>
                Number.parseInt(a.order, 10) - Number.parseInt(b.order, 10),
            ),
          ),
        })),
      } as JobSearchWithJobs;

      return NextResponse.json(jobSearchWithNestedViews);
    }

    // Fetch all job searches with their related jobs and views
    const allJobSearches = await db.query.jobSearches.findMany({
      with: {
        jobs: {
          with: {
            views: true,
          },
        },
      },
    });

    // Sort job searches by created date (newest first)
    const sortedSearches = allJobSearches.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Transform the data to include nested view structure
    const jobSearchesWithNestedViews = sortedSearches.map((search) => ({
      ...search,
      jobs: search.jobs.map((job) => ({
        ...job,
        views: buildViewHierarchy(
          job.views.sort(
            (a, b) =>
              Number.parseInt(a.order, 10) - Number.parseInt(b.order, 10),
          ),
        ),
      })),
    })) as JobSearchWithJobs[];

    return NextResponse.json({
      jobSearches: jobSearchesWithNestedViews,
      count: jobSearchesWithNestedViews.length,
    });
  } catch (error) {
    console.error("Error fetching job searches:", error);
    return NextResponse.json(
      { error: "Failed to fetch job searches" },
      { status: 500 },
    );
  }
}

// POST new job to a job search
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobSearchId, title, company, location, salary, description } = body;

    if (!jobSearchId) {
      return NextResponse.json(
        { error: "Job search ID is required" },
        { status: 400 },
      );
    }

    // Verify job search exists
    const jobSearch = await db.query.jobSearches.findFirst({
      where: eq(jobSearches.id, jobSearchId),
    });

    if (!jobSearch) {
      return NextResponse.json(
        { error: "Job search not found" },
        { status: 404 },
      );
    }

    // Create the new job
    const newJob = await db
      .insert(jobs)
      .values({
        jobSearchId,
        title: title || "New Job",
        company: company || "",
        location: location || "",
        salary: salary || "",
        description: description || "",
      })
      .returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
