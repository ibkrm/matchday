import { getLeagues } from "@/lib/actions/leagues";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users } from "lucide-react";
import { LeagueDialog } from "./league-dialog";
import Link from "next/link";

export default async function LeaguesPage() {
  const result = await getLeagues();
  const leagues = result.success ? result.data : [];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl mb-2">LEAGUES</h1>
          <p className="text-muted-foreground text-lg">
            Manage your soccer leagues and competitions
          </p>
        </div>
        <LeagueDialog>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New League
          </Button>
        </LeagueDialog>
      </div>

      {/* Leagues Grid */}
      {leagues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl mb-2">No Leagues Yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first league
            </p>
            <LeagueDialog>
              <Button>Create League</Button>
            </LeagueDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Card key={league.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{league.name}</CardTitle>
                    <CardDescription className="font-mono">{league.season}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      league.status === "active"
                        ? "success"
                        : league.status === "completed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {league.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {league.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {league.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(league.startDate).toLocaleDateString()}</span>
                  </div>
                  <span>→</span>
                  <span>{new Date(league.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/leagues/${league.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <LeagueDialog league={league}>
                    <Button variant="ghost">Edit</Button>
                  </LeagueDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
