"use client";
import { X, DotsThree } from "@phosphor-icons/react";
import { FlatBall } from "./FlatBall";
import { GAME_LETTERS, fmtWon } from "@/lib/golden";
import { rankOf, toMask } from "@/lib/lotto/engine";
import { SITE_NAME } from "@/lib/flags";

export interface WinScreenData {
  round: number;
  date: string; // yyyy-MM-dd
  numbers: number[]; // 당첨번호 6개
  bonus: number;
  games: number; // 구매한 게임 수 (A~E 중 몇 줄)
  winIndex: number; // 1등이 나온 게임 (0-based)
  otherNumbers: number[][]; // 나머지 게임들의 번호 (5줄 분량)
  totalPrize: number;
}

const MAIN_BALL = "aspect-square w-[12%] text-[clamp(12px,4vw,20px)]";
const ROW_BALL = "aspect-square w-[14%] text-[clamp(11px,3.3vw,17px)]";

const rankLabel = (r: number) => (r === 0 ? "낙첨" : `${r}등당첨`);

/**
 * 1등 당첨 확인 화면. 릴스 촬영용이라 폰 화면 비율에 맞춘다.
 * 고른 한 게임만 1등이고 나머지 게임은 각자 다른 번호와 등수를 갖는다.
 * 공식 복권 서비스의 로고나 문구는 쓰지 않고, 상단에 우리 서비스명과
 * 하단에 시뮬레이션 안내를 둔다.
 */
export function WinScreen({ data, onClose }: { data: WinScreenData; onClose?: () => void }) {
  const { round, date, numbers, bonus, games, winIndex, otherNumbers, totalPrize } = data;
  const rowCount = Math.max(1, Math.min(5, games));
  const winRow = Math.max(0, Math.min(rowCount - 1, winIndex));
  const drawMask = toMask(numbers);

  const rows = GAME_LETTERS.slice(0, rowCount).map((letter, i) => {
    if (i === winRow) return { letter, nums: numbers, label: "1등당첨", win: true };
    const nums = otherNumbers[i] ?? numbers;
    return { letter, nums, label: rankLabel(rankOf(toMask(nums), drawMask, bonus)), win: false };
  });

  return (
    <div className="mx-auto w-full max-w-[430px] bg-white text-[#1a1a1a]" data-win-screen>
      {/* 헤더 */}
      <div className="relative px-4 pb-6 pt-6" style={{ background: "linear-gradient(180deg,#F6F8FD 0%,#FFFFFF 100%)" }}>
        <div className="absolute right-3 top-4 flex gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BDBDBD] text-white" aria-hidden="true">
            <DotsThree size={20} weight="bold" />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BDBDBD] text-white"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-[10px] font-medium tracking-wide text-[#9AA3B2]">{SITE_NAME} 시뮬레이션</div>
          <h1 className="mt-1 text-[clamp(21px,6.2vw,27px)] font-bold leading-tight">
            로또 6/45 <span className="text-[#2B7FD4]">제{round}회</span>
          </h1>
          <p className="mt-1 text-[13px] text-[#8A8F98]">{date} 추첨</p>
        </div>

        <h2 className="mt-6 text-center text-[16px] font-bold">당첨번호</h2>
        <div className="mt-3 flex items-center justify-center gap-[1.4%]">
          {numbers.map((n) => (
            <FlatBall key={n} n={n} className={MAIN_BALL} />
          ))}
          <span className="mx-[1.2%] shrink-0 text-[17px] font-bold text-[#555]">+</span>
          <FlatBall n={bonus} className={MAIN_BALL} />
        </div>

        {/* 축하 박스 */}
        <div className="mt-6 rounded-[10px] border border-[#EBEDF0] bg-[#F8F9FB] px-3 py-7 text-center">
          <p className="text-[16px] text-[#55595F]">축하합니다!</p>
          <p className="mt-2 text-[clamp(17px,5.2vw,22px)] font-bold leading-snug">
            총 <span className="text-[#2B7FD4]">{fmtWon(totalPrize)}원</span> 당첨
          </p>
        </div>
      </div>

      {/* 게임별 결과 */}
      <div className="px-3 pb-2">
        <div className="overflow-hidden rounded-[6px] border border-[#E6E6E6]">
          {rows.map((row, i) => (
            <div key={row.letter} className={`flex items-stretch ${i > 0 ? "border-t border-[#E6E6E6]" : ""}`}>
              <div className="flex w-[44px] shrink-0 items-center justify-center bg-[#FAFAFA] text-[15px] font-bold">{row.letter}</div>
              <div
                className={`flex w-[70px] shrink-0 items-center justify-center border-l border-[#E6E6E6] text-[13px] ${
                  row.win ? "font-bold" : "text-[#9AA3B2]"
                }`}
              >
                {row.label}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-[2%] border-l border-[#E6E6E6] px-1.5 py-3.5">
                {row.nums.map((n) => (
                  <FlatBall key={n} n={n} className={ROW_BALL} style={row.win ? undefined : { opacity: 0.45 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="px-4 pb-6 pt-3 text-[12px] leading-relaxed text-[#8A8F98]">
        이 화면은 {SITE_NAME}에서 만든 시뮬레이션 결과이며, 실제 복권 당첨과는 아무런 관련이 없습니다.
      </p>
    </div>
  );
}
