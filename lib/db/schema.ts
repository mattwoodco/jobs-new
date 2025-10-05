import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Job Searches Table
export const jobSearches = pgTable("job_searches", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Jobs Table
export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobSearchId: uuid("job_search_id")
    .notNull()
    .references(() => jobSearches.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Job Views Table (recursive structure for views and subviews)
export const jobViews = pgTable("job_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  parentViewId: uuid("parent_view_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order: text("order").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const jobSearchesRelations = relations(jobSearches, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  jobSearch: one(jobSearches, {
    fields: [jobs.jobSearchId],
    references: [jobSearches.id],
  }),
  views: many(jobViews),
}));

export const jobViewsRelations = relations(jobViews, ({ one, many }) => ({
  job: one(jobs, {
    fields: [jobViews.jobId],
    references: [jobs.id],
  }),
  parentView: one(jobViews, {
    fields: [jobViews.parentViewId],
    references: [jobViews.id],
    relationName: "subviews",
  }),
  subViews: many(jobViews, {
    relationName: "subviews",
  }),
}));

// TypeScript Types derived from schema
export type JobSearch = typeof jobSearches.$inferSelect;
export type NewJobSearch = typeof jobSearches.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type JobView = typeof jobViews.$inferSelect;
export type NewJobView = typeof jobViews.$inferInsert;

// Extended types with relations for UI use
export type JobViewWithSubViews = JobView & {
  subViews?: JobViewWithSubViews[];
};

export type JobWithViews = Job & {
  views: JobViewWithSubViews[];
};

export type JobSearchWithJobs = JobSearch & {
  jobs: JobWithViews[];
};
