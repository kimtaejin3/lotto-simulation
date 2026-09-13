"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play, SpeakerHigh, SpeakerSlash, Receipt } from "@phosphor-icons/react";
import { useSetup, isSetupComplete } from "@/store/setup";
import { useSimulation } from "./useSimulation";
import { Drum } from "@/components/machine/Drum";
import { DrawSlots } from "@/components/machine/DrawSlots";
import { TimeCounter } from "./TimeCounter";
import { SpeedControl } from "./SpeedControl";
import { WinStamps } from "./WinStamps";
import { WinToast } from "./WinToast";
import { speedByKey, type SpeedKey } from "./speeds";
import { ResultPanel } from "@/components/result/ResultPanel";
import { fmtInt, fmtKRW, weeksToElapsed } from "@/lib/lotto/time";
import { track } from "@/lib/analytics";
import { sfx, setSoundEnabled, haptic, unlock } from "@/lib/sound";

export function SimulateScreen() {
  const router = useRouter();
  const reduce = useReducedMotion();
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
  const games = useSetup((s) => s.games);
  const soundOn = useSetup((s) => s.soundOn);
  const setSound = useSetup((s) => s.setSound);
  const reshuffleAll = useSetup((s) => s.reshuffleAll);

  const complete = hydrated && isSetupComplete(games);
  useEffect(() => {
    if (hydrated && !complete) router.replace("/setup");
  }, [hydrated, complete, router]);

  const [runId, setRunId] = useState(0);
  const tickets = useMemo(() => (complete ? games.map((g) => g.numbers) : null), [complete, games]);
  const ticketsForRun = useMemo(() => (tickets ? tickets.map((t) => [...t]) : null), [tickets, runId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sim = useSimulation(ticketsForRun);
  const [speedKey, setSpeedKey] = useState<SpeedKey>("1x");
  const speed = speedByKey(speedKey);
  const running = sim.status === "running";
  const paused = sim.status === "paused";
  const won = sim.status === "first";
  // The result sheet is separate from the run state: closing it must NOT resume the draw.
  const [showResult, setShowResult] = useState(false);

  // Auto-start once the worker is ready with tickets.
  const started = useRef(false);
  useEffect(() => {
    if (ticketsForRun && !started.current) {
      started.current = true;
      setShowResult(false);
      sim.run(speed.wps, speed.notifyRank);
    }
  }, [ticketsForRun, sim, speed.wps, speed.notifyRank]);

  // Open the sheet whenever the run transitions into paused/won (state adjusted during render, no effect).
  const [seenStatus, setSeenStatus] = useState(sim.status);
  if (sim.status !== seenStatus) {
    setSeenStatus(sim.status);
    if (sim.status === "paused" || sim.status === "first") setShowResult(true);
  }

  // Milestone analytics
  const milestones = useRef(new Set<number>());
  const years = weeksToElapsed(sim.state.weeks).years;
  useEffect(() => {
    for (const m of [100, 1000, 10000]) {
      if (years >= m && !milestones.current.has(m)) {
        milestones.current.add(m);
        track(`simulation_${m}_years` as "simulation_100_years");
      }
    }
  }, [years]);

  // Sounds on draw at slow speed, and win
  const prevKey = useRef(sim.drawKey);
  useEffect(() => {
    if (sim.drawKey !== prevKey.current) {
      prevKey.current = sim.drawKey;
      if (speedKey === "1x" && running) {
        for (let i = 0; i < 6; i++) setTimeout(() => sfx.pop(i), i * 70);
      } else if (running) sfx.tick();
    }
  }, [sim.drawKey, speedKey, running]);
  useEffect(() => {
    if (sim.status === "first") {
      sfx.win();
      haptic([40, 60, 40, 60, 120]);
      track("first_prize_reached", { weeks: sim.state.weeks, games: games.length });
    }
  }, [sim.status, sim.state.weeks, games.length]);

  const changeSpeed = (k: SpeedKey) => {
    setSpeedKey(k);
    unlock();
    track("simulation_speed_changed", { speed: k });
    const s = speedByKey(k);
    if (running) sim.setSpeed(s.wps, s.notifyRank);
  };

  const onStop = () => {
    haptic(20);
    track("simulation_stopped", { weeks: sim.state.weeks, years, speed: speedKey, games: games.length, spent: sim.state.spent });
    sim.pause();
  };
  const onResume = () => {
    unlock();
    setShowResult(false);
    track("simulation_resumed", { weeks: sim.state.weeks, speed: speedKey });
    sim.run(speed.wps, speed.notifyRank);
  };
  const replaySame = () => {
    track("replay_same_numbers");
    started.current = false;
    setShowResult(false);
    setRunId((r) => r + 1);
  };
  const replayNew = () => {
    track("replay_new_numbers");
    reshuffleAll();
    started.current = false;
    setShowResult(false);
    setRunId((r) => r + 1);
  };

  if (!complete || !tickets) return <div className="min-h-[70dvh]" />;

  const lastDraw = sim.state.lastDraw;
  const agitation = running ? speed.agitation : 0;
  const intense = running && speedKey !== "1x";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-10 pt-3 sm:px-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:pt-8">
      <section className="flex flex-col items-center">
        <div className="flex w-full items-center justify-between text-xs text-muted">
          <span>
            매주 {games.length}게임 · {fmtKRW(games.length * 1000)}
          </span>
          <button
            type="button"
            onClick={() => {
              setSound(!soundOn);
              setSoundEnabled(!soundOn);
            }}
            aria-pressed={soundOn}
            aria-label={soundOn ? "소리 끄기" : "소리 켜기"}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent-tint"
          >
            {soundOn ? <SpeakerHigh size={20} /> : <SpeakerSlash size={20} />}
          </button>
        </div>

        <div className="mt-2 w-full">
          <TimeCounter weeks={sim.state.weeks} intense={intense && !reduce} />
        </div>

        <div className="relative mt-2 aspect-[4/4.2] w-full max-w-[420px] sm:max-w-[460px]">
          <WinToast incoming={sim.wins} onConsumed={sim.consumeWins} tickets={tickets} />
          <Drum agitation={agitation} drawKey={sim.drawKey} drawn={lastDraw ? [...lastDraw.numbers, lastDraw.bonus] : []} />
          {paused && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[22%] flex justify-center">
              <span className="rounded-full bg-ink/80 px-3 py-1 font-display text-sm text-bg backdrop-blur">일시정지</span>
            </div>
          )}
        </div>

        <div className="-mt-2">
          <DrawSlots numbers={lastDraw?.numbers ?? null} bonus={lastDraw?.bonus ?? null} drawKey={sim.drawKey} size={40} animated={speedKey === "1x"} />
        </div>

        <div className="mt-5 w-full max-w-md">
          <WinStamps counts={sim.state.counts} />
        </div>

        <dl className="mt-3 grid w-full max-w-md grid-cols-2 gap-3 text-center">
          <div className="rounded-card bg-paper/70 px-3 py-3 dark:bg-bg-2">
            <dt className="text-xs text-muted">진행 회차</dt>
            <dd className="font-display tabular text-2xl leading-tight sm:text-3xl">{fmtInt(sim.state.weeks)}회</dd>
          </div>
          <div className="rounded-card bg-paper/70 px-3 py-3 dark:bg-bg-2">
            <dt className="text-xs text-muted">총 구매 금액</dt>
            <dd className="font-display tabular text-2xl leading-tight sm:text-3xl">{fmtKRW(sim.state.spent)}</dd>
          </div>
        </dl>
      </section>

      <aside className="mt-6 flex flex-col gap-4 lg:mt-0 lg:justify-center">
        <SpeedControl value={speedKey} onChange={changeSpeed} disabled={won} />
        {running ? (
          <motion.button
            type="button"
            onClick={onStop}
            whileTap={{ scale: 0.97 }}
            className="btn-press flex h-16 w-full items-center justify-center gap-2 rounded-full bg-ink font-display text-2xl text-bg shadow-lg"
          >
            <Pause size={26} weight="fill" /> 멈추기
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={onResume}
            disabled={won}
            className="btn-press flex h-16 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-2xl text-white shadow-lg disabled:opacity-40"
          >
            <Play size={26} weight="fill" /> {paused ? "계속 돌리기" : "시작"}
          </button>
        )}
        {(paused || won) && !showResult && (
          <button
            type="button"
            onClick={() => setShowResult(true)}
            className="btn-press flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-paper/70 font-display text-lg text-ink dark:bg-bg-2"
          >
            <Receipt size={20} weight="bold" /> 결과 다시 보기
          </button>
        )}
        <p className="text-center text-xs text-muted">
          {sim.wps > 0 && running && speedKey !== "1x" ? `초당 ${fmtInt(sim.wps)}회 추첨 중` : paused ? "멈춰 있어요. 계속 돌리거나 결과를 확인하세요" : "1등이 나오면 자동으로 멈춰요"}
        </p>
      </aside>

      {showResult && (paused || won) && (
        <ResultPanel
          won={won}
          state={sim.state}
          tickets={tickets}
          winningNumbers={sim.state.firstPrizeTicketIndex !== null ? games[sim.state.firstPrizeTicketIndex]?.numbers : undefined}
          onClose={() => setShowResult(false)}
          onResume={paused ? onResume : undefined}
          onReplaySame={replaySame}
          onReplayNew={replayNew}
        />
      )}
    </main>
  );
}
