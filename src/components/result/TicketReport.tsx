"use client";
import type { SimState } from "@/lib/lotto/engine";
import { matchedNumbers } from "@/lib/lotto/engine";
import { Ball } from "@/components/ui/Ball";
import { gameLabel } from "@/components/ticket/TicketGame";
import { fmtInt, formatElapsedPrecise } from "@/lib/lotto/time";

const RANK_INK: Record<number, string> = { 1: "#d92a52", 2: "#d92a52", 3: "#e5602f", 4: "#3f8fc9", 5: "#5f9a3c" };

/**
 * "성적표": every game the player marked, with the numbers that matched the
 * most recent draw lit up, the per-game tally, and the best win on record.
 */
export function TicketReport({ state, tickets }: { state: SimState; tickets: number[][] }) {
  const draw = state.lastDraw;
  const best = state.bestWin;
  return (
    <div className="paper paper-perforated mx-6 mt-4 rounded-[6px] px-5 pb-5 pt-5 text-[#2b2330]">
      <div className="flex items-baseline justify-between border-b border-dashed border-[#f0a3b6] pb-2">
        <span className="font-display text-lg text-[#d8386a]">내 번호 성적표</span>
        <span className="text-[10px] text-[#b06a7c]">{fmtInt(state.weeks)}회차 기준</span>
      </div>

      {draw && (
        <div className="mt-3">
          <div className="text-[11px] text-[#8a7f86]">마지막 추첨 번호</div>
          <div className="mt-1 flex items-center gap-1">
            {draw.numbers.map((n) => (
              <Ball key={n} n={n} size={26} />
            ))}
            <span className="mx-0.5 font-display text-[#8a7f86]">+</span>
            <Ball n={draw.bonus} size={26} bonus />
          </div>
        </div>
      )}

      <ul className="mt-3 space-y-2">
        {tickets.map((t, i) => {
          const m = draw ? matchedNumbers(t, draw) : null;
          const c = state.ticketCounts[i] ?? [0, 0, 0, 0, 0, 0];
          const hits = m ? m.hit.size : 0;
          const wonNow = hits >= 3;
          const tally = [1, 2, 3, 4, 5].filter((r) => c[r] > 0).map((r) => `${r}등 ${fmtInt(c[r])}`);
          return (
            <li key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 font-display text-base text-[#d8386a]">{gameLabel(i)}</span>
              <div className="flex shrink-0 items-center gap-0.5">
                {t.map((n) => {
                  const hit = !!m?.hit.has(n);
                  const bonus = !hit && n === draw?.bonus;
                  return (
                    <span key={n} className={hit || bonus ? "" : "opacity-35 grayscale"}>
                      <Ball n={n} size={24} bonus={bonus} />
                    </span>
                  );
                })}
              </div>
              <div className="ml-auto min-w-0 text-right">
                <div className={`font-display text-xs leading-none ${wonNow ? "" : "text-[#8a7f86]"}`} style={wonNow ? { color: RANK_INK[hits >= 6 ? 1 : hits === 5 ? 3 : hits === 4 ? 4 : 5] } : undefined}>
                  {draw ? `${hits}개 일치` : "-"}
                </div>
                <div className="mt-0.5 truncate text-[10px] text-[#8a7f86]">{tally.length ? tally.join(" · ") : "당첨 없음"}</div>
              </div>
            </li>
          );
        })}
      </ul>

      {best && (
        <div className="mt-4 flex items-center gap-3 border-t border-dashed border-[#f0a3b6] pt-3">
          <div
            className="flex h-11 w-11 shrink-0 -rotate-6 items-center justify-center rounded-full border-[3px] font-display text-sm leading-none"
            style={{ borderColor: RANK_INK[best.rank], color: RANK_INK[best.rank] }}
          >
            {best.rank}등
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm leading-tight">
              최고 기록 · {gameLabel(best.ticket)}게임 · {formatElapsedPrecise(best.week)} 시점
            </div>
            <div className="mt-1 flex items-center gap-0.5">
              {(tickets[best.ticket] ?? []).map((n) => {
                const hit = best.numbers.includes(n);
                const bonus = !hit && n === best.bonus;
                return (
                  <span key={n} className={hit || bonus ? "" : "opacity-35 grayscale"}>
                    <Ball n={n} size={22} bonus={bonus} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
