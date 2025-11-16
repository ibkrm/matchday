import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { matches } from "./matches";
import { players } from "./players";
import { teams } from "./teams";

export const matchEvents = sqliteTable("match_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "restrict" }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "restrict" }),
  eventType: text("event_type", {
    enum: [
      "goal",
      "penalty_goal",
      "own_goal",
      "yellow_card",
      "red_card",
      "substitution_in",
      "substitution_out",
    ],
  }).notNull(),
  minute: integer("minute").notNull(), // Minute of the match
  additionalTime: integer("additional_time").default(0), // e.g., 45+2
  assistPlayerId: integer("assist_player_id").references(() => players.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type MatchEvent = typeof matchEvents.$inferSelect;
export type NewMatchEvent = typeof matchEvents.$inferInsert;
