"use client";

import { createLink } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createLink(formData);
      if (result?.slug) {
        const shortUrl = `${window.location.origin}/${result.slug}`;
        await navigator.clipboard.writeText(shortUrl);
        toast.success("Short URL copied to clipboard!");
      } else {
        toast.success("Link created successfully!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to create link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-700 hover:bg-indigo-600 cursor-pointer text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Custom Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. ascot-nextdoor"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be go.htrcare.com/slug
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Destination URL (with UTMs)</Label>
            <Input
              id="originalUrl"
              name="originalUrl"
              placeholder="https://htrcare.com/..."
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
