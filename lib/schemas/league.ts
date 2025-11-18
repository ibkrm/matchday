import { z } from "zod";

export const leagueSchema = z.object({
  name: z.string().min(1, "League name is required").max(100),
  season: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Season must be in format YYYY-YY (e.g., 2024-25)"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type LeagueFormData = z.infer<typeof leagueSchema>;
