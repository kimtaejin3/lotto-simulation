export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
/** AdSense publisher id. The loader script is always injected (site verification); ad units render only when ADS_ENABLED. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-4525261509519201";
/**
 * Ads only appear on content pages (landing, guide). App screens (setup, simulate, result)
 * carry no ads: AdSense policy forbids ads on screens without publisher content.
 */
export type AdSlotId = "landing_mid" | "landing_bottom" | "guide_mid" | "guide_bottom";
const CONTENT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT_SETUP;
export const ADSENSE_SLOTS: Record<AdSlotId, string | undefined> = {
  landing_mid: CONTENT_SLOT,
  landing_bottom: CONTENT_SLOT,
  guide_mid: CONTENT_SLOT,
  guide_bottom: CONTENT_SLOT,
};
export const SITE_NAME = "15만년 로또";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
