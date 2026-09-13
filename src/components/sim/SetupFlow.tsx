"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "@phosphor-icons/react";
import { useSetup, PRESETS, MAX_GAMES, isSetupComplete } from "@/store/setup";
import { TicketSheet } from "@/components/ticket/TicketSheet";
import { Button } from "@/components/ui/Button";
import { GAMES_PER_SHEET, GAME_PRICE } from "@/lib/lotto/constants";
import { track } from "@/lib/analytics";

export function SetupFlow() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.resolve(useSetup.persist.rehydrate()).then(() => {
      if (alive) setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const gamesPerWeek = useSetup((s) => s.gamesPerWeek);
  const games = useSetup((s) => s.games);
  const setGamesPerWeek = useSetup((s) => s.setGamesPerWeek);
  const toggleNumber = useSetup((s) => s.toggleNumber);
  const autoGame = useSetup((s) => s.autoGame);
  const autoAll = useSetup((s) => s.autoAll);
  const clearGame = useSetup((s) => s.clearGame);

  const isPreset = (PRESETS as readonly number[]).includes(gamesPerWeek);
  const [custom, setCustom] = useState(!isPreset);
  const complete = isSetupComplete(games);
  const doneCount = games.filter((g) => g.numbers.length === 6).length;

  const sheets = useMemo(() => {
    const out: { offset: number; games: typeof games }[] = [];
    for (let i = 0; i < games.length; i += GAMES_PER_SHEET) out.push({ offset: i, games: games.slice(i, i + GAMES_PER_SHEET) });
    return out;
  }, [games]);

  if (!hydrated) return <div className="min-h-[60dvh]" />;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-6 sm:px-6">
      <section aria-labelledby="q1">
        <h1 id="q1" className="font-display text-3xl leading-tight sm:text-4xl">
          매주 얼마나 사실 건가요?
        </h1>
        <p className="mt-1 text-sm text-muted">토요일마다 같은 번호로 계속 삽니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = !custom && gamesPerWeek === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCustom(false);
                  setGamesPerWeek(p);
                  track("weekly_games_selected", { games: p });
                }}
                className={`btn-press h-11 rounded-full border px-4 font-display text-base transition-colors ${
                  active ? "border-accent bg-accent text-white" : "border-line bg-paper/60 text-ink hover:bg-accent-tint dark:bg-bg-2"
                }`}
              >
                {p}게임 <span className={`ml-1 text-xs ${active ? "text-white/80" : "text-muted"}`}>₩{(p * GAME_PRICE).toLocaleString("ko-KR")}/주</span>
              </button>
            );
          })}
          <label
            className={`flex h-11 items-center gap-2 rounded-full border px-4 font-display text-base transition-colors ${
              custom ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-paper/60 text-ink dark:bg-bg-2"
            }`}
          >
            직접 입력
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_GAMES}
              value={custom ? gamesPerWeek : ""}
              placeholder="게임 수"
              onFocus={() => setCustom(true)}
              onChange={(e) => {
                setCustom(true);
                const v = Number(e.target.value);
                if (v >= 1) setGamesPerWeek(v);
              }}
              className="w-20 rounded-md border border-line bg-paper px-2 py-1 text-center font-sans text-sm text-[#2b2330] outline-none focus:border-accent"
              aria-label="매주 구매할 게임 수 직접 입력"
            />
          </label>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="q2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="q2" className="font-display text-3xl leading-tight sm:text-4xl">
              번호를 마킹해 주세요
            </h2>
            <p className="mt-1 text-sm text-muted">게임마다 6개씩. 고르기 귀찮으면 전부 자동으로.</p>
          </div>
          <Button
            variant="secondary"
            className="h-11 px-5 text-base"
            onClick={() => {
              autoAll();
              track("auto_number_selected", { all: true });
            }}
          >
            <Shuffle size={18} weight="bold" /> 전부 자동
          </Button>
        </div>

        <div className="mt-5 space-y-6">
          {sheets.map((sh, i) => (
            <TicketSheet
              key={i}
              sheetIndex={i}
              offset={sh.offset}
              games={sh.games}
              onToggle={(gi, n) => {
                toggleNumber(gi, n);
                track("manual_number_selected", { game: gi, n });
              }}
              onAuto={(gi) => {
                autoGame(gi);
                track("auto_number_selected", { game: gi });
              }}
              onClear={clearGame}
            />
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line/60 bg-bg/85 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 sm:px-6">
          <div className="min-w-0 flex-1 text-sm">
            <div className="font-display text-lg leading-none tabular">
              {doneCount} / {games.length} 게임
            </div>
            <div className="truncate text-xs text-muted">매주 ₩{(games.length * GAME_PRICE).toLocaleString("ko-KR")}</div>
          </div>
          <Button
            disabled={!complete}
            className="px-8"
            onClick={() => {
              track("simulation_started", { games: games.length });
              router.push("/simulate");
            }}
          >
            추첨 시작
          </Button>
        </div>
      </div>
    </main>
  );
}
