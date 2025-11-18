import { db } from "@/db/client";
import { teams, groups, leagues } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllTeamsWithDetails() {
  try {
    const result = await db
      .select({
        id: teams.id,
        name: teams.name,
        shortName: teams.shortName,
        groupId: teams.groupId,
        groupName: groups.name,
        leagueId: groups.leagueId,
        leagueName: leagues.name,
        leagueSeason: leagues.season,
      })
      .from(teams)
      .leftJoin(groups, eq(teams.groupId, groups.id))
      .leftJoin(leagues, eq(groups.leagueId, leagues.id));
    
    return result;
  } catch (error) {
    console.error("Failed to fetch teams with details:", error);
    return [];
  }
}
