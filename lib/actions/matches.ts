"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { matches, matchEvents } from "@/db/schema";
import { matchSchema, matchEventSchema, type MatchFormData, type MatchEventFormData } from "@/lib/validations/match";
import { eq } from "drizzle-orm";

// ============= MATCHES =============

export async function createMatch(data: MatchFormData) {
  try {
    const validated = matchSchema.parse(data);
    
    const [match] = await db.insert(matches).values(validated).returning();
    
    revalidatePath("/matches");
    return { success: true, data: match };
  } catch (error) {
    console.error("Failed to create match:", error);
    return { success: false, error: "Failed to create match" };
  }
}

export async function updateMatch(id: number, data: MatchFormData) {
  try {
    const validated = matchSchema.parse(data);
    
    const [match] = await db
      .update(matches)
      .set({ ...validated, updatedAt: new Date().toISOString() })
      .where(eq(matches.id, id))
      .returning();
    
    revalidatePath("/matches");
    revalidatePath(`/matches/${id}`);
    return { success: true, data: match };
  } catch (error) {
    console.error("Failed to update match:", error);
    return { success: false, error: "Failed to update match" };
  }
}

export async function deleteMatch(id: number) {
  try {
    await db.delete(matches).where(eq(matches.id, id));
    
    revalidatePath("/matches");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete match:", error);
    return { success: false, error: "Failed to delete match" };
  }
}

export async function getMatches() {
  try {
    const allMatches = await db.select().from(matches).orderBy(matches.scheduledAt);
    return { success: true, data: allMatches };
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return { success: false, error: "Failed to fetch matches" };
  }
}

export async function getMatchById(id: number) {
  try {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return { success: true, data: match };
  } catch (error) {
    console.error("Failed to fetch match:", error);
    return { success: false, error: "Failed to fetch match" };
  }
}

// ============= MATCH EVENTS =============

export async function createMatchEvent(data: MatchEventFormData) {
  try {
    const validated = matchEventSchema.parse(data);
    
    const [event] = await db.insert(matchEvents).values(validated).returning();
    
    revalidatePath(`/matches/${data.matchId}`);
    return { success: true, data: event };
  } catch (error) {
    console.error("Failed to create match event:", error);
    return { success: false, error: "Failed to create match event" };
  }
}

export async function deleteMatchEvent(id: number) {
  try {
    await db.delete(matchEvents).where(eq(matchEvents.id, id));
    
    revalidatePath("/matches");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete match event:", error);
    return { success: false, error: "Failed to delete match event" };
  }
}

export async function getMatchEvents(matchId: number) {
  try {
    const events = await db
      .select()
      .from(matchEvents)
      .where(eq(matchEvents.matchId, matchId))
      .orderBy(matchEvents.minute, matchEvents.additionalTime);
    
    return { success: true, data: events };
  } catch (error) {
    console.error("Failed to fetch match events:", error);
    return { success: false, error: "Failed to fetch match events" };
  }
}
