import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real data from database
const standings = [
  {
    position: 1,
    team: "FC Barcelona",
    played: 12,
    won: 10,
    drawn: 1,
    lost: 1,
    goalsFor: 32,
    goalsAgainst: 8,
    goalDiff: 24,
    points: 31,
    form: ["W", "W", "W", "D", "W"],
  },
  {
    position: 2,
    team: "Real Madrid",
    played: 12,
    won: 9,
    drawn: 2,
    lost: 1,
    goalsFor: 28,
    goalsAgainst: 10,
    goalDiff: 18,
    points: 29,
    form: ["W", "W", "L", "W", "W"],
  },
  {
    position: 3,
    team: "Atletico Madrid",
    played: 12,
    won: 8,
    drawn: 3,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 12,
    goalDiff: 12,
    points: 27,
    form: ["W", "D", "W", "W", "D"],
  },
  {
    position: 4,
    team: "Athletic Bilbao",
    played: 12,
    won: 7,
    drawn: 4,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 11,
    goalDiff: 11,
    points: 25,
    form: ["W", "D", "W", "D", "W"],
  },
  {
    position: 5,
    team: "Real Sociedad",
    played: 12,
    won: 6,
    drawn: 4,
    lost: 2,
    goalsFor: 19,
    goalsAgainst: 14,
    goalDiff: 5,
    points: 22,
    form: ["L", "W", "D", "W", "D"],
  },
  {
    position: 6,
    team: "Valencia",
    played: 12,
    won: 5,
    drawn: 5,
    lost: 2,
    goalsFor: 18,
    goalsAgainst: 15,
    goalDiff: 3,
    points: 20,
    form: ["D", "W", "D", "L", "W"],
  },
];

const FormBadge = ({ result }: { result: string }) => {
  const variant =
    result === "W" ? "success" : result === "D" ? "warning" : "destructive";

  return (
    <Badge variant={variant} className="w-6 h-6 p-0 flex items-center justify-center text-[10px] font-bold">
      {result}
    </Badge>
  );
};

export default function StandingsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl mb-2">STANDINGS</h1>
          <p className="text-muted-foreground text-lg">La Liga 2024-25</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-4 py-2 rounded-md border border-border bg-background text-sm font-medium">
            <option>La Liga</option>
            <option>Premier League</option>
            <option>Bundesliga</option>
            <option>Serie A</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>League Table</CardTitle>
              <CardDescription>Current season standings after matchday 12</CardDescription>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm bg-primary/20 border-l-2 border-primary"></div>
                <span className="text-muted-foreground">Champions League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm bg-accent/20 border-l-2 border-accent"></div>
                <span className="text-muted-foreground">Europa League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm bg-destructive/20 border-l-2 border-destructive"></div>
                <span className="text-muted-foreground">Relegation</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead className="w-12 font-display text-xs">POS</TableHead>
                <TableHead className="font-display text-xs">TEAM</TableHead>
                <TableHead className="text-center font-display text-xs">P</TableHead>
                <TableHead className="text-center font-display text-xs">W</TableHead>
                <TableHead className="text-center font-display text-xs">D</TableHead>
                <TableHead className="text-center font-display text-xs">L</TableHead>
                <TableHead className="text-center font-display text-xs">GF</TableHead>
                <TableHead className="text-center font-display text-xs">GA</TableHead>
                <TableHead className="text-center font-display text-xs">GD</TableHead>
                <TableHead className="text-center font-display text-xs font-bold">PTS</TableHead>
                <TableHead className="font-display text-xs">FORM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team) => (
                <TableRow
                  key={team.position}
                  className={`
                    ${team.position <= 4 ? "bg-primary/5 border-l-2 border-l-primary" : ""}
                    ${team.position === 5 || team.position === 6 ? "bg-accent/5 border-l-2 border-l-accent" : ""}
                    hover:bg-accent/10
                  `}
                >
                  <TableCell className="font-mono font-bold">{team.position}</TableCell>
                  <TableCell className="font-medium">{team.team}</TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.played}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.won}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.drawn}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.lost}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.goalsFor}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {team.goalsAgainst}
                  </TableCell>
                  <TableCell className="text-center font-mono font-medium">
                    {team.goalDiff > 0 ? "+" : ""}
                    {team.goalDiff}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-lg">
                    {team.points}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {team.form.map((result, i) => (
                        <FormBadge key={i} result={result} />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Scorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Robert Lewandowski</div>
                <div className="text-sm text-muted-foreground">FC Barcelona</div>
              </div>
              <div className="font-mono text-3xl font-bold text-primary">14</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Assists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Luka Modri</div>
                <div className="text-sm text-muted-foreground">Real Madrid</div>
              </div>
              <div className="font-mono text-3xl font-bold text-accent">9</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Best Defense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">FC Barcelona</div>
                <div className="text-sm text-muted-foreground">Goals conceded</div>
              </div>
              <div className="font-mono text-3xl font-bold" style={{ color: 'hsl(var(--chart-3))' }}>8</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
