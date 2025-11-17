import { getTeams } from "@/lib/actions/teams";
import { getAllGroupsWithLeagues } from "@/lib/queries/groups";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import { TeamDialog } from "./team-dialog";

export default async function TeamsPage() {
  const [teamsResult, groups] = await Promise.all([
    getTeams(),
    getAllGroupsWithLeagues(),
  ]);
  
  const teams = teamsResult.success ? teamsResult.data : [];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl mb-2">TEAMS</h1>
          <p className="text-muted-foreground text-lg">
            Manage teams across all leagues and groups
          </p>
        </div>
        <TeamDialog groups={groups}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Team
          </Button>
        </TeamDialog>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first team to get started
            </p>
            <TeamDialog groups={groups}>
              <Button>Create Team</Button>
            </TeamDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const teamGroup = groups.find((g) => g.id === team.groupId);
            
            return (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display text-xl"
                          style={{
                            backgroundColor: team.primaryColor || "hsl(var(--primary))",
                          }}
                        >
                          {team.shortName || team.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                        {team.shortName && (
                          <CardDescription className="font-mono">{team.shortName}</CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamGroup && (
                    <div className="text-sm">
                      <Badge variant="outline" className="font-normal">
                        {teamGroup.leagueName} - {teamGroup.name}
                      </Badge>
                    </div>
                  )}
                  
                  {team.coachName && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Coach:</span>{" "}
                      <span className="font-medium">{team.coachName}</span>
                    </div>
                  )}
                  
                  {team.homeField && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Home:</span>{" "}
                      <span className="font-medium">{team.homeField}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      View Players
                    </Button>
                    <TeamDialog team={team} groups={groups}>
                      <Button variant="ghost">Edit</Button>
                    </TeamDialog>
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
