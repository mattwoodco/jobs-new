"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useJobSearchStore } from "@/lib/store";
import { useForm } from "react-hook-form";

type NewJobSearchFormData = {
  title: string;
  description: string;
};

export function NewJobSearchForm() {
  const { addJobSearch, refreshJobSearches, setIsCreatingNewJobSearch } =
    useJobSearchStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewJobSearchFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: NewJobSearchFormData) => {
    try {
      // Create job search via API
      const response = await fetch("/api/job-searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      });

      if (response.ok) {
        const newJobSearch = await response.json();

        // Add to local store
        addJobSearch({
          id: newJobSearch.id,
          title: newJobSearch.title,
          description: newJobSearch.description,
          jobs: [],
        });

        // Trigger refresh to update dropdown
        refreshJobSearches();

        reset();
        setIsCreatingNewJobSearch(false);
      } else {
        console.error("Failed to create job search");
      }
    } catch (error) {
      console.error("Error creating job search:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 mx-auto container-sm lg:container-md xl:container-lg 2xl:container-xl max-w-2xl"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">New Job Search</h2>
        <p className="text-muted-foreground">
          Create a new job search to organize your applications
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="title">Search Title</FieldLabel>
        <FieldContent>
          <FieldDescription>
            Give your job search a descriptive name
          </FieldDescription>
          <Input
            id="title"
            placeholder="e.g., Tech Companies - Bay Area"
            {...register("title", { required: "Title is required" })}
          />
          <FieldError errors={errors.title ? [errors.title] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldContent>
          <FieldDescription>
            Describe what type of jobs you're looking for
          </FieldDescription>
          <Textarea
            id="description"
            placeholder="e.g., Searching for senior engineering roles at tech companies in San Francisco and surrounding areas"
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
          />
          <FieldError
            errors={errors.description ? [errors.description] : undefined}
          />
        </FieldContent>
      </Field>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreatingNewJobSearch(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Job Search"}
        </Button>
      </div>
    </form>
  );
}
