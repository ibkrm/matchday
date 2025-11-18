"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createMatch, updateMatch, deleteMatch } from "@/lib/actions/matches";
import type { Match, League } from "@/db/schema";

interface MatchDialogProps {
  children: React.ReactNode;
  match?: any; // Extended match with team info
  teams: Array<{
    id: number;
    name: string;
  }>;
  leagues: League[];
}

export function MatchDialog({ children, match, teams, leagues }: MatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!match;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const scheduledDate = formData.get("scheduledDate") as string;
    const scheduledTime = formData.get("scheduledTime") as string;
    const scheduledAt = `${scheduledDate}T${scheduledTime}`;

    const data = {
      leagueId: parseInt(formData.get("leagueId") as string),
      groupId: formData.get("groupId")
        ? parseInt(formData.get("groupId") as string)
        : null,
      homeTeamId: parseInt(formData.get("homeTeamId") as string),
      awayTeamId: parseInt(formData.get("awayTeamId") as string),
      scheduledAt,
      venue: formData.get("venue") as string || undefined,
      matchday: formData.get("matchday")
        ? parseInt(formData.get("matchday") as string)
        : undefined,
      status: formData.get("status") as "scheduled" | "live" | "halftime" | "completed" | "postponed" | "cancelled",
      homeScore: formData.get("homeScore")
        ? parseInt(formData.get("homeScore") as string)
        : null,
      awayScore: formData.get("awayScore")
        ? parseInt(formData.get("awayScore") as string)
        : null,
      homeHalfTimeScore: formData.get("homeHalfTimeScore")
        ? parseInt(formData.get("homeHalfTimeScore") as string)
        : null,
      awayHalfTimeScore: formData.get("awayHalfTimeScore")
        ? parseInt(formData.get("awayHalfTimeScore") as string)
        : null,
      attendance: formData.get("attendance")
        ? parseInt(formData.get("attendance") as string)
        : null,
      notes: formData.get("notes") as string || undefined,
    };

    const result = isEditing
      ? await updateMatch(match.id, data)
      : await createMatch(data);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete() {
    if (!match) return;

    if (!confirm(`Are you sure you want to delete this match?`)) {
      return;
    }

    setLoading(true);
    const result = await deleteMatch(match.id);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  const scheduledDateTime = match?.scheduledAt ? new Date(match.scheduledAt) : null;
  const defaultDate = scheduledDateTime?.toISOString().split('T')[0] || '';
  const defaultTime = scheduledDateTime?.toTimeString().slice(0, 5) || '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {isEditing ? "Edit Match" : "Schedule New Match"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update match details and score" : "Create a new match fixture"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="leagueId">League *</Label>
                <Select
                  id="leagueId"
                  name="leagueId"
                  defaultValue={match?.leagueId?.toString()}
                  required
                >
                  <option value="">Select league...</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name} ({league.season})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="matchday">Matchday</Label>
                <Input
                  id="matchday"
                  name="matchday"
                  type="number"
                  min="1"
                  placeholder="1"
                  defaultValue={match?.matchday || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="homeTeamId">Home Team *</Label>
                <Select
                  id="homeTeamId"
                  name="homeTeamId"
                  defaultValue={match?.homeTeamId?.toString()}
                  required
                >
                  <option value="">Select team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="awayTeamId">Away Team *</Label>
                <Select
                  id="awayTeamId"
                  name="awayTeamId"
                  defaultValue={match?.awayTeamId?.toString()}
                  required
                >
                  <option value="">Select team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="scheduledDate">Match Date *</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  defaultValue={defaultDate}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="scheduledTime">Time *</Label>
                <Input
                  id="scheduledTime"
                  name="scheduledTime"
                  type="time"
                  defaultValue={defaultTime}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  placeholder="Stadium name"
                  defaultValue={match?.venue || ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={match?.status || "scheduled"}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="halftime">Half Time</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Score</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="homeScore">Home</Label>
                      <Input
                        id="homeScore"
                        name="homeScore"
                        type="number"
                        min="0"
                        placeholder="0"
                        defaultValue={match?.homeScore ?? ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="homeHalfTimeScore">HT</Label>
                      <Input
                        id="homeHalfTimeScore"
                        name="homeHalfTimeScore"
                        type="number"
                        min="0"
                        placeholder="0"
                        defaultValue={match?.homeHalfTimeScore ?? ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="awayScore">Away</Label>
                      <Input
                        id="awayScore"
                        name="awayScore"
                        type="number"
                        min="0"
                        placeholder="0"
                        defaultValue={match?.awayScore ?? ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="awayHalfTimeScore">HT</Label>
                      <Input
                        id="awayHalfTimeScore"
                        name="awayHalfTimeScore"
                        type="number"
                        min="0"
                        placeholder="0"
                        defaultValue={match?.awayHalfTimeScore ?? ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attendance">Attendance</Label>
              <Input
                id="attendance"
                name="attendance"
                type="number"
                min="0"
                placeholder="45000"
                defaultValue={match?.attendance || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Additional match notes"
                defaultValue={match?.notes || ""}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Match" : "Schedule Match"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
