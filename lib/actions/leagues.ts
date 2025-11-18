"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { leagues } from "@/db/schema/leagues";
import { leagueSchema, type LeagueFormData } from "@/lib/schemas/league";

export async function createLeague(data: LeagueFormData) {
  try {
    const validated = leagueSchema.parse(data);

    const [league] = await db.insert(leagues).values(validated).returning();

    revalidatePath("/leagues");
    return { success: true, league };
  } catch (error) {
    console.error("Failed to create league:", error);
    throw error;
  }
}

export async function getLeagues() {
  try {
    const allLeagues = await db.select().from(leagues);
    return allLeagues;
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    throw error;
  }
}
