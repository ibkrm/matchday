import { getPlayers } from "@/lib/actions/players";
import { getAllTeamsWithDetails } from "@/lib/queries/teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp, Award, AlertCircle } from "lucide-react";
import { PlayerDialog } from "./player-dialog";

export default async function PlayersPage() {
  const [playersResult, teams] = await Promise.all([
    getPlayers(),
    getAllTeamsWithDetails(),
  ]);

  const players = playersResult.success ? playersResult.data : [];

  // Group players by position for stats
  const statsByPosition = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const positionColors = {
    goalkeeper: "hsl(var(--chart-3))",
    defender: "hsl(var(--chart-1))",
    midfielder: "hsl(var(--chart-2))",
    forward: "hsl(var(--chart-4))",
  };

  const positionIcons = {
    goalkeeper: "🥅",
    defender: "🛡️",
    midfielder: "⚙️",
    forward: "⚡",
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header with gradient background */}
      <div className="gradient-mesh rounded-lg p-8 -m-8 mb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-5xl mb-2">PLAYERS</h1>
            <p className="text-muted-foreground text-lg">
              Manage player rosters across all teams
            </p>
          </div>
          <PlayerDialog teams={teams}>
            <Button className="gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              New Player
            </Button>
          </PlayerDialog>
        </div>

        {/* Position Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {(["goalkeeper", "defender", "midfielder", "forward"] as const).map((position) => (
            <div
              key={position}
              className="bg-card rounded-lg p-4 border-l-4 transition-all hover:shadow-md"
              style={{ borderColor: positionColors[position] }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{positionIcons[position]}</div>
                  <div className="text-xs text-muted-foreground capitalize">{position}s</div>
                </div>
                <div className="font-mono text-2xl font-bold" style={{ color: positionColors[position] }}>
                  {statsByPosition[position] || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      {players.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl mb-2">No Players Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your roster by adding players
            </p>
            <PlayerDialog teams={teams}>
              <Button>Add First Player</Button>
            </PlayerDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-in">
          {players.map((player) => {
            const team = teams.find((t) => t.id === player.teamId);
            const positionColor = positionColors[player.position];

            return (
              <Card key={player.id} className="card-hover overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={`${player.firstName} ${player.lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-2"
                        style={{ borderColor: positionColor }}
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display text-2xl border-2"
                        style={{ backgroundColor: positionColor, borderColor: positionColor }}
                      >
                        {player.firstName.charAt(0)}
                        {player.lastName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      {player.jerseyNumber && (
                        <div className="font-mono text-xl font-bold" style={{ color: positionColor }}>
                          #{player.jerseyNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{ borderColor: positionColor, color: positionColor }}
                    >
                      {positionIcons[player.position]} {player.position}
                    </Badge>
                    {player.status !== "active" && (
                      <Badge variant={player.status === "injured" ? "destructive" : "secondary"}>
                        {player.status}
                      </Badge>
                    )}
                  </div>

                  {team && (
                    <div className="text-xs text-muted-foreground">
                      {team.name}
                    </div>
                  )}

                  {(player.height || player.weight) && (
                    <div className="text-xs text-muted-foreground flex gap-3">
                      {player.height && <span>{player.height}cm</span>}
                      {player.weight && <span>{player.weight}kg</span>}
                    </div>
                  )}

                  {player.nationality && (
                    <div className="text-xs text-muted-foreground">
                      🌍 {player.nationality}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Stats
                    </Button>
                    <PlayerDialog player={player} teams={teams}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </PlayerDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
