import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Hero Section with gradient */}
      <div className="gradient-mesh rounded-lg p-8 -m-8 mb-0 animate-in">
        <h1 className="font-display text-6xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          SEASON 2024-25
        </h1>
        <p className="text-muted-foreground text-lg">
          Your complete soccer league management platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        <Card className="stat-card border-l-4 border-l-primary card-hover" style={{ color: 'hsl(var(--primary))' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leagues</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              +1 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-accent card-hover" style={{ color: 'hsl(var(--accent))' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all leagues
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-chart-3 card-hover" style={{ color: 'hsl(var(--chart-3))' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 this week
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-l-4 border-l-chart-4 card-hover" style={{ color: 'hsl(var(--chart-4))' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold">428</div>
            <p className="text-xs text-muted-foreground mt-1">
              3.01 per match average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Matches</CardTitle>
            <CardDescription>Next fixtures across all leagues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                home: "FC Barcelona",
                away: "Real Madrid",
                date: "Nov 17, 2024",
                time: "15:00",
                league: "La Liga",
              },
              {
                home: "Manchester United",
                away: "Liverpool",
                date: "Nov 18, 2024",
                time: "16:30",
                league: "Premier League",
              },
              {
                home: "Bayern Munich",
                away: "Borussia Dortmund",
                date: "Nov 19, 2024",
                time: "18:00",
                league: "Bundesliga",
              },
            ].map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {match.home} <span className="text-muted-foreground">vs</span> {match.away}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {match.date} · {match.time}
                  </div>
                </div>
                <Badge variant="outline">{match.league}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Latest match outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                home: "Arsenal",
                away: "Chelsea",
                homeScore: 2,
                awayScore: 1,
                date: "Nov 15, 2024",
                league: "Premier League",
              },
              {
                home: "Inter Milan",
                away: "AC Milan",
                homeScore: 3,
                awayScore: 3,
                date: "Nov 14, 2024",
                league: "Serie A",
              },
              {
                home: "PSG",
                away: "Marseille",
                homeScore: 1,
                awayScore: 0,
                date: "Nov 13, 2024",
                league: "Ligue 1",
              },
            ].map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{match.home}</span>
                    <span className="font-mono font-bold text-lg">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="font-medium">{match.away}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {match.date}
                  </div>
                </div>
                <Badge variant="outline">{match.league}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your leagues and matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group">
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <div className="font-medium">Create League</div>
              <div className="text-xs text-muted-foreground mt-1">Start a new competition</div>
            </button>
            <button className="p-6 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
              <Users className="w-8 h-8 text-accent mb-2" />
              <div className="font-medium">Add Team</div>
              <div className="text-xs text-muted-foreground mt-1">Register new team</div>
            </button>
            <button className="p-6 rounded-lg border border-border hover:border-chart-3 hover:bg-chart-3/5 transition-all group">
              <Calendar className="w-8 h-8 mb-2" style={{ color: 'hsl(var(--chart-3))' }} />
              <div className="font-medium">Schedule Match</div>
              <div className="text-xs text-muted-foreground mt-1">Create new fixture</div>
            </button>
            <button className="p-6 rounded-lg border border-border hover:border-chart-4 hover:bg-chart-4/5 transition-all group">
              <TrendingUp className="w-8 h-8 mb-2" style={{ color: 'hsl(var(--chart-4))' }} />
              <div className="font-medium">View Stats</div>
              <div className="text-xs text-muted-foreground mt-1">Analyze performance</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
