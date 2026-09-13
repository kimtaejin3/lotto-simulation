"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { RankCounts } from "@/lib/lotto/engine";
import { fmtInt } from "@/lib/lotto/time";

const RANKS: { rank: 2 | 3 | 4 | 5; label: string; cond: string; ink: string }[] = [
  { rank: 2, label: "2등", cond: "5개+보너스", ink: "#d92a52" },
  { rank: 3, label: "3등", cond: "5개", ink: "#e5602f" },
  { rank: 4, label: "4등", cond: "4개", ink: "#3f8fc9" },
  { rank: 5, label: "5등", cond: "3개", ink: "#5f9a3c" },
];

/** Rubber-stamp style tally of wins so far. Each stamp "thumps" when its count grows. */
export function WinStamps({ counts }: { counts: RankCounts }) {
  return (
    <div className="grid w-full max-w-md grid-cols-4 gap-2" aria-label="지금까지 당첨 현황">
      {RANKS.map((r) => (
        <Stamp key={r.rank} label={r.label} cond={r.cond} ink={r.ink} count={counts[r.rank]} />
      ))}
    </div>
  );
}

function Stamp({ label, cond, ink, count }: { label: string; cond: string; ink: string; count: number }) {
  const reduce = useReducedMotion();
  const prev = useRef(count);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (count > prev.current) setBump((b) => b + 1);
    prev.current = count;
  }, [count]);
  const active = count > 0;
  return (
    <motion.div
      key={bump}
      initial={reduce || bump === 0 ? false : { scale: 1.18, rotate: -4 }}
      animate={{ scale: 1, rotate: active ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
      className="relative flex flex-col items-center rounded-xl border-2 border-dashed px-1 py-1.5 text-center"
      style={{
        borderColor: active ? ink : "var(--line)",
        color: active ? ink : "var(--muted)",
        background: active ? `color-mix(in srgb, ${ink} 8%, transparent)` : "transparent",
        opacity: active ? 1 : 0.6,
      }}
      aria-label={`${label} ${count}회`}
    >
      <span className="font-display text-sm leading-none">{label}</span>
      <span className="font-display tabular mt-1 text-xl leading-none">{fmtInt(count)}</span>
      <span className="mt-0.5 text-[9px] leading-none opacity-70">{cond}</span>
    </motion.div>
  );
}
