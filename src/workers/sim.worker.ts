/// <reference lib="webworker" />
import { createSimState, runWeeks, toMask, type SimState, type TicketMask, type WinEvent, type Rank } from "@/lib/lotto/engine";
import { Xoshiro128ss } from "@/lib/lotto/rng";

export type SpeedSetting = number | "max"; // weeks per second, or unbounded

export type MainToWorker =
  | { type: "init"; tickets: number[][] }
  | { type: "run"; speed: SpeedSetting; notifyRank?: Rank }
  | { type: "speed"; speed: SpeedSetting; notifyRank?: Rank }
  | { type: "pause" }
  | { type: "reset" };

export type WorkerToMain =
  | { type: "progress"; state: SimState; measuredWps: number; wins: WinEvent[] }
  | { type: "first"; state: SimState }
  | { type: "paused"; state: SimState };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

let tickets: TicketMask[] = [];
let state: SimState = createSimState();
let rng = new Xoshiro128ss();
let running = false;
let speed: SpeedSetting = 1;
let notifyRank: Rank = 0;
let pendingWins: WinEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

let lastTick = 0;
let carry = 0; // fractional weeks owed
let lastPost = 0;
let wpsWindowStart = 0;
let wpsWindowWeeks = 0;
let measuredWps = 0;

const MAX_CHUNK = 250_000; // weeks per chunk at MAX speed (~100ms)
const POST_INTERVAL_MS = 50;

function post(msg: WorkerToMain) {
  ctx.postMessage(msg);
}

function snapshot(): SimState {
  return {
    ...state,
    counts: [...state.counts] as SimState["counts"],
    ticketCounts: state.ticketCounts.map((c) => [...c] as SimState["counts"]),
  };
}

function takeWins(): WinEvent[] {
  if (pendingWins.length === 0) return pendingWins;
  const w = pendingWins;
  pendingWins = [];
  return w;
}

function schedule(delay: number) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(tick, delay);
}

function tick() {
  timer = null;
  if (!running) return;
  const now = performance.now();
  const dt = Math.min(now - lastTick, 500) / 1000;
  lastTick = now;

  let budget: number;
  if (speed === "max") {
    budget = MAX_CHUNK;
  } else {
    carry += speed * dt;
    budget = Math.floor(carry);
    carry -= budget;
    if (budget > MAX_CHUNK) budget = MAX_CHUNK;
  }

  if (budget > 0) {
    const ran = runWeeks(state, tickets, budget, rng, { stopOnFirst: true, notifyRank, wins: pendingWins, maxWins: 12 });
    wpsWindowWeeks += ran;
    if (state.firstPrizeWeek !== null) {
      running = false;
      post({ type: "first", state: snapshot() });
      return;
    }
  }

  if (now - wpsWindowStart >= 500) {
    measuredWps = (wpsWindowWeeks * 1000) / Math.max(1, now - wpsWindowStart);
    wpsWindowStart = now;
    wpsWindowWeeks = 0;
  }

  const shouldPost =
    speed === "max" ? true : speed <= 2 ? budget > 0 : now - lastPost >= POST_INTERVAL_MS;
  if (shouldPost) {
    lastPost = now;
    post({ type: "progress", state: snapshot(), measuredWps, wins: takeWins() });
  }

  // Pace: slow speeds wait for the next whole week; fast speeds spin with a small yield.
  let delay = 0;
  if (speed !== "max") {
    const secsPerWeek = 1 / speed;
    delay = speed <= 2 ? Math.max(0, secsPerWeek * 1000 - 1) : 16;
  }
  schedule(delay);
}

ctx.onmessage = (e: MessageEvent<MainToWorker>) => {
  const msg = e.data;
  switch (msg.type) {
    case "init":
      tickets = msg.tickets.map(toMask);
      state = createSimState(tickets.length);
      pendingWins = [];
      rng = new Xoshiro128ss();
      carry = 0;
      running = false;
      if (timer) clearTimeout(timer);
      timer = null;
      post({ type: "progress", state: snapshot(), measuredWps: 0, wins: [] });
      break;
    case "run":
      speed = msg.speed;
      if (msg.notifyRank !== undefined) notifyRank = msg.notifyRank;
      if (!running) {
        running = true;
        lastTick = performance.now();
        wpsWindowStart = lastTick;
        wpsWindowWeeks = 0;
        carry = speed !== "max" && speed <= 2 ? 1 : 0; // draw immediately at 1x
        schedule(0);
      }
      break;
    case "speed":
      speed = msg.speed;
      if (msg.notifyRank !== undefined) notifyRank = msg.notifyRank;
      carry = 0;
      lastTick = performance.now();
      wpsWindowStart = lastTick;
      wpsWindowWeeks = 0;
      measuredWps = 0;
      if (running) schedule(0);
      break;
    case "pause":
      running = false;
      if (timer) clearTimeout(timer);
      timer = null;
      post({ type: "paused", state: snapshot() });
      break;
    case "reset":
      running = false;
      if (timer) clearTimeout(timer);
      timer = null;
      state = createSimState(tickets.length);
      pendingWins = [];
      carry = 0;
      post({ type: "progress", state: snapshot(), measuredWps: 0, wins: [] });
      break;
  }
};
