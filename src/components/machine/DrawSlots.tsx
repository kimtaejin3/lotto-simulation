"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Ball } from "@/components/ui/Ball";

interface Props {
  numbers: number[] | null;
  bonus: number | null;
  drawKey: number;
  size?: number;
  /** Per-ball drop-in animation. Only sensible at 1x; at higher speeds the tray just refreshes. */
  animated?: boolean;
}

const FAST_REFRESH_MS = 220;

/** The six winning balls (+ bonus) sitting in their tray under the drum. */
export function DrawSlots({ numbers, bonus, drawKey, size = 40, animated = true }: Props) {
  const reduce = useReducedMotion();
  const anim = animated && !reduce;

  // At high speed, refresh the tray on a fixed cadence so it reads as "flipping" instead of flickering.
  const [throttled, setThrottled] = useState<{ numbers: number[] | null; bonus: number | null }>({ numbers, bonus });
  const latest = useRef({ numbers, bonus });
  useEffect(() => {
    latest.current = { numbers, bonus };
  }, [numbers, bonus]);
  useEffect(() => {
    if (anim) return;
    const id = setInterval(() => setThrottled((prev) => (prev.numbers === latest.current.numbers ? prev : latest.current)), FAST_REFRESH_MS);
    return () => clearInterval(id);
  }, [anim]);

  const shown = anim ? { numbers, bonus } : throttled;
  const slots = shown.numbers ?? [null, null, null, null, null, null];
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2" aria-live="off">
      {slots.map((n, i) => (
        <div key={i} className="relative rounded-full bg-accent-tint" style={{ width: size, height: size }}>
          {anim ? (
            <AnimatePresence mode="popLayout" initial={false}>
              {n !== null && (
                <motion.div
                  key={`${drawKey}-${n}`}
                  initial={{ y: -size * 0.8, scale: 0.7, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.07 }}
                  className="absolute inset-0"
                >
                  <Ball n={n} size={size} />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            n !== null && (
              <div className="absolute inset-0">
                <Ball n={n} size={size} />
              </div>
            )
          )}
        </div>
      ))}
      <span className="mx-0.5 font-display text-muted">+</span>
      <div className="relative rounded-full bg-accent-tint" style={{ width: size, height: size }}>
        {anim ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.bonus !== null && (
              <motion.div
                key={`${drawKey}-b${shown.bonus}`}
                initial={{ y: -size * 0.8, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.5 }}
                className="absolute inset-0"
              >
                <Ball n={shown.bonus} size={size} bonus />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          shown.bonus !== null && (
            <div className="absolute inset-0">
              <Ball n={shown.bonus} size={size} bonus />
            </div>
          )
        )}
      </div>
    </div>
  );
}
