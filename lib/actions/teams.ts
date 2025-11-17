"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { teams } from "@/db/schema";
import { teamSchema, type TeamFormData } from "@/lib/validations/team";
import { eq } from "drizzle-orm";

export async function createTeam(data: TeamFormData) {
  try {
    const validated = teamSchema.parse(data);
    
    const [team] = await db.insert(teams).values(validated).returning();
    
    revalidatePath("/teams");
    revalidatePath(`/groups/${data.groupId}`);
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function updateTeam(id: number, data: TeamFormData) {
  try {
    const validated = teamSchema.parse(data);
    
    const [team] = await db
      .update(teams)
      .set({ ...validated, updatedAt: new Date().toISOString() })
      .where(eq(teams.id, id))
      .returning();
    
    revalidatePath("/teams");
    revalidatePath(`/teams/${id}`);
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to update team:", error);
    return { success: false, error: "Failed to update team" };
  }
}

export async function deleteTeam(id: number) {
  try {
    await db.delete(teams).where(eq(teams.id, id));
    
    revalidatePath("/teams");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team:", error);
    return { success: false, error: "Failed to delete team" };
  }
}

export async function getTeams() {
  try {
    const allTeams = await db.select().from(teams).orderBy(teams.name);
    return { success: true, data: allTeams };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function getTeamsByGroup(groupId: number) {
  try {
    const groupTeams = await db.select().from(teams).where(eq(teams.groupId, groupId));
    return { success: true, data: groupTeams };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function getTeamById(id: number) {
  try {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to fetch team:", error);
    return { success: false, error: "Failed to fetch team" };
  }
}
