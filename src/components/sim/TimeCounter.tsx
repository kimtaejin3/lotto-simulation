"use client";
import { useEffect, useRef, useState } from "react";
import { splitElapsed } from "@/lib/lotto/time";

interface Props {
  weeks: number; // target
  intense?: boolean;
}

/**
 * The hero number. Smoothly chases the worker's latest week count so the
 * digits visibly "spin" instead of jumping in batches.
 */
export function TimeCounter({ weeks, intense }: Props) {
  const target = useRef(weeks);
  const shown = useRef(weeks);
  const [display, setDisplay] = useState(weeks);
  useEffect(() => {
    target.current = weeks;
  }, [weeks]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = target.current;
      const s = shown.current;
      if (s !== t) {
        const diff = t - s;
        // exponential chase; snap when close or when target jumped backwards (reset)
        const next = diff < 0 || Math.abs(diff) < 1 ? t : s + diff * Math.min(1, dt * 9);
        shown.current = next;
        setDisplay(Math.floor(next));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { value, unit, sub } = splitElapsed(display);
  const long = value.length > 6;
  return (
    <div className="text-center" aria-live="off">
      <div className="text-sm text-muted">흘러간 시간</div>
      <div
        className={`font-display tabular leading-none tracking-tight text-ink transition-transform ${
          long ? "text-[52px] sm:text-[84px]" : "text-[64px] sm:text-[96px]"
        } ${intense ? "animate-[pulse_0.6s_ease-in-out_infinite]" : ""}`}
        aria-label={`${value}${unit}${sub ? " " + sub : ""}`}
      >
        {value}
        <span className="ml-1 text-[0.45em] text-accent">{unit}</span>
        {sub ? (
          <span className="ml-2 text-[0.3em] text-muted">{sub}</span>
        ) : null}
      </div>
    </div>
  );
}
