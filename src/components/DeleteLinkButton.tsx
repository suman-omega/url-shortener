"use client";

import { Button } from "@/components/ui/button";
import { deleteLink } from "@/lib/services/links";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteLinkButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this link?")) return;

    setLoading(true);
    try {
      await deleteLink(id);
      toast.success("Link deleted successfully.");
    } catch {
      toast.error("Failed to delete link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-slate-400 hover:text-red-600 transition-colors"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
