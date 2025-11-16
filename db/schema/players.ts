import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teams } from "./teams";

export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jerseyNumber: integer("jersey_number"),
  position: text("position", {
    enum: ["goalkeeper", "defender", "midfielder", "forward"],
  }).notNull(),
  dateOfBirth: text("date_of_birth"), // ISO 8601 date
  nationality: text("nationality"),
  photoUrl: text("photo_url"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  preferredFoot: text("preferred_foot", { enum: ["left", "right", "both"] }),
  status: text("status", { enum: ["active", "injured", "suspended", "inactive"] })
    .notNull()
    .default("active"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
