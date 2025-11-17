import { z } from "zod";

export const matchSchema = z.object({
  leagueId: z.number().int().positive("League is required"),
  groupId: z.number().int().positive().optional().nullable(),
  homeTeamId: z.number().int().positive("Home team is required"),
  awayTeamId: z.number().int().positive("Away team is required"),
  scheduledAt: z.string().min(1, "Match date/time is required"),
  venue: z.string().max(100).optional().or(z.literal("")),
  matchday: z.number().int().min(1).optional().nullable(),
  status: z.enum(["scheduled", "live", "halftime", "completed", "postponed", "cancelled"]).default("scheduled"),
  homeScore: z.number().int().min(0).default(0).optional().nullable(),
  awayScore: z.number().int().min(0).default(0).optional().nullable(),
  homeHalfTimeScore: z.number().int().min(0).optional().nullable(),
  awayHalfTimeScore: z.number().int().min(0).optional().nullable(),
  attendance: z.number().int().min(0).optional().nullable(),
  notes: z.string().optional().or(z.literal("")),
}).refine((data) => data.homeTeamId !== data.awayTeamId, {
  message: "Home and away teams must be different",
  path: ["awayTeamId"],
});

export const matchEventSchema = z.object({
  matchId: z.number().int().positive("Match is required"),
  playerId: z.number().int().positive("Player is required"),
  teamId: z.number().int().positive("Team is required"),
  eventType: z.enum([
    "goal",
    "penalty_goal",
    "own_goal",
    "yellow_card",
    "red_card",
    "substitution_in",
    "substitution_out",
  ]),
  minute: z.number().int().min(0).max(120),
  additionalTime: z.number().int().min(0).max(15).default(0),
  assistPlayerId: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().or(z.literal("")),
});

export type MatchFormData = z.infer<typeof matchSchema>;
export type MatchEventFormData = z.infer<typeof matchEventSchema>;
