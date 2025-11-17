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
import { createTeam, updateTeam, deleteTeam } from "@/lib/actions/teams";
import type { Team } from "@/db/schema";

interface TeamDialogProps {
  children: React.ReactNode;
  team?: Team;
  groups: Array<{
    id: number;
    name: string;
    leagueName: string | null;
    leagueSeason: string | null;
  }>;
}

export function TeamDialog({ children, team, groups }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!team;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      groupId: parseInt(formData.get("groupId") as string),
      name: formData.get("name") as string,
      shortName: formData.get("shortName") as string || undefined,
      logoUrl: formData.get("logoUrl") as string || undefined,
      homeField: formData.get("homeField") as string || undefined,
      coachName: formData.get("coachName") as string || undefined,
      foundedYear: formData.get("foundedYear")
        ? parseInt(formData.get("foundedYear") as string)
        : undefined,
      primaryColor: formData.get("primaryColor") as string || undefined,
      secondaryColor: formData.get("secondaryColor") as string || undefined,
    };

    const result = isEditing
      ? await updateTeam(team.id, data)
      : await createTeam(data);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete() {
    if (!team) return;
    
    if (!confirm(`Are you sure you want to delete "${team.name}"? This will also delete all players in this team.`)) {
      return;
    }

    setLoading(true);
    const result = await deleteTeam(team.id);
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
              {isEditing ? "Edit Team" : "Create New Team"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update team information" : "Add a new team to a league group"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="groupId">Group / League *</Label>
              <Select
                id="groupId"
                name="groupId"
                defaultValue={team?.groupId?.toString()}
                required
              >
                <option value="">Select a group...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.leagueName} - {group.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., FC Barcelona"
                  defaultValue={team?.name}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  name="shortName"
                  placeholder="e.g., BAR"
                  maxLength={10}
                  defaultValue={team?.shortName || ""}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                defaultValue={team?.logoUrl || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coachName">Coach Name</Label>
              <Input
                id="coachName"
                name="coachName"
                placeholder="e.g., Pep Guardiola"
                defaultValue={team?.coachName || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="homeField">Home Stadium</Label>
                <Input
                  id="homeField"
                  name="homeField"
                  placeholder="e.g., Camp Nou"
                  defaultValue={team?.homeField || ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  placeholder="1899"
                  defaultValue={team?.foundedYear || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    className="w-16 h-9 p-1"
                    defaultValue={team?.primaryColor || "#0A5C36"}
                  />
                  <Input
                    type="text"
                    placeholder="#0A5C36"
                    className="flex-1"
                    defaultValue={team?.primaryColor || ""}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    className="w-16 h-9 p-1"
                    defaultValue={team?.secondaryColor || "#FFD700"}
                  />
                  <Input
                    type="text"
                    placeholder="#FFD700"
                    className="flex-1"
                    defaultValue={team?.secondaryColor || ""}
                  />
                </div>
              </div>
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
              {loading ? "Saving..." : isEditing ? "Update Team" : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
