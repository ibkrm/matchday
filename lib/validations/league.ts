import { z } from "zod";

export const leagueSchema = z.object({
  name: z.string().min(1, "League name is required").max(100),
  season: z.string().min(1, "Season is required").regex(/^\d{4}-\d{2}$/, "Season must be in format YYYY-YY (e.g., 2024-25)"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["draft", "active", "completed", "cancelled"]).default("draft"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const groupSchema = z.object({
  leagueId: z.number().int().positive("League is required"),
  name: z.string().min(1, "Group name is required").max(50),
  description: z.string().optional(),
});

export type LeagueFormData = z.infer<typeof leagueSchema>;
export type GroupFormData = z.infer<typeof groupSchema>;
