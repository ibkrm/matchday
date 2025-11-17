"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { leagues, groups } from "@/db/schema";
import { leagueSchema, groupSchema, type LeagueFormData, type GroupFormData } from "@/lib/validations/league";
import { eq } from "drizzle-orm";

// ============= LEAGUES =============

export async function createLeague(data: LeagueFormData) {
  try {
    const validated = leagueSchema.parse(data);
    
    const [league] = await db.insert(leagues).values(validated).returning();
    
    revalidatePath("/leagues");
    return { success: true, data: league };
  } catch (error) {
    console.error("Failed to create league:", error);
    return { success: false, error: "Failed to create league" };
  }
}

export async function updateLeague(id: number, data: LeagueFormData) {
  try {
    const validated = leagueSchema.parse(data);
    
    const [league] = await db
      .update(leagues)
      .set({ ...validated, updatedAt: new Date().toISOString() })
      .where(eq(leagues.id, id))
      .returning();
    
    revalidatePath("/leagues");
    revalidatePath(`/leagues/${id}`);
    return { success: true, data: league };
  } catch (error) {
    console.error("Failed to update league:", error);
    return { success: false, error: "Failed to update league" };
  }
}

export async function deleteLeague(id: number) {
  try {
    await db.delete(leagues).where(eq(leagues.id, id));
    
    revalidatePath("/leagues");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete league:", error);
    return { success: false, error: "Failed to delete league" };
  }
}

export async function getLeagues() {
  try {
    const allLeagues = await db.select().from(leagues).orderBy(leagues.createdAt);
    return { success: true, data: allLeagues };
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return { success: false, error: "Failed to fetch leagues" };
  }
}

export async function getLeagueById(id: number) {
  try {
    const [league] = await db.select().from(leagues).where(eq(leagues.id, id));
    return { success: true, data: league };
  } catch (error) {
    console.error("Failed to fetch league:", error);
    return { success: false, error: "Failed to fetch league" };
  }
}

// ============= GROUPS =============

export async function createGroup(data: GroupFormData) {
  try {
    const validated = groupSchema.parse(data);
    
    const [group] = await db.insert(groups).values(validated).returning();
    
    revalidatePath("/leagues");
    revalidatePath(`/leagues/${data.leagueId}`);
    return { success: true, data: group };
  } catch (error) {
    console.error("Failed to create group:", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function updateGroup(id: number, data: GroupFormData) {
  try {
    const validated = groupSchema.parse(data);
    
    const [group] = await db
      .update(groups)
      .set({ ...validated, updatedAt: new Date().toISOString() })
      .where(eq(groups.id, id))
      .returning();
    
    revalidatePath("/leagues");
    revalidatePath(`/leagues/${data.leagueId}`);
    return { success: true, data: group };
  } catch (error) {
    console.error("Failed to update group:", error);
    return { success: false, error: "Failed to update group" };
  }
}

export async function deleteGroup(id: number) {
  try {
    await db.delete(groups).where(eq(groups.id, id));
    
    revalidatePath("/leagues");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete group:", error);
    return { success: false, error: "Failed to delete group" };
  }
}

export async function getGroupsByLeague(leagueId: number) {
  try {
    const leagueGroups = await db.select().from(groups).where(eq(groups.leagueId, leagueId));
    return { success: true, data: leagueGroups };
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return { success: false, error: "Failed to fetch groups" };
  }
}
