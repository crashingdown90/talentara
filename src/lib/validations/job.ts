import { z } from "zod";

// =============================
// Job Filter Schema (query params)
// =============================

export const jobFilterSchema = z.object({
  search: z.string().optional(),
  category: z.enum(["spg", "usher", "both"]).optional(),
  city: z.string().optional(),
  job_type: z.enum(["one_time", "recurring", "long_term"]).optional(),
  gender: z.enum(["male", "female", "any"]).optional(),
  min_rate: z.number().optional(),
  max_rate: z.number().optional(),
  sort: z.enum(["latest", "rate_high", "rate_low", "deadline"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type JobFilterInput = z.infer<typeof jobFilterSchema>;

// =============================
// Job Application Schema
// =============================

export const jobApplicationSchema = z.object({
  cover_message: z
    .string()
    .max(500, "Cover message maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
