// Re-export all schema types
export * from "@/db/schema";

// Common types
export type PlayerPosition = "goalkeeper" | "defender" | "midfielder" | "forward";

export type MatchStatus = "scheduled" | "live" | "halftime" | "completed" | "postponed" | "cancelled";

export type EventType = 
  | "goal" 
  | "penalty_goal" 
  | "own_goal" 
  | "yellow_card" 
  | "red_card" 
  | "substitution_in" 
  | "substitution_out";

export type LeagueStatus = "draft" | "active" | "completed" | "cancelled";

export type PlayerStatus = "active" | "injured" | "suspended" | "inactive";

// Utility types for API responses
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Standings with team info
export type StandingsWithTeam = {
  standing: typeof import("@/db/schema").standings.$inferSelect;
  team: typeof import("@/db/schema").teams.$inferSelect;
};

// Match with teams
export type MatchWithTeams = {
  match: typeof import("@/db/schema").matches.$inferSelect;
  homeTeam: typeof import("@/db/schema").teams.$inferSelect;
  awayTeam: typeof import("@/db/schema").teams.$inferSelect;
};
