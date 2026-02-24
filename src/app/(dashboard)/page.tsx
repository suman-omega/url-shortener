export const dynamic = "force-dynamic";

import { CampaignChart } from "@/components/CampaignChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { formatDistanceToNow } from "date-fns";
import { count, desc, eq, sql } from "drizzle-orm";
import { Clock, Globe, Link2, MousePointer2, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch real stats from DB
  let totalLinks = 0;
  let totalClicks = 0;
  let topCampaign = "N/A";
  let recentClicks: {
    id: string;
    slug: string | null;
    timestamp: Date;
    ip: string | null;
  }[] = [];
  let campaignDistribution: { name: string; total: number }[] = [];

  try {
    const linksCount = await db.select({ value: count() }).from(links);
    totalLinks = linksCount[0].value;

    const clicksCount = await db.select({ value: count() }).from(clicks);
    totalClicks = clicksCount[0].value;

    // Get top campaign from links table by aggregate
    const campaigns = await db
      .select({
        campaign: links.utmCampaign,
        count: count(clicks.id),
      })
      .from(links)
      .leftJoin(clicks, eq(links.id, clicks.linkId))
      .groupBy(links.utmCampaign)
      .orderBy(sql`count desc`)
      .limit(1);

    topCampaign = campaigns[0]?.campaign || "None";

    // Fetch recent activity
    recentClicks = await db
      .select({
        id: clicks.id,
        slug: links.slug,
        timestamp: clicks.timestamp,
        ip: clicks.ipAddress,
      })
      .from(clicks)
      .leftJoin(links, eq(clicks.linkId, links.id))
      .orderBy(desc(clicks.timestamp))
      .limit(5);

    // Fetch campaign distribution
    const distribution = await db
      .select({
        name: links.utmCampaign,
        total: count(clicks.id),
      })
      .from(links)
      .leftJoin(clicks, eq(links.id, clicks.linkId))
      .where(sql`${links.utmCampaign} IS NOT NULL`)
      .groupBy(links.utmCampaign)
      .orderBy(desc(count(clicks.id)))
      .limit(5);

    campaignDistribution = distribution.map((d) => ({
      name: d.name || "Unknown",
      total: Number(d.total),
    }));
  } catch (e) {
    console.error("Dashboard stats fetch failed:", e);
  }

  const stats = [
    {
      title: "Total Links",
      value: totalLinks.toLocaleString(),
      icon: Link2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointer2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Top Campaign",
      value: topCampaign,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Top Source",
      value: "Nextdoor",
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your campaign performance and track link activity in
          real-time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-sm transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.title === "Top Source"
                  ? "Main lead generator"
                  : "Updated just now"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentClicks.length > 0 ? (
                recentClicks.map((click) => (
                  <div
                    key={click.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                        /{click.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        IP: {click.ip?.substring(0, 7)}... •{" "}
                        {click.timestamp
                          ? formatDistanceToNow(new Date(click.timestamp), {
                              addSuffix: true,
                            })
                          : "unknown"}
                      </p>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      CLICK
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No recent activity found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <CampaignChart data={campaignDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
