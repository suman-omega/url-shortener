export const dynamic = "force-dynamic";

import { CampaignChart } from "@/components/CampaignChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCampaignDistribution,
  getDashboardStats,
  getRecentActivity,
} from "@/lib/services/dashboard";
import { formatDistanceToNow } from "date-fns";
import { Clock, Globe, Link2, MousePointer2, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const { totalLinks, totalClicks, topCampaign } = await getDashboardStats();
  const recentClicks = await getRecentActivity();
  const campaignDistribution = await getCampaignDistribution();

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
      value: "Nextdoor", // This could also be dynamic if needed
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Main lead generator",
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
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
            description={stat.description || "Updated just now"}
          />
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
