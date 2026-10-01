"use client";
import { X, DotsThree } from "@phosphor-icons/react";
import { FlatBall } from "./FlatBall";
import { GAME_LETTERS, fmtWon } from "@/lib/golden";
import { SITE_NAME } from "@/lib/flags";

export interface WinScreenData {
  round: number;
  date: string; // yyyy-MM-dd
  numbers: number[]; // 6개
  bonus: number;
  games: number; // 1~5 (A~E 중 몇 줄까지 1등인지)
  totalPrize: number;
}

// 공 크기는 카드 폭에 비례시켜 320px 기기부터 430px까지 잘리지 않게 한다.
const MAIN_BALL = "aspect-square w-[12%] text-[clamp(12px,4vw,20px)]";
const ROW_BALL = "aspect-square w-[14%] text-[clamp(11px,3.3vw,17px)]";

/**
 * 1등 당첨 확인 화면. 릴스 촬영용이라 폰 화면 비율에 맞춘다.
 * 공식 복권 서비스의 로고나 문구는 쓰지 않고, 상단에 우리 서비스명과
 * 하단에 시뮬레이션 안내를 둔다.
 */
export function WinScreen({ data, onClose }: { data: WinScreenData; onClose?: () => void }) {
  const { round, date, numbers, bonus, games, totalPrize } = data;
  const rows = GAME_LETTERS.slice(0, Math.max(1, Math.min(5, games)));

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
          {rows.map((letter, i) => (
            <div key={letter} className={`flex items-stretch ${i > 0 ? "border-t border-[#E6E6E6]" : ""}`}>
              <div className="flex w-[44px] shrink-0 items-center justify-center bg-[#FAFAFA] text-[15px] font-bold">{letter}</div>
              <div className="flex w-[70px] shrink-0 items-center justify-center border-l border-[#E6E6E6] text-[13px] font-bold">
                1등당첨
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-[2%] border-l border-[#E6E6E6] px-1.5 py-3.5">
                {numbers.map((n) => (
                  <FlatBall key={n} n={n} className={ROW_BALL} />
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
