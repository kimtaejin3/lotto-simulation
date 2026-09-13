import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/flags";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/setup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
