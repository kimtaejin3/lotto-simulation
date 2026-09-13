"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function LandingTracker() {
  useEffect(() => {
    track("landing_view");
  }, []);
  return null;
}
