import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { leagues, groups } from "./leagues";
import { teams } from "./teams";

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  leagueId: integer("league_id")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  groupId: integer("group_id")
    .references(() => groups.id, { onDelete: "set null" }),
  homeTeamId: integer("home_team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "restrict" }),
  awayTeamId: integer("away_team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "restrict" }),
  scheduledAt: text("scheduled_at").notNull(), // ISO 8601 datetime
  venue: text("venue"),
  matchday: integer("matchday"), // Round/Week number
  status: text("status", {
    enum: ["scheduled", "live", "halftime", "completed", "postponed", "cancelled"],
  })
    .notNull()
    .default("scheduled"),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  homeHalfTimeScore: integer("home_halftime_score"),
  awayHalfTimeScore: integer("away_halftime_score"),
  attendance: integer("attendance"),
  refereeId: integer("referee_id"), // Could reference a referees table
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
