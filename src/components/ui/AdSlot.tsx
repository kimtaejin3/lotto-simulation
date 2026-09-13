"use client";
import { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT, ADSENSE_SLOTS, type AdSlotId } from "@/lib/flags";
import { track } from "@/lib/analytics";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSense unit. Renders nothing unless NEXT_PUBLIC_ADS_ENABLED=true.
 * Only placed between real content sections (landing, guide) per AdSense policy.
 */
export function AdSlot({ id, className = "" }: { id: AdSlotId; className?: string }) {
  const slot = ADSENSE_SLOTS[id];
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      track("ad_impression", { slot: id });
    } catch {
      /* ad blockers */
    }
  }, [slot, id]);

  if (!ADS_ENABLED) return null;

  if (!slot) {
    return (
      <div
        data-ad-slot={id}
        className={`mx-auto flex h-24 w-full max-w-[728px] items-center justify-center rounded-2xl border border-dashed border-line text-xs text-muted ${className}`}
        aria-label="광고"
      >
        광고 영역
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-[728px] ${className}`} aria-label="광고">
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
