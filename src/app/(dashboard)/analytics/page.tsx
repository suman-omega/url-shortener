export const dynamic = "force-dynamic";

import { AnalyticsFilter } from "@/components/AnalyticsFilter";
import { ExportCSVButton } from "@/components/ExportCSVButton";
import { AnalyticsPagination } from "@/components/analytics/AnalyticsPagination";
import { BreakdownCard } from "@/components/analytics/BreakdownCard";
import { ClicksTable } from "@/components/analytics/ClicksTable";
import {
  getAnalyticsBreakdowns,
  getAnalyticsData,
} from "@/lib/services/analytics";

export default async function AnalyticsPage(props: {
  searchParams: Promise<{
    page?: string;
    device?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;

  const filters = {
    device: searchParams.device,
    country: searchParams.country,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  };

  const { clicks, totalClicks, totalPages } = await getAnalyticsData(
    filters,
    currentPage,
  );
  const breakdowns = await getAnalyticsBreakdowns(filters);

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
          data={clicks.map((c) => ({
            ...c,
            timestamp: c.timestamp.toISOString(),
          }))}
          filename="campaign_analytics.csv"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        <BreakdownCard title="By Source" items={breakdowns.sources} />
        <BreakdownCard title="By Medium" items={breakdowns.mediums} />
        <BreakdownCard title="By Campaign" items={breakdowns.campaigns} />
        <BreakdownCard title="By Content" items={breakdowns.contents} />
        <BreakdownCard title="By Term" items={breakdowns.terms} />
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200">
            Recent Clicks (Showing {clicks.length} of {totalClicks})
          </h2>
          <AnalyticsFilter />
        </div>

        <ClicksTable clicks={clicks} />

        <AnalyticsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/analytics"
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}
