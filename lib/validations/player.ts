import { z } from "zod";

export const playerSchema = z.object({
  teamId: z.number().int().positive("Team is required"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  jerseyNumber: z.number().int().min(0).max(99).optional().nullable(),
  position: z.enum(["goalkeeper", "defender", "midfielder", "forward"]),
  dateOfBirth: z.string().optional().or(z.literal("")),
  nationality: z.string().max(50).optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
  height: z.number().int().min(100).max(250).optional().nullable(), // cm
  weight: z.number().int().min(30).max(150).optional().nullable(), // kg
  preferredFoot: z.enum(["left", "right", "both"]).optional().nullable(),
  status: z.enum(["active", "injured", "suspended", "inactive"]).default("active"),
});

export type PlayerFormData = z.infer<typeof playerSchema>;
