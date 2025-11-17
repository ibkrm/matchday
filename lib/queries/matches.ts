import { db } from "@/db/client";
import { matches, teams } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllMatchesWithTeams() {
  try {
    const result = await db
      .select({
        match: matches,
        homeTeam: {
          id: teams.id,
          name: teams.name,
          shortName: teams.shortName,
          logoUrl: teams.logoUrl,
          primaryColor: teams.primaryColor,
        },
        awayTeam: {
          id: teams.id,
          name: teams.name,
          shortName: teams.shortName,
          logoUrl: teams.logoUrl,
          primaryColor: teams.primaryColor,
        },
      })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .orderBy(desc(matches.scheduledAt));

    // Need to do a second query for away team
    const matchesWithBothTeams = await Promise.all(
      result.map(async (item) => {
        const [awayTeam] = await db
          .select({
            id: teams.id,
            name: teams.name,
            shortName: teams.shortName,
            logoUrl: teams.logoUrl,
            primaryColor: teams.primaryColor,
          })
          .from(teams)
          .where(eq(teams.id, item.match.awayTeamId));

        return {
          ...item.match,
          homeTeam: item.homeTeam,
          awayTeam,
        };
      })
    );

    return matchesWithBothTeams;
  } catch (error) {
    console.error("Failed to fetch matches with teams:", error);
    return [];
  }
}
