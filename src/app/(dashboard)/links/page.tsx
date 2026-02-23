export const dynamic = "force-dynamic";

import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { DeleteLinkButton } from "@/components/DeleteLinkButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";

export default async function LinksPage() {
  const allLinks = await db.query.links.findMany({
    orderBy: [desc(links.createdAt)],
  });

  // Fetch click counts for each link
  const linkStats = await Promise.all(
    allLinks.map(async (link) => {
      const stats = await db
        .select({ value: count() })
        .from(clicks)
        .where(eq(clicks.linkId, link.id));
      return { id: link.id, clickCount: stats[0].value };
    }),
  );

  const statsMap = new Map(linkStats.map((s) => [s.id, s.clickCount]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Links</h1>
          <p className="text-muted-foreground mt-1">
            Create, track, and manage your branded short links.
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableHead className="w-[200px]">Slug</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLinks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-48 text-center text-muted-foreground italic"
                >
                  No links created yet. Click &quot;Create New Link&quot; to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              allLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 group">
                      <span className="text-indigo-600">/{link.slug}</span>
                      {/* Copy button would be client side, keeping it simple for now */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[300px] truncate group">
                      <span className="truncate">{link.originalUrl}</span>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {link.utmSource || "Direct"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold">
                    {statsMap.get(link.id) || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DeleteLinkButton id={link.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
