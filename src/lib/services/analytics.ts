"use server";

import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";

export interface AnalyticsFilters {
  device?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

function buildWhereClause(filters: AnalyticsFilters) {
  const conditions = [];

  if (filters.device) {
    conditions.push(eq(clicks.deviceType, filters.device));
  }

  if (filters.country) {
    conditions.push(eq(clicks.country, filters.country));
  }

  if (filters.startDate) {
    conditions.push(gte(clicks.timestamp, new Date(filters.startDate)));
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    conditions.push(lte(clicks.timestamp, end));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getAnalyticsData(
  filters: AnalyticsFilters,
  page: number = 1,
  limit: number = 100,
) {
  const whereClause = buildWhereClause(filters);
  const offset = (page - 1) * limit;

  // Fetch total count
  const [totalCountResult] = await db
    .select({ value: count() })
    .from(clicks)
    .where(whereClause);

  const totalClicks = totalCountResult?.value || 0;
  const totalPages = Math.ceil(totalClicks / limit);

  // Fetch clicks
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
    .where(whereClause)
    .orderBy(desc(clicks.timestamp))
    .limit(limit)
    .offset(offset);

  return {
    clicks: allClicks,
    totalClicks,
    totalPages,
    currentPage: page,
  };
}

export async function getAnalyticsBreakdowns(filters: AnalyticsFilters) {
  const whereClause = buildWhereClause(filters);

  const sourceBreakdown = await db
    .select({
      source: links.utmSource,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .where(whereClause)
    .groupBy(links.utmSource)
    .orderBy(sql`count desc`);

  const campaignBreakdown = await db
    .select({
      campaign: links.utmCampaign,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .where(whereClause)
    .groupBy(links.utmCampaign)
    .orderBy(sql`count desc`);

  const mediumBreakdown = await db
    .select({
      medium: links.utmMedium,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .where(whereClause)
    .groupBy(links.utmMedium)
    .orderBy(sql`count desc`);

  const contentBreakdown = await db
    .select({
      content: links.utmContent,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .where(whereClause)
    .groupBy(links.utmContent)
    .orderBy(sql`count desc`);

  const termBreakdown = await db
    .select({
      term: links.utmTerm,
      count: count(clicks.id),
    })
    .from(clicks)
    .leftJoin(links, eq(clicks.linkId, links.id))
    .where(whereClause)
    .groupBy(links.utmTerm)
    .orderBy(sql`count desc`);

  // const clicksWithSlugs = await db
  //   .select({
  //     slug: links.slug,
  //     count: count(clicks.id),
  //   })
  //   .from(clicks)
  //   .leftJoin(links, eq(clicks.linkId, links.id))
  //   .where(whereClause)
  //   .groupBy(links.slug);

  // const postcodeStats = clicksWithSlugs.reduce(
  //   (acc, curr) => {
  //     const slug = curr.slug || "";
  //     const match = slug.match(/^(sl[4-5]|ascot|windsor)/i);
  //     const zone = match ? match[0].toUpperCase() : "Other";
  //     acc[zone] = (acc[zone] || 0) + Number(curr.count);
  //     return acc;
  //   },
  //   {} as Record<string, number>,
  // );

  return {
    sources: sourceBreakdown.map((s) => ({
      label: s.source || "Direct",
      count: s.count,
    })),
    campaigns: campaignBreakdown.map((c) => ({
      label: c.campaign || "None",
      count: c.count,
    })),
    mediums: mediumBreakdown.map((m) => ({
      label: m.medium || "None",
      count: m.count,
    })),
    contents: contentBreakdown.map((c) => ({
      label: c.content || "None",
      count: c.count,
    })),
    terms: termBreakdown.map((t) => ({
      label: t.term || "None",
      count: t.count,
    })),
  };
}
