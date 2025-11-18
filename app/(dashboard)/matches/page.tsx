import { getAllMatchesWithTeams } from "@/lib/queries/matches";
import { getAllTeamsWithDetails } from "@/lib/queries/teams";
import { getLeagues } from "@/lib/actions/leagues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, MapPin } from "lucide-react";
import { MatchDialog } from "./match-dialog";

export default async function MatchesPage() {
  const [matches, teams, leaguesResult] = await Promise.all([
    getAllMatchesWithTeams(),
    getAllTeamsWithDetails(),
    getLeagues(),
  ]);

  const leagues = leaguesResult.success ? leaguesResult.data : [];

  // Separate matches by status
  const upcoming = matches.filter((m) => m.status === "scheduled");
  const live = matches.filter((m) => m.status === "live" || m.status === "halftime");
  const completed = matches.filter((m) => m.status === "completed");

  const statusColors = {
    scheduled: "outline",
    live: "destructive",
    halftime: "warning",
    completed: "secondary",
    postponed: "outline",
    cancelled: "destructive",
  } as const;

  function MatchCard({ match }: { match: any }) {
    const isCompleted = match.status === "completed";
    const isLive = match.status === "live" || match.status === "halftime";

    return (
      <Card className={`card-hover ${isLive ? "border-2 border-red-500" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(match.scheduledAt).toLocaleDateString()}
              <Clock className="w-4 h-4 ml-2" />
              {new Date(match.scheduledAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <Badge variant={statusColors[match.status as keyof typeof statusColors]}>
              {isLive && "🔴 "}
              {match.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teams */}
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              {match.homeTeam?.logoUrl ? (
                <img
                  src={match.homeTeam.logoUrl}
                  alt={match.homeTeam.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display text-sm"
                  style={{
                    backgroundColor: match.homeTeam?.primaryColor || "hsl(var(--primary))",
                  }}
                >
                  {match.homeTeam?.shortName || match.homeTeam?.name?.substring(0, 3).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{match.homeTeam?.name}</div>
                {isCompleted && match.homeHalfTimeScore !== null && (
                  <div className="text-xs text-muted-foreground">
                    HT: {match.homeHalfTimeScore}
                  </div>
                )}
              </div>
            </div>

            {/* Score */}
            {isCompleted || isLive ? (
              <div className="px-6">
                <div className="font-mono text-3xl font-bold text-center">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </div>
              </div>
            ) : (
              <div className="px-6 text-2xl text-muted-foreground font-display">VS</div>
            )}

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="flex-1 min-w-0 text-right">
                <div className="font-semibold truncate">{match.awayTeam?.name}</div>
                {isCompleted && match.awayHalfTimeScore !== null && (
                  <div className="text-xs text-muted-foreground">
                    HT: {match.awayHalfTimeScore}
                  </div>
                )}
              </div>
              {match.awayTeam?.logoUrl ? (
                <img
                  src={match.awayTeam.logoUrl}
                  alt={match.awayTeam.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display text-sm"
                  style={{
                    backgroundColor: match.awayTeam?.primaryColor || "hsl(var(--accent))",
                  }}
                >
                  {match.awayTeam?.shortName || match.awayTeam?.name?.substring(0, 3).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-4">
              {match.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {match.venue}
                </div>
              )}
              {match.matchday && <div>Matchday {match.matchday}</div>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <MatchDialog match={match} teams={teams} leagues={leagues}>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </MatchDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="gradient-mesh rounded-lg p-8 -m-8 mb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-5xl mb-2">MATCHES</h1>
            <p className="text-muted-foreground text-lg">
              Schedule and track all matches across leagues
            </p>
          </div>
          <MatchDialog teams={teams} leagues={leagues}>
            <Button className="gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              New Match
            </Button>
          </MatchDialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-card rounded-lg p-4 border-l-4 border-l-red-500">
            <div className="text-xs text-muted-foreground mb-1">Live Now</div>
            <div className="font-mono text-3xl font-bold text-red-500">{live.length}</div>
          </div>
          <div className="bg-card rounded-lg p-4 border-l-4 border-l-primary">
            <div className="text-xs text-muted-foreground mb-1">Upcoming</div>
            <div className="font-mono text-3xl font-bold text-primary">{upcoming.length}</div>
          </div>
          <div className="bg-card rounded-lg p-4 border-l-4 border-l-muted-foreground">
            <div className="text-xs text-muted-foreground mb-1">Completed</div>
            <div className="font-mono text-3xl font-bold">{completed.length}</div>
          </div>
        </div>
      </div>

      {/* Live Matches */}
      {live.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-2xl flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            LIVE NOW
          </h2>
          <div className="space-y-3 stagger-in">
            {live.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-2xl">UPCOMING MATCHES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-in">
            {upcoming.slice(0, 10).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-2xl">RECENT RESULTS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-in">
            {completed.slice(0, 10).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl mb-2">No Matches Scheduled</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first match
            </p>
            <MatchDialog teams={teams} leagues={leagues}>
              <Button>Schedule Match</Button>
            </MatchDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
