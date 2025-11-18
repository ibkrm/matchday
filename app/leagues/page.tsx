import Link from "next/link";
import { getLeagues } from "@/lib/actions/leagues";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeaguesPage() {
  const leagues = await getLeagues();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Leagues</h1>
          <p className="text-muted-foreground mt-2">
            Manage your soccer leagues and seasons
          </p>
        </div>
        <Button asChild>
          <Link href="/leagues/new">Create League</Link>
        </Button>
      </div>

      {leagues.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No leagues yet</CardTitle>
            <CardDescription>
              Get started by creating your first league
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/leagues/new">Create Your First League</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Card key={league.id}>
              <CardHeader>
                <CardTitle>{league.name}</CardTitle>
                <CardDescription>Season {league.season}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {league.description && (
                    <p className="text-muted-foreground">{league.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      league.status === "active" ? "bg-green-100 text-green-700" :
                      league.status === "draft" ? "bg-gray-100 text-gray-700" :
                      league.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {league.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
