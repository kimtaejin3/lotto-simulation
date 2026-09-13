import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/flags";
import { SEO } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff4f1",
    theme_color: "#ee3d62",
    lang: "ko",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
