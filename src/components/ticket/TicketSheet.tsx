"use client";
import { TicketGame } from "./TicketGame";
import type { TicketGame as TicketGameT } from "@/store/setup";
import { GAMES_PER_SHEET } from "@/lib/lotto/constants";

interface Props {
  sheetIndex: number;
  games: TicketGameT[]; // up to 5
  offset: number; // global index of first game on this sheet
  onToggle: (gi: number, n: number) => void;
  onAuto: (gi: number) => void;
  onClear: (gi: number) => void;
}

const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/** One physical-looking 6/45 marking slip holding up to five games. */
export function TicketSheet({ sheetIndex, games, offset, onToggle, onAuto, onClear }: Props) {
  const cols = Math.min(GAMES_PER_SHEET, games.length);
  return (
    <section
      aria-label={`${sheetIndex + 1}번째 용지`}
      className="paper paper-perforated relative w-full rounded-[6px] px-4 pb-5 pt-6 sm:px-6"
    >
      <header className="mb-4 flex items-end justify-between border-b-2 border-dashed border-[#f0a3b6] pb-3">
        <div className="leading-none">
          <div className="font-display text-2xl tracking-tight text-[#d8386a]">
            로또 <span className="text-[#2b2330]">6/45</span>
          </div>
          <div className="mt-1 text-[10px] text-[#b06a7c]">시뮬레이션용 마킹 용지 · 실제 복권이 아닙니다</div>
        </div>
        <div className="text-right text-[10px] leading-tight text-[#b06a7c]">
          <div>용지 {sheetIndex + 1}</div>
          <div>1게임 1,000원</div>
        </div>
      </header>
      <div className={`grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 ${LG_COLS[cols]}`}>
        {games.map((g, i) => (
          <TicketGame
            key={offset + i}
            index={offset + i}
            game={g}
            onToggle={(n) => onToggle(offset + i, n)}
            onAuto={() => onAuto(offset + i)}
            onClear={() => onClear(offset + i)}
            compact={cols >= 4}
          />
        ))}
      </div>
    </section>
  );
}
