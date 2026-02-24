"use server";

import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
  const [linksCount] = await db.select({ value: count() }).from(links);
  const [clicksCount] = await db.select({ value: count() }).from(clicks);

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

  return {
    totalLinks: linksCount.value,
    totalClicks: clicksCount.value,
    topCampaign: campaigns[0]?.campaign || "None",
  };
}

export async function getRecentActivity(limit = 5) {
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

export async function getCampaignDistribution(limit = 5) {
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
    .limit(limit);

  return distribution.map((d) => ({
    name: d.name || "Unknown",
    total: Number(d.total),
  }));
}
