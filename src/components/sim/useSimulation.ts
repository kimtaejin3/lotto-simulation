"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MainToWorker, WorkerToMain, SpeedSetting } from "@/workers/sim.worker";
import { createSimState, type SimState, type WinEvent, type Rank } from "@/lib/lotto/engine";

export type SimStatus = "idle" | "running" | "paused" | "first";

export function useSimulation(tickets: number[][] | null) {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<SimState>(() => createSimState());
  const [status, setStatus] = useState<SimStatus>("idle");
  const [wps, setWps] = useState(0);
  const [drawKey, setDrawKey] = useState(0);
  const [wins, setWins] = useState<WinEvent[]>([]); // notable wins since last consume
  const lastWeeks = useRef(0);

  useEffect(() => {
    if (!tickets) return;
    const w = new Worker(new URL("../../workers/sim.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = w;
    w.onmessage = (e: MessageEvent<WorkerToMain>) => {
      const m = e.data;
      setState(m.state);
      if (m.state.weeks !== lastWeeks.current) {
        lastWeeks.current = m.state.weeks;
        setDrawKey((k) => k + 1);
      }
      if (m.type === "progress") {
        setWps(m.measuredWps);
        if (m.wins.length) setWins((prev) => (prev.length > 24 ? m.wins : [...prev, ...m.wins]));
      }
      else if (m.type === "first") setStatus("first");
      else if (m.type === "paused") setStatus("paused");
    };
    w.postMessage({ type: "init", tickets } satisfies MainToWorker);
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, [tickets]);

  const send = useCallback((m: MainToWorker) => workerRef.current?.postMessage(m), []);

  const run = useCallback(
    (speed: SpeedSetting, notifyRank?: Rank) => {
      send({ type: "run", speed, notifyRank });
      setStatus("running");
    },
    [send],
  );
  const consumeWins = useCallback(() => setWins([]), []);
  const pause = useCallback(() => send({ type: "pause" }), [send]);
  const setSpeed = useCallback(
    (speed: SpeedSetting, notifyRank?: Rank) => {
      send({ type: "speed", speed, notifyRank });
    },
    [send],
  );
  const reset = useCallback(() => {
    send({ type: "reset" });
    lastWeeks.current = 0;
    setWins([]);
    setStatus("idle");
  }, [send]);

  return { state, status, wps, drawKey, wins, consumeWins, run, pause, setSpeed, reset };
}
