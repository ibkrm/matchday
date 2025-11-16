import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { groups } from "./leagues";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  shortName: text("short_name"), // e.g., "MUN" for Manchester United
  logoUrl: text("logo_url"),
  homeField: text("home_field"),
  coachName: text("coach_name"),
  foundedYear: integer("founded_year"),
  primaryColor: text("primary_color"), // Hex color
  secondaryColor: text("secondary_color"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
