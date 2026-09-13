"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WinEvent } from "@/lib/lotto/engine";
import { matchedNumbers } from "@/lib/lotto/engine";
import { Ball } from "@/components/ui/Ball";
import { gameLabel } from "@/components/ticket/TicketGame";
import { formatElapsedPrecise } from "@/lib/lotto/time";
import { sfx } from "@/lib/sound";

const RANK_INK: Record<number, string> = { 1: "#d92a52", 2: "#d92a52", 3: "#e5602f", 4: "#3f8fc9", 5: "#5f9a3c" };
const RANK_COND: Record<number, string> = { 1: "6개 일치", 2: "5개 + 보너스", 3: "5개 일치", 4: "4개 일치", 5: "3개 일치" };

interface Props {
  incoming: WinEvent[];
  onConsumed: () => void;
  tickets: number[][];
}

/**
 * A little receipt that slides in when one of the player's games wins.
 * Shows which of their numbers matched. One at a time; backlog is capped so
 * fast speeds never flood the screen.
 */
export function WinToast({ incoming, onConsumed, tickets }: Props) {
  const queue = useRef<WinEvent[]>([]);
  const [current, setCurrent] = useState<WinEvent | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (incoming.length === 0) return;
    // keep the rarest few if flooded
    const merged = [...queue.current, ...incoming].sort((a, b) => a.rank - b.rank || b.week - a.week);
    queue.current = merged.slice(0, 3);
    onConsumed();
  }, [incoming, onConsumed]);

  useEffect(() => {
    if (current) return;
    const id = setInterval(() => {
      const next = queue.current.shift();
      if (next) {
        setCurrent(next);
        sfx.pop(6 - next.rank);
        clearInterval(id);
      }
    }, 120);
    return () => clearInterval(id);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), current.rank <= 3 ? 3200 : 2200);
    return () => clearTimeout(t);
  }, [current]);

  const ticket = current ? tickets[current.ticket] : undefined;
  const match = current && ticket ? matchedNumbers(ticket, { numbers: current.numbers, bonus: current.bonus }) : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0" aria-live="polite">
      <AnimatePresence>
        {current && ticket && match && (
          <motion.div
            key={`${current.week}-${current.ticket}`}
            style={{ x: "-50%" }}
            initial={reduce ? { opacity: 0 } : { y: -28, opacity: 0, rotate: -4, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, rotate: -1.5, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="paper paper-perforated absolute left-1/2 top-0 flex w-max max-w-[95vw] items-center gap-3 rounded-[6px] px-3.5 py-2.5 text-[#2b2330] shadow-xl"
          >
            <div
              className="flex h-12 w-12 shrink-0 -rotate-6 items-center justify-center rounded-full border-[3px] font-display text-base leading-none"
              style={{ borderColor: RANK_INK[current.rank], color: RANK_INK[current.rank] }}
            >
              {current.rank}등
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2 leading-none">
                <span className="font-display text-lg" style={{ color: RANK_INK[current.rank] }}>
                  {gameLabel(current.ticket)}게임 당첨!
                </span>
                <span className="text-[11px] text-[#8a7f86]">
                  {RANK_COND[current.rank]} · {formatElapsedPrecise(current.week)} 시점
                </span>
              </div>
              <div className="flex items-center gap-1">
                {ticket.map((n) => {
                  const hit = match.hit.has(n);
                  const bonus = !hit && n === current.bonus;
                  return (
                    <span key={n} className={`relative ${hit || bonus ? "" : "opacity-30 grayscale"}`}>
                      <Ball n={n} size={26} bonus={bonus} />
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
