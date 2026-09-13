"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { setAnalyticsSink } from "@/lib/analytics";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Vercel injects the UI host (us.posthog.com); ingestion should go to the *.i.posthog.com endpoint.
const RAW_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const HOST = RAW_HOST.replace(/^https:\/\/(us|eu)\.posthog\.com$/, "https://$1.i.posthog.com");
const UI_HOST = RAW_HOST.replace(/^https:\/\/(us|eu)\.i\.posthog\.com$/, "https://$1.posthog.com");

let initialized = false;

/**
 * Product analytics. Autocaptures every click/tap with element text, records
 * sessions, and tracks page views on client-side navigation. Custom events
 * from `track()` (lib/analytics.ts) land in the same project.
 */
export function PostHogProvider() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!KEY || initialized) return;
    initialized = true;
    posthog.init(KEY, {
      api_host: HOST,
      ui_host: UI_HOST,
      autocapture: true,
      capture_pageview: false, // handled below so SPA navigation counts
      capture_pageleave: true,
      session_recording: { maskAllInputs: false, maskTextSelector: "[data-ph-mask]" },
      person_profiles: "identified_only",
      persistence: "localStorage+cookie",
    });
    window.posthog = posthog;
    setAnalyticsSink(posthog);
  }, []);

  useEffect(() => {
    if (!KEY || !initialized) return;
    const qs = search?.toString();
    posthog.capture("$pageview", { $current_url: window.location.origin + pathname + (qs ? `?${qs}` : "") });
  }, [pathname, search]);

  return null;
}
