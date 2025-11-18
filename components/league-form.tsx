"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLeague } from "@/lib/actions/leagues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LeagueForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Format season to YYYY-YY
    const seasonInput = formData.get("season") as string;
    let formattedSeason = seasonInput;

    // If user entered full year format like "2024-2025", convert to "2024-25"
    if (seasonInput && seasonInput.includes("-")) {
      const parts = seasonInput.split("-");
      if (parts.length === 2 && parts[1].length === 4) {
        formattedSeason = `${parts[0]}-${parts[1].slice(-2)}`;
      }
    }

    const data = {
      name: formData.get("name") as string,
      season: formattedSeason,
      description: formData.get("description") as string || undefined,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      logoUrl: formData.get("logoUrl") as string || undefined,
    };

    try {
      await createLeague(data);
      router.push("/leagues");
      router.refresh();
    } catch (err) {
      console.error("Error creating league:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create league. Please check the form and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New League</CardTitle>
        <CardDescription>Enter the details for your new soccer league</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">League Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Premier League"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season">Season *</Label>
            <Input
              id="season"
              name="season"
              placeholder="2024-25"
              pattern="\d{4}-\d{2}"
              title="Format: YYYY-YY (e.g., 2024-25)"
              required
            />
            <p className="text-sm text-muted-foreground">
              Format: YYYY-YY (e.g., 2024-25)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="League description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              placeholder="https://example.com/logo.png (optional)"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create League"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/leagues")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
