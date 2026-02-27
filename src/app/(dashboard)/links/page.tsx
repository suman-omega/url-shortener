export const dynamic = "force-dynamic";

import { AnalyticsPagination } from "@/components/analytics/AnalyticsPagination";
import { CopyLinkButton } from "@/components/CopyLinkButton";
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
import { getAllLinksWithStats, getLinksTotalCount } from "@/lib/services/links";
import { ExternalLink } from "lucide-react";

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const limit = 10;

  const [links, totalCount] = await Promise.all([
    getAllLinksWithStats(currentPage, limit),
    getLinksTotalCount(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

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
            {links.length === 0 ? (
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
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 group">
                      <span className="text-indigo-600">/{link.slug}</span>
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
                    {link.clickCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CopyLinkButton slug={link.slug} />
                      <DeleteLinkButton id={link.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <AnalyticsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/links"
          searchParams={{ page: currentPage.toString() }}
        />
      </div>
    </div>
  );
}
