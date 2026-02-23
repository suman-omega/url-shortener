"use server";

import { db } from "@/db";
import { links } from "@/db/schema";
import { extractUTM } from "@/lib/url-utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
}

export async function deleteLink(id: string) {
  await db.delete(links).where(eq(links.id, id));
  revalidatePath("/links");
}
