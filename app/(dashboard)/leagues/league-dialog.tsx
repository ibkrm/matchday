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
import { createLeague, updateLeague, deleteLeague } from "@/lib/actions/leagues";
import type { League } from "@/db/schema";

interface LeagueDialogProps {
  children: React.ReactNode;
  league?: League;
}

export function LeagueDialog({ children, league }: LeagueDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!league;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      season: formData.get("season") as string,
      description: formData.get("description") as string || undefined,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as "draft" | "active" | "completed" | "cancelled",
      logoUrl: formData.get("logoUrl") as string || undefined,
    };

    const result = isEditing
      ? await updateLeague(league.id, data)
      : await createLeague(data);

    setLoading(false);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete() {
    if (!league) return;
    
    if (!confirm(`Are you sure you want to delete "${league.name}"? This will also delete all groups, teams, and matches in this league.`)) {
      return;
    }

    setLoading(true);
    const result = await deleteLeague(league.id);
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
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {isEditing ? "Edit League" : "Create New League"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update league information and settings"
                : "Add a new soccer league or competition"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">League Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Champions League"
                defaultValue={league?.name}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="season">Season *</Label>
                <Input
                  id="season"
                  name="season"
                  placeholder="2024-25"
                  pattern="^\d{4}-\d{2}$"
                  title="Season must be in format YYYY-YY (e.g., 2024-25)"
                  defaultValue={league?.season}
                  required
                />
                <p className="text-xs text-muted-foreground">Format: YYYY-YY (e.g., 2024-25)</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={league?.status || "draft"}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the league"
                defaultValue={league?.description || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={league?.startDate}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={league?.endDate}
                  required
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
                defaultValue={league?.logoUrl || ""}
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
              {loading ? "Saving..." : isEditing ? "Update League" : "Create League"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
