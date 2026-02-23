import { db } from "@/db";
import { clicks, links } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // 1. Look up the slug in the database
  const link = await db.query.links.findFirst({
    where: eq(links.slug, slug),
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // 2. Extract metadata for logging
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";
  const referrer = headerList.get("referer") || "direct";
  const ip = headerList.get("x-forwarded-for") || "unknown";

  // Basic device type detection
  let deviceType = "desktop";
  if (/mobile/i.test(userAgent)) deviceType = "mobile";
  if (/tablet/i.test(userAgent)) deviceType = "tablet";

  // 3. Log the click asynchronously (fire and forget in background)
  // Note: Vercel/Next.js might terminate if we don't await,
  // but for production-grade we should use something like a queue or await but not block the redirect.
  // In Next.js App Router route handlers, it's safer to await if we want to ensure it's saved.
  try {
    await db.insert(clicks).values({
      linkId: link.id,
      ipAddress: ip,
      userAgent: userAgent,
      referrer: referrer,
      deviceType: deviceType,
      // For country, we might use header 'x-vercel-ip-country' if on Vercel
      country: headerList.get("x-vercel-ip-country") || "unknown",
    });
  } catch (error) {
    console.error("Failed to log click:", error);
  }

  // 4. Perform 302 redirect
  const response = NextResponse.redirect(link.originalUrl, {
    status: 302,
  });

  // 5. Add SEO headers
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}
