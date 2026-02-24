"use server";

import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function getAllLinksWithStats() {
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

  return allLinks.map((link) => ({
    ...link,
    clickCount: statsMap.get(link.id) || 0,
  }));
}
