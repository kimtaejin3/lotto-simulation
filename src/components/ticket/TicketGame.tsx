"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NumberCell } from "./NumberCell";
import { haptic } from "@/lib/sound";
import type { TicketGame as TicketGameT } from "@/store/setup";
import { GAME_PRICE } from "@/lib/lotto/constants";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const gameLabel = (i: number) => (i < 26 ? LETTERS[i] : `${LETTERS[i % 26]}${Math.floor(i / 26) + 1}`);

interface Props {
  index: number;
  game: TicketGameT;
  onToggle: (n: number) => void;
  onAuto: () => void;
  onClear: () => void;
  compact?: boolean;
}

const NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);

export function TicketGame({ index, game, onToggle, onAuto, onClear, compact }: Props) {
  const full = game.numbers.length >= 6;
  const set = new Set(game.numbers);
  const reduce = useReducedMotion();
  const [nudge, setNudge] = useState(0);
  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(0), 1600);
    return () => clearTimeout(t);
  }, [nudge]);
  const handleToggle = (n: number) => {
    if (full && !set.has(n)) {
      // 7th number: refuse, wiggle the slip and explain instead of silently ignoring the tap.
      setNudge((k) => k + 1);
      haptic([15, 30, 15]);
      return;
    }
    onToggle(n);
  };
  return (
    <motion.div
      key={nudge}
      className="flex flex-col gap-2"
      animate={nudge && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between rounded-cell bg-[#d8386a] px-2.5 py-1 text-white">
        <span className="font-display text-base leading-none">{gameLabel(index)}</span>
        <span className="text-[11px] tabular">{GAME_PRICE.toLocaleString("ko-KR")}원</span>
        <span className="text-[11px]">
          {game.numbers.length}/6 {game.mode === "auto" && full ? "자동" : ""}
        </span>
      </div>
      <div className="relative">
        <div className="grid grid-cols-7 gap-1">
          {NUMBERS.map((n) => (
            <NumberCell key={n} n={n} marked={set.has(n)} disabled={false} onToggle={handleToggle} size={compact ? "sm" : "md"} />
          ))}
        </div>
        {nudge > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <span className="rounded-full bg-[#2b2330] px-3 py-1.5 text-center text-[12px] leading-tight text-white shadow-lg">
              6개를 다 골랐어요. 하나를 지우고 고르세요
            </span>
          </div>
        )}
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto] gap-1.5">
        <button
          type="button"
          onClick={onAuto}
          className="btn-press h-8 rounded-cell border border-[#f0a3b6] bg-[#fff0f3] text-[12px] text-[#d8386a] transition-colors hover:bg-[#ffe1e8]"
        >
          {game.mode === "auto" && full ? "다시 자동" : "자동 선택"}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={game.numbers.length === 0}
          className="btn-press h-8 rounded-cell border border-[#f0a3b6] px-3 text-[12px] text-[#d8386a] transition-colors hover:bg-[#fff0f3] disabled:opacity-40"
        >
          취소
        </button>
      </div>
    </motion.div>
  );
}
