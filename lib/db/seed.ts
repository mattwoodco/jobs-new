import { db } from "./index";
import { jobSearches, jobs, jobViews } from "./schema";
import { mockJobSearches } from "../mock-data";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(jobViews);
    await db.delete(jobs);
    await db.delete(jobSearches);

    console.log("✅ Cleared existing data");

    // Seed job searches
    for (const mockSearch of mockJobSearches) {
      const [jobSearch] = await db
        .insert(jobSearches)
        .values({
          title: mockSearch.title,
          description: mockSearch.description,
        })
        .returning();

      console.log(`✅ Created job search: ${jobSearch.title}`);

      // Seed jobs for this search
      for (const mockJob of mockSearch.jobs) {
        const [job] = await db
          .insert(jobs)
          .values({
            jobSearchId: jobSearch.id,
            title: mockJob.title,
            company: mockJob.company,
            location: mockJob.location,
            salary: mockJob.salary,
            description: mockJob.description,
          })
          .returning();

        console.log(`  ✅ Created job: ${job.title} at ${job.company}`);

        // Seed views for this job
        for (let i = 0; i < mockJob.views.length; i++) {
          const mockView = mockJob.views[i];
          const [view] = await db
            .insert(jobViews)
            .values({
              jobId: job.id,
              parentViewId: null,
              title: mockView.title,
              description: mockView.description,
              content: mockView.content,
              order: i.toString(),
            })
            .returning();

          console.log(`    ✅ Created view: ${view.title}`);

          // Seed subviews if they exist
          if (mockView.subViews) {
            for (let j = 0; j < mockView.subViews.length; j++) {
              const subView = mockView.subViews[j];
              await db.insert(jobViews).values({
                jobId: job.id,
                parentViewId: view.id,
                title: subView.title,
                description: subView.description,
                content: subView.content,
                order: j.toString(),
              });

              console.log(`      ✅ Created subview: ${subView.title}`);
            }
          }
        }
      }
    }

    console.log("✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
