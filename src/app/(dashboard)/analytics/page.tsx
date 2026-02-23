export const dynamic = "force-dynamic";

import { ExportCSVButton } from "@/components/ExportCSVButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { count, desc, eq, sql } from "drizzle-orm";

export default async function AnalyticsPage() {
  const allClicks = await db
    .select({
      id: clicks.id,
      slug: links.slug,
      source: links.utmSource,
      campaign: links.utmCampaign,
      timestamp: clicks.timestamp,
      ip: clicks.ipAddress,
      userAgent: clicks.userAgent,
      country: clicks.country,
      device: clicks.deviceType,
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .orderBy(desc(clicks.timestamp))
    .limit(100);

  // Aggregates for breakdown
  const sourceBreakdown = await db
    .select({
      source: links.utmSource,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .groupBy(links.utmSource)
    .orderBy(sql`count desc`);

  const campaignBreakdown = await db
    .select({
      campaign: links.utmCampaign,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .groupBy(links.utmCampaign)
    .orderBy(sql`count desc`);

  // Postcode extraction from slug (e.g. "sl4-private" -> "SL4")
  const clicksWithSlugs = await db
    .select({
      slug: links.slug,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .groupBy(links.slug);

  const postcodeStats = clicksWithSlugs.reduce(
    (acc, curr) => {
      const slug = curr.slug || "";
      const match = slug.match(/^(sl[4-5]|ascot|windsor)/i);
      const zone = match ? match[0].toUpperCase() : "Other";
      acc[zone] = (acc[zone] || 0) + Number(curr.count);
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Campaign Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed performance breakdown by source, campaign, and location.
          </p>
        </div>
        <ExportCSVButton
          data={allClicks.map((c) => ({
            ...c,
            timestamp: c.timestamp.toISOString(),
          }))}
          filename="campaign_analytics.csv"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              By Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceBreakdown.map((s) => (
                <div
                  key={s.source || "Direct"}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm font-medium">
                    {s.source || "Direct"}
                  </span>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card border-none shadow-sm>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              By Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignBreakdown.map((c) => (
                <div
                  key={c.campaign || "None"}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {c.campaign || "None"}
                  </span>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card border-none shadow-sm>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              By Postcode/Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(postcodeStats).map(([zone, count]) => (
                <div key={zone} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{zone}</span>
                  <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200">
            Recent Clicks (Last 100)
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allClicks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No clicks recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              allClicks.map((click) => (
                <TableRow key={click.id}>
                  <TableCell className="font-medium">/{click.slug}</TableCell>
                  <TableCell className="text-slate-500">
                    {click.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>{click.country}</TableCell>
                  <TableCell className="capitalize">{click.device}</TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs">
                    {click.ip}
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
