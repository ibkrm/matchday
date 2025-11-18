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
import { createPlayer, updatePlayer, deletePlayer } from "@/lib/actions/players";
import type { Player } from "@/db/schema";

interface PlayerDialogProps {
  children: React.ReactNode;
  player?: Player;
  teams: Array<{
    id: number;
    name: string;
    leagueName: string | null;
    leagueSeason: string | null;
  }>;
}

export function PlayerDialog({ children, player, teams }: PlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!player;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      teamId: parseInt(formData.get("teamId") as string),
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      jerseyNumber: formData.get("jerseyNumber")
        ? parseInt(formData.get("jerseyNumber") as string)
        : undefined,
      position: formData.get("position") as "goalkeeper" | "defender" | "midfielder" | "forward",
      dateOfBirth: formData.get("dateOfBirth") as string || undefined,
      nationality: formData.get("nationality") as string || undefined,
      photoUrl: formData.get("photoUrl") as string || undefined,
      height: formData.get("height") ? parseInt(formData.get("height") as string) : undefined,
      weight: formData.get("weight") ? parseInt(formData.get("weight") as string) : undefined,
      preferredFoot: (formData.get("preferredFoot") as "left" | "right" | "both") || undefined,
      status: formData.get("status") as "active" | "injured" | "suspended" | "inactive",
    };

    const result = isEditing
      ? await updatePlayer(player.id, data)
      : await createPlayer(data);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete() {
    if (!player) return;

    if (!confirm(`Are you sure you want to delete ${player.firstName} ${player.lastName}?`)) {
      return;
    }

    setLoading(true);
    const result = await deletePlayer(player.id);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {isEditing ? "Edit Player" : "Add New Player"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update player information" : "Add a new player to a team"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teamId">Team *</Label>
              <Select
                id="teamId"
                name="teamId"
                defaultValue={player?.teamId?.toString()}
                required
              >
                <option value="">Select a team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} {team.leagueName && `(${team.leagueName})`}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Lionel"
                  defaultValue={player?.firstName}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Messi"
                  defaultValue={player?.lastName}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position *</Label>
                <Select
                  id="position"
                  name="position"
                  defaultValue={player?.position || "forward"}
                  required
                >
                  <option value="goalkeeper">🥅 Goalkeeper</option>
                  <option value="defender">🛡️ Defender</option>
                  <option value="midfielder">⚙️ Midfielder</option>
                  <option value="forward">⚡ Forward</option>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="jerseyNumber">Jersey Number</Label>
                <Input
                  id="jerseyNumber"
                  name="jerseyNumber"
                  type="number"
                  min="0"
                  max="99"
                  placeholder="10"
                  defaultValue={player?.jerseyNumber || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={player?.dateOfBirth || ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  placeholder="Argentina"
                  defaultValue={player?.nationality || ""}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                defaultValue={player?.photoUrl || ""}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="170"
                  defaultValue={player?.height || ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="30"
                  max="150"
                  placeholder="72"
                  defaultValue={player?.weight || ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferredFoot">Preferred Foot</Label>
                <Select
                  id="preferredFoot"
                  name="preferredFoot"
                  defaultValue={player?.preferredFoot || ""}
                >
                  <option value="">-</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                defaultValue={player?.status || "active"}
              >
                <option value="active">Active</option>
                <option value="injured">Injured</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </Select>
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
              {loading ? "Saving..." : isEditing ? "Update Player" : "Add Player"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
