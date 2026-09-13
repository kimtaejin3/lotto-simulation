"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowsClockwise, Shuffle, X, PencilSimple, Play } from "@phosphor-icons/react";
import type { SimState } from "@/lib/lotto/engine";
import { formatElapsedPrecise, fmtInt, fmtKRW, weeksToElapsed, scaleComparison } from "@/lib/lotto/time";
import { Ball } from "@/components/ui/Ball";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "./ShareButton";
import { TicketReport } from "./TicketReport";
import { AdSlot } from "@/components/ui/AdSlot";

interface Props {
  won: boolean;
  state: SimState;
  tickets: number[][];
  winningNumbers?: number[];
  onClose: () => void;
  onResume?: () => void;
  onReplaySame: () => void;
  onReplayNew: () => void;
}

export function ResultPanel({ won, state, tickets, winningNumbers, onClose, onResume, onReplaySame, onReplayNew }: Props) {
  const reduce = useReducedMotion();
  const gamesPerWeek = tickets.length;
  const years = weeksToElapsed(state.weeks).years;
  const bestRank = state.bestRank;
  const bestCount = bestRank ? state.counts[bestRank] : 0;
  const comparison = scaleComparison(years);

  useEffect(() => {
    if (!won || reduce) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      const colors = ["#FFC531", "#4FB5F5", "#FF6B6B", "#7DC95E", "#ee3d62"];
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors, zIndex: 60 });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, zIndex: 60 }), 250);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, zIndex: 60 }), 400);
    });
    return () => {
      cancelled = true;
    };
  }, [won, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shareData = {
    won,
    weeks: state.weeks,
    gamesPerWeek,
    spent: state.spent,
    bestRank,
    bestCount,
    numbers: won ? winningNumbers : undefined,
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={reduce ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-bg shadow-2xl sm:rounded-[28px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg/70 text-muted backdrop-blur hover:bg-accent-tint"
        >
          <X size={22} weight="bold" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <div className="px-6 pt-8 text-center">
            {won ? (
              <>
                <div className="text-sm text-accent">🎉 축하합니다</div>
                <h2 id="result-title" className="mt-1 font-display text-4xl leading-tight">
                  드디어 1등입니다!
                </h2>
                <p className="mt-3 font-display text-3xl leading-tight text-accent sm:text-4xl">
                  {formatElapsedPrecise(state.weeks)} 만에요.
                </p>
              </>
            ) : (
              <>
                <h2 id="result-title" className="font-display text-4xl leading-tight">
                  여기서 멈췄습니다.
                </h2>
                <p className="mt-3 font-display text-2xl leading-tight text-ink-2">
                  {state.counts[1] > 0 ? "이미 1등이 한 번 나왔어요!" : "아직 1등은 나오지 않았어요."}
                </p>
              </>
            )}
            {comparison && <p className="mt-3 text-sm text-muted">{comparison}</p>}
          </div>

          {won && winningNumbers && (
            <div className="mt-5 flex justify-center gap-1.5">
              {winningNumbers.map((n, i) => (
                <motion.div
                  key={n}
                  initial={reduce ? false : { scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.3 + i * 0.08 }}
                >
                  <Ball n={n} size={44} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="paper paper-perforated mx-6 mt-6 rounded-[6px] px-5 pb-5 pt-5 text-[#2b2330]">
            <div className="flex items-baseline justify-between border-b border-dashed border-[#f0a3b6] pb-2">
              <span className="font-display text-lg text-[#d8386a]">로또 6/45 시뮬레이션</span>
              <span className="text-[10px] text-[#b06a7c]">매주 {gamesPerWeek}게임</span>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k={won ? "당첨까지" : "흘러간 시간"} v={formatElapsedPrecise(state.weeks)} strong />
              <Row k="진행 회차" v={`${fmtInt(state.weeks)}회`} />
              <Row k="총 구매 게임" v={`${fmtInt(state.games)}게임`} />
              <Row k="총 구매 금액" v={fmtKRW(state.spent)} />
              <Row k="2등 · 3등" v={`${fmtInt(state.counts[2])}회 · ${fmtInt(state.counts[3])}회`} />
              <Row k="4등 · 5등" v={`${fmtInt(state.counts[4])}회 · ${fmtInt(state.counts[5])}회`} />
              {!won && <Row k="최고 당첨" v={bestRank ? `${bestRank}등 ${fmtInt(bestCount)}회` : "없음"} />}
            </dl>
          </div>

          <TicketReport state={state} tickets={tickets} />

          <div className="mt-4 px-6">
            <AdSlot id="result" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={onReplaySame} className="text-base">
                <ArrowsClockwise size={20} weight="bold" /> 같은 번호로
              </Button>
              <Button variant="secondary" onClick={onReplayNew} className="text-base">
                <Shuffle size={20} weight="bold" /> 새 번호로
              </Button>
            </div>
            <Link href="/setup" className="mt-1 flex items-center justify-center gap-1 py-2 text-sm text-muted hover:text-ink">
              <PencilSimple size={16} /> 번호 직접 다시 고르기
            </Link>
          </div>
        </div>

        {/* Sticky action bar: share is always one thumb away. */}
        <div className="shrink-0 border-t border-line/60 bg-bg/95 px-6 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 backdrop-blur">
          <div className={`grid gap-2 ${onResume ? "grid-cols-[1fr_auto]" : "grid-cols-1"}`}>
            <ShareButton data={shareData} />
            {onResume && (
              <Button variant="secondary" onClick={onResume} className="h-14 px-5 text-base" aria-label="계속 돌리기">
                <Play size={20} weight="fill" /> 계속
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[#8a7f86]">{k}</dt>
      <dd className={`font-display tabular ${strong ? "text-xl text-[#d8386a]" : "text-base"}`}>{v}</dd>
    </div>
  );
}
