"use server";

import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
  const [linksCount] = await db.select({ value: count() }).from(links);
  const [clicksCount] = await db.select({ value: count() }).from(clicks);

  const [campaigns] = await db
    .select({
      campaign: links.utmCampaign,
      count: count(clicks.id),
    })
    .from(links)
    .leftJoin(clicks, eq(links.id, clicks.linkId))
    .groupBy(links.utmCampaign)
    .orderBy(sql`count desc`)
    .limit(1);

  return {
    totalLinks: linksCount.value,
    totalClicks: clicksCount.value,
    topCampaign: campaigns?.campaign || "None",
  };
}

export async function getRecentActivity(limit = 9) {
  return await db
    .select({
      id: clicks.id,
      slug: links.slug,
      timestamp: clicks.timestamp,
      ip: clicks.ipAddress,
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .orderBy(desc(clicks.timestamp))
    .limit(limit);
}

export async function getAnalyticsDistribution(
  dimension:
    | "utmSource"
    | "utmMedium"
    | "utmCampaign"
    | "utmContent"
    | "utmTerm",
  limit = 5,
) {
  const distribution = await db
    .select({
      name: links[dimension],
      total: count(clicks.id),
    })
    .from(links)
    .leftJoin(clicks, eq(links.id, clicks.linkId))
    .where(sql`${links[dimension]} IS NOT NULL`)
    .groupBy(links[dimension])
    // .orderBy(desc(count(clicks.id)))
    .limit(limit);

  return distribution.map((d) => ({
    label: d.name || "Unknown",
    count: Number(d.total),
  }));
}
