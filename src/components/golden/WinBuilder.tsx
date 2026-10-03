"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shuffle, Eye, EyeSlash, SlidersHorizontal } from "@phosphor-icons/react";
import { WinScreen, type WinScreenData } from "./WinScreen";
import { drawNumbers, autoPick } from "@/lib/lotto/engine";
import { CryptoRng } from "@/lib/lotto/rng";
import { DEFAULT_PRIZE_PER_GAME, GAME_LETTERS, lastSaturday, roundOf, toISODate, fromISODate, fmtWon } from "@/lib/golden";
import { track } from "@/lib/analytics";

const rng = new CryptoRng();

function parseNumbers(raw: string | null, sep = ","): number[] | null {
  if (!raw) return null;
  const ns = raw.split(sep).map((s) => Number(s.trim()));
  if (ns.length !== 6 || ns.some((n) => !Number.isInteger(n) || n < 1 || n > 45)) return null;
  if (new Set(ns).size !== 6) return null;
  return [...ns].sort((a, b) => a - b);
}

/** g=1-9-12-32-34-36_4-9-17-39-43-45 처럼 게임 여러 줄을 한 번에 받는다. */
function parseGames(raw: string | null): number[][] | null {
  if (!raw) return null;
  const parsed = raw.split("_").map((g) => parseNumbers(g, "-"));
  if (!parsed.length || parsed.length > 5 || parsed.some((g) => g === null)) return null;
  return parsed as number[][];
}

const clampInt = (v: string | null, min: number, max: number, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
};

export function WinBuilder() {
  const params = useSearchParams();

  const initial = useMemo<WinScreenData>(() => {
    const sat = lastSaturday();
    const d = drawNumbers(rng);

    // g로 게임 전체를 받으면 그 줄들을 그대로 쓰고, 없으면 임의로 채운다.
    const urlGames = parseGames(params.get("g"));
    const gameCount = urlGames?.length ?? 5;
    const winIndex = clampInt(params.get("w"), 0, gameCount - 1, 0);

    const fromUrl = parseNumbers(params.get("n"));
    const numbers = fromUrl ?? urlGames?.[winIndex] ?? d.numbers;
    const bonusUrl = Number(params.get("b"));
    const bonus =
      Number.isInteger(bonusUrl) && bonusUrl >= 1 && bonusUrl <= 45 && !numbers.includes(bonusUrl) ? bonusUrl : d.bonus;

    const dateUrl = params.get("d");
    const date = dateUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateUrl) ? dateUrl : toISODate(sat);
    const round = clampInt(params.get("r"), 1, 99_999, roundOf(fromISODate(date)));

    const prizeUrl = Number(params.get("p"));
    const totalPrize = Number.isFinite(prizeUrl) && prizeUrl > 0 ? Math.floor(prizeUrl) : DEFAULT_PRIZE_PER_GAME;

    return {
      round,
      date,
      numbers,
      bonus,
      games: gameCount,
      winIndex,
      otherNumbers: urlGames ?? Array.from({ length: 5 }, () => autoPick(rng)),
      totalPrize,
    };
  }, [params]);

  const [data, setData] = useState<WinScreenData>(initial);
  const [showControls, setShowControls] = useState(params.get("cap") !== "1");
  const set = useCallback(<K extends keyof WinScreenData>(k: K, v: WinScreenData[K]) => setData((p) => ({ ...p, [k]: v })), []);

  useEffect(() => {
    track("win_screen_opened", { fromDraw: Boolean(params.get("n")), preset: Boolean(params.get("g")) });
  }, [params]);

  const reroll = () => {
    const d = drawNumbers(rng);
    setData((p) => ({ ...p, numbers: d.numbers, bonus: d.bonus, otherNumbers: Array.from({ length: 5 }, () => autoPick(rng)) }));
  };

  const setGames = (g: number) => {
    setData((p) => ({ ...p, games: g, winIndex: Math.min(p.winIndex, g - 1) }));
  };

  const setNumberAt = (i: number, v: number) => {
    setData((p) => {
      const next = [...p.numbers];
      next[i] = v;
      return { ...p, numbers: next };
    });
  };

  const dup = new Set(data.numbers).size !== 6;
  const bonusDup = data.numbers.includes(data.bonus);

  return (
    <div className="min-h-[100dvh] bg-[#2b2330]">
      {showControls && (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#2b2330]/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[480px] items-center gap-2 px-4">
            <Link href="/golden" aria-label="뒤로" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10">
              <ArrowLeft size={22} weight="bold" />
            </Link>
            <span className="font-display text-lg text-white">1등 당첨 화면 만들기</span>
            <button
              type="button"
              onClick={() => setShowControls(false)}
              className="ml-auto flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm text-white hover:bg-white/20"
            >
              <EyeSlash size={18} weight="bold" /> 촬영 모드
            </button>
          </div>
        </header>
      )}

      {/* 결과 화면 */}
      <div className={showControls ? "px-3 py-4" : "flex min-h-[100dvh] items-center justify-center px-3"}>
        <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[14px] shadow-2xl">
          <WinScreen data={data} />
        </div>
      </div>

      {!showControls && (
        <button
          type="button"
          onClick={() => setShowControls(true)}
          aria-label="설정 다시 열기"
          className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
        >
          <SlidersHorizontal size={22} weight="bold" />
        </button>
      )}

      {showControls && (
        <div className="mx-auto w-full max-w-[480px] px-4 pb-16">
          <div className="rounded-card bg-white/5 p-4 text-white">
            <h2 className="font-display text-lg">화면 내용 바꾸기</h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-white/60">회차</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={data.round}
                  onChange={(e) => set("round", Math.max(1, Number(e.target.value) || 1))}
                  className="h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-white outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-white/60">추첨일</span>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => {
                    const v = e.target.value;
                    set("date", v);
                    if (v) set("round", roundOf(fromISODate(v)));
                  }}
                  className="h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-white outline-none focus:border-accent"
                />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-white/40">추첨일을 고르면 회차가 자동으로 맞춰집니다.</p>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">당첨번호</span>
                <button
                  type="button"
                  onClick={reroll}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm hover:bg-white/20"
                >
                  <Shuffle size={16} weight="bold" /> 다시 뽑기
                </button>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {data.numbers.map((n, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    size={2}
                    value={n}
                    onChange={(e) => setNumberAt(i, Math.min(45, Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1)))}
                    aria-label={`당첨번호 ${i + 1}`}
                    className="h-11 w-full min-w-0 rounded-lg border border-white/15 bg-white/10 text-center text-white outline-none focus:border-accent"
                  />
                ))}
                <span className="px-0.5 text-white/50">+</span>
                <input
                  type="text"
                  inputMode="numeric"
                  size={2}
                  value={data.bonus}
                  onChange={(e) => set("bonus", Math.min(45, Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1)))}
                  aria-label="보너스 번호"
                  className="h-11 w-full min-w-0 rounded-lg border border-white/15 bg-white/10 text-center text-white outline-none focus:border-accent"
                />
              </div>
              {(dup || bonusDup) && (
                <p className="mt-1.5 text-xs text-accent-ink">
                  {dup ? "당첨번호 6개가 서로 달라야 합니다." : "보너스 번호는 당첨번호와 겹칠 수 없습니다."}
                </p>
              )}
            </div>

            <div className="mt-5">
              <span className="text-sm text-white/60">구매한 게임 수</span>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGames(g)}
                    aria-pressed={data.games === g}
                    className={`h-11 rounded-lg font-display text-base transition-colors ${
                      data.games === g ? "bg-accent text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {g}줄
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <span className="text-sm text-white/60">1등이 나온 게임</span>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {GAME_LETTERS.map((letter, i) => (
                  <button
                    key={letter}
                    type="button"
                    disabled={i >= data.games}
                    onClick={() => set("winIndex", i)}
                    aria-pressed={data.winIndex === i}
                    className={`h-11 rounded-lg font-display text-base transition-colors disabled:opacity-30 ${
                      data.winIndex === i ? "bg-accent text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-white/40">나머지 게임은 다른 번호로 채워지고 각자 등수가 표시됩니다.</p>
            </div>

            <label className="mt-5 flex flex-col gap-1.5 text-sm">
              <span className="text-white/60">총 당첨금액 (원)</span>
              <input
                type="number"
                inputMode="numeric"
                value={data.totalPrize}
                onChange={(e) => set("totalPrize", Math.max(0, Number(e.target.value) || 0))}
                className="h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-white outline-none focus:border-accent"
              />
              <span className="text-xs text-white/40">{fmtWon(data.totalPrize)}원 · 1등 1게임 기준 금액입니다.</span>
            </label>

            <button
              type="button"
              onClick={() => setShowControls(false)}
              className="btn-press mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-lg text-white"
            >
              <Eye size={20} weight="bold" /> 촬영 모드로 보기
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-white/40">
              촬영 모드에서는 설정이 사라지고 당첨 화면만 남습니다. 화면 녹화로 찍으세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
