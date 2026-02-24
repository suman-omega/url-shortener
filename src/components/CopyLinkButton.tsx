"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyLinkButton({ slug }: { slug: string }) {
  const handleCopy = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Short URL copied to clipboard!");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-slate-400 hover:text-indigo-600 transition-colors"
      onClick={handleCopy}
      title="Copy short URL"
    >
      <Copy className="w-4 h-4" />
    </Button>
  );
}
