"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { players } from "@/db/schema";
import { playerSchema, type PlayerFormData } from "@/lib/validations/player";
import { eq } from "drizzle-orm";

export async function createPlayer(data: PlayerFormData) {
  try {
    const validated = playerSchema.parse(data);
    
    const [player] = await db.insert(players).values(validated).returning();
    
    revalidatePath("/players");
    revalidatePath(`/teams/${data.teamId}`);
    return { success: true, data: player };
  } catch (error) {
    console.error("Failed to create player:", error);
    return { success: false, error: "Failed to create player" };
  }
}

export async function updatePlayer(id: number, data: PlayerFormData) {
  try {
    const validated = playerSchema.parse(data);
    
    const [player] = await db
      .update(players)
      .set({ ...validated, updatedAt: new Date().toISOString() })
      .where(eq(players.id, id))
      .returning();
    
    revalidatePath("/players");
    revalidatePath(`/players/${id}`);
    revalidatePath(`/teams/${data.teamId}`);
    return { success: true, data: player };
  } catch (error) {
    console.error("Failed to update player:", error);
    return { success: false, error: "Failed to update player" };
  }
}

export async function deletePlayer(id: number) {
  try {
    await db.delete(players).where(eq(players.id, id));
    
    revalidatePath("/players");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete player:", error);
    return { success: false, error: "Failed to delete player" };
  }
}

export async function getPlayers() {
  try {
    const allPlayers = await db.select().from(players).orderBy(players.lastName);
    return { success: true, data: allPlayers };
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return { success: false, error: "Failed to fetch players" };
  }
}

export async function getPlayersByTeam(teamId: number) {
  try {
    const teamPlayers = await db.select().from(players).where(eq(players.teamId, teamId));
    return { success: true, data: teamPlayers };
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return { success: false, error: "Failed to fetch players" };
  }
}

export async function getPlayerById(id: number) {
  try {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return { success: true, data: player };
  } catch (error) {
    console.error("Failed to fetch player:", error);
    return { success: false, error: "Failed to fetch player" };
  }
}
