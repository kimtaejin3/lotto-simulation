export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
/** AdSense publisher id. The loader script is always injected (site verification); ad units render only when ADS_ENABLED. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4525261509519201";
export const ADSENSE_SLOTS: Record<"setup" | "simulate" | "result", string | undefined> = {
  setup: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SETUP,
  simulate: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIMULATE,
  result: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT,
};
export const SITE_NAME = "15만년 로또";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
