"use server";

import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { extractUTM } from "@/lib/url-utils";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllLinksWithStats(
  page: number = 1,
  limit: number = 10,
) {
  const offset = (page - 1) * limit;

  const allLinks = await db.query.links.findMany({
    orderBy: [desc(links.createdAt)],
    limit,
    offset,
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

export async function getLinksTotalCount() {
  const [result] = await db.select({ value: count() }).from(links);
  return result?.value ?? 0;
}

export async function createLink(formData: FormData) {
  const slug = formData.get("slug") as string;
  const originalUrl = formData.get("originalUrl") as string;

  if (!slug || !originalUrl) {
    throw new Error("Slug and Original URL are required");
  }

  const { validateUrl } = await import("@/lib/url-utils");
  if (!validateUrl(originalUrl)) {
    throw new Error(
      "Invalid destination URL. Must be an approved htrcare.com domain.",
    );
  }

  const utmData = extractUTM(originalUrl);

  await db.insert(links).values({
    slug,
    originalUrl,
    ...utmData,
  });

  revalidatePath("/links");
  return { slug };
}

export async function deleteLink(id: string) {
  await db.delete(links).where(eq(links.id, id));
  revalidatePath("/links");
}
