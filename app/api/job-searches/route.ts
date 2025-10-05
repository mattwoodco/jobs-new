import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobSearches } from "@/lib/db/schema";

// POST new job search
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Create the new job search
    const newJobSearch = await db
      .insert(jobSearches)
      .values({
        title,
        description,
      })
      .returning();

    return NextResponse.json(newJobSearch[0], { status: 201 });
  } catch (error) {
    console.error("Error creating job search:", error);
    return NextResponse.json(
      { error: "Failed to create job search" },
      { status: 500 },
    );
  }
}
