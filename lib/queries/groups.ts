import { db } from "@/db/client";
import { groups, leagues } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllGroupsWithLeagues() {
  try {
    const result = await db
      .select({
        id: groups.id,
        name: groups.name,
        leagueId: groups.leagueId,
        leagueName: leagues.name,
        leagueSeason: leagues.season,
      })
      .from(groups)
      .leftJoin(leagues, eq(groups.leagueId, leagues.id));
    
    return result;
  } catch (error) {
    console.error("Failed to fetch groups with leagues:", error);
    return [];
  }
}
