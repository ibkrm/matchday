import { z } from "zod";

export const teamSchema = z.object({
  groupId: z.number().int().positive("Group is required"),
  name: z.string().min(1, "Team name is required").max(100),
  shortName: z.string().max(10).optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  homeField: z.string().max(100).optional().or(z.literal("")),
  coachName: z.string().max(100).optional().or(z.literal("")),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().or(z.literal("")),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().or(z.literal("")),
});

export type TeamFormData = z.infer<typeof teamSchema>;
