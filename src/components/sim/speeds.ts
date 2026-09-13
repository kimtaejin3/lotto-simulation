import type { SpeedSetting } from "@/workers/sim.worker";
import type { Rank } from "@/lib/lotto/constants";

export type SpeedKey = "1x" | "100x" | "10000x";

/** notifyRank: wins at or above this rank pop a receipt toast. Rarer ranks only at higher speeds. */
export const SPEEDS: { key: SpeedKey; label: string; wps: SpeedSetting; agitation: number; notifyRank: Rank }[] = [
  { key: "1x", label: "1x", wps: 0.5, agitation: 1.3, notifyRank: 5 }, // one draw every 2 seconds, full ball animation
  { key: "100x", label: "100x", wps: 50, agitation: 1.6, notifyRank: 4 },
  { key: "10000x", label: "1만x", wps: 5000, agitation: 3, notifyRank: 3 }, // top speed: ~25 min to 150k years at 5 games/week
];

export const speedByKey = (k: SpeedKey) => SPEEDS.find((s) => s.key === k)!;
