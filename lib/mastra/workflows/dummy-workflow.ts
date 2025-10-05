import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({
  id: "step-1",
  description: "First dummy step - processes input",
  inputSchema: z.object({
    input: z.string(),
  }),
  outputSchema: z.object({
    step1Result: z.string(),
    input: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { input } = inputData;
    const step1Result = `Step 1 processed: ${input}`;

    return {
      step1Result,
      input,
    };
  },
});

const step2 = createStep({
  id: "step-2",
  description: "Second dummy step - transforms data",
  inputSchema: z.object({
    step1Result: z.string(),
    input: z.string(),
  }),
  outputSchema: z.object({
    step2Result: z.string(),
    step1Result: z.string(),
    input: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { step1Result, input } = inputData;
    const step2Result = `Step 2 transformed: ${step1Result} | Original: ${input}`;

    return {
      step2Result,
      step1Result,
      input,
    };
  },
});

const step3 = createStep({
  id: "step-3",
  description: "Third dummy step - finalizes output",
  inputSchema: z.object({
    step2Result: z.string(),
    step1Result: z.string(),
    input: z.string(),
  }),
  outputSchema: z.object({
    finalResult: z.string(),
    allSteps: z.object({
      step1: z.string(),
      step2: z.string(),
      step3: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    const { step2Result, step1Result } = inputData;
    const step3Result = `Step 3 finalized: ${step2Result}`;

    return {
      finalResult: step3Result,
      allSteps: {
        step1: step1Result,
        step2: step2Result,
        step3: step3Result,
      },
    };
  },
});

export const dummyWorkflow = createWorkflow({
  id: "dummy-workflow",
  description: "A workflow with 3 dummy steps that process and return data",
  inputSchema: z.object({
    input: z.string(),
  }),
  outputSchema: z.object({
    finalResult: z.string(),
    allSteps: z.object({
      step1: z.string(),
      step2: z.string(),
      step3: z.string(),
    }),
  }),
})
  .then(step1)
  .then(step2)
  .then(step3)
  .commit();
