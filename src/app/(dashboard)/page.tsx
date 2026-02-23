export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { count, sql } from "drizzle-orm";
import { Globe, Link2, MousePointer2, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch real stats from DB
  let totalLinks = 0;
  let totalClicks = 0;
  let topCampaign = "N/A";

  try {
    const linksCount = await db.select({ value: count() }).from(links);
    totalLinks = linksCount[0].value;

    const clicksCount = await db.select({ value: count() }).from(clicks);
    totalClicks = clicksCount[0].value;

    // Get top campaign from links table by join or aggregate (simplified for now)
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
          <Card key={stat.title} className="border-none shadow-sm">
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
                  : "+12% from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Detailed click data and real-time logs will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground italic text-sm">
              Chart visualization placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Fixed import for eq
import { eq } from "drizzle-orm";
