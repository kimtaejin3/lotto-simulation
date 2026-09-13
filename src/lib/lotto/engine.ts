import { MAX_NUMBER, PICK_COUNT, GAME_PRICE, type Rank } from "./constants";
export type { Rank } from "./constants";
import type { Rng } from "./rng";

/** Six main numbers (ascending) + bonus */
export interface Draw {
  numbers: number[];
  bonus: number;
}

/**
 * A ticket is stored as a 2-word bitmask so rank calculation is a couple of
 * popcounts instead of loops. Bit (n-1) for n in 1..32 lives in `lo`,
 * bit (n-33) for n in 33..45 lives in `hi`.
 */
export interface TicketMask {
  lo: number;
  hi: number;
}

export function toMask(numbers: readonly number[]): TicketMask {
  let lo = 0;
  let hi = 0;
  for (const n of numbers) {
    if (n <= 32) lo |= 1 << (n - 1);
    else hi |= 1 << (n - 33);
  }
  return { lo: lo >>> 0, hi: hi >>> 0 };
}

export function popcount(x: number): number {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (Math.imul((x + (x >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24);
}

const scratch = new Uint8Array(MAX_NUMBER);

/** Draw 6 unique numbers + 1 bonus (bonus never overlaps). */
export function drawNumbers(rng: Rng): Draw {
  // Partial Fisher-Yates over 1..45, take first 7.
  for (let i = 0; i < MAX_NUMBER; i++) scratch[i] = i + 1;
  for (let i = 0; i < PICK_COUNT + 1; i++) {
    const j = i + rng.nextInt(MAX_NUMBER - i);
    const t = scratch[i];
    scratch[i] = scratch[j];
    scratch[j] = t;
  }
  const numbers = Array.from(scratch.subarray(0, PICK_COUNT)).sort((a, b) => a - b);
  return { numbers, bonus: scratch[PICK_COUNT] };
}

/** Generate 6 unique numbers for a ticket (auto-select). */
export function autoPick(rng: Rng): number[] {
  return drawNumbers(rng).numbers;
}

export function rankFromMatches(matches: number, bonusMatched: boolean): Rank {
  if (matches === 6) return 1;
  if (matches === 5) return bonusMatched ? 2 : 3;
  if (matches === 4) return 4;
  if (matches === 3) return 5;
  return 0;
}

export function rankOf(ticket: TicketMask, draw: TicketMask, bonus: number): Rank {
  const matches = popcount(ticket.lo & draw.lo) + popcount(ticket.hi & draw.hi);
  if (matches !== 5) return rankFromMatches(matches, false);
  const bonusMatched =
    bonus <= 32 ? (ticket.lo & (1 << (bonus - 1))) !== 0 : (ticket.hi & (1 << (bonus - 33))) !== 0;
  return rankFromMatches(5, bonusMatched);
}

export type RankCounts = [number, number, number, number, number, number];

/** A single notable win, materialized only when the caller asked to be notified. */
export interface WinEvent {
  week: number;
  rank: Rank;
  ticket: number; // index into tickets
  numbers: number[]; // the draw
  bonus: number;
}

export interface SimState {
  weeks: number;
  games: number;
  spent: number;
  /** counts[rank] for rank 1..5 (index 0 unused) */
  counts: RankCounts;
  /** per-ticket counts, same layout as `counts` */
  ticketCounts: RankCounts[];
  bestRank: Rank;
  /** Highest-ranked win so far with its draw (ties: first occurrence) */
  bestWin: WinEvent | null;
  /** Draw at which the first prize occurred (null until then) */
  firstPrizeWeek: number | null;
  firstPrizeTicketIndex: number | null;
  lastDraw: Draw | null;
}

export function createSimState(ticketCount = 0): SimState {
  return {
    weeks: 0,
    games: 0,
    spent: 0,
    counts: [0, 0, 0, 0, 0, 0],
    ticketCounts: Array.from({ length: ticketCount }, () => [0, 0, 0, 0, 0, 0] as RankCounts),
    bestRank: 0,
    bestWin: null,
    firstPrizeWeek: null,
    firstPrizeTicketIndex: null,
    lastDraw: null,
  };
}

export interface RunOptions {
  /** Stop immediately when first prize hits (default true). */
  stopOnFirst?: boolean;
  /** Push wins with rank <= notifyRank into `wins` (default 0 = none). */
  notifyRank?: Rank;
  wins?: WinEvent[];
  /** Cap for `wins` so a fast run can't allocate unboundedly (default 16). */
  maxWins?: number;
}

/**
 * Run `weeks` weekly draws against the given ticket masks, mutating `state`.
 * Returns the number of weeks actually run (fewer if first prize hit).
 */
export function runWeeks(
  state: SimState,
  tickets: readonly TicketMask[],
  weeks: number,
  rng: Rng,
  opts: RunOptions = {},
): number {
  const stopOnFirst = opts.stopOnFirst ?? true;
  const notifyRank = opts.notifyRank ?? 0;
  const wins = opts.wins;
  const maxWins = opts.maxWins ?? 16;
  const perWeek = tickets.length;
  const costPerWeek = perWeek * GAME_PRICE;
  const counts = state.counts;
  if (state.ticketCounts.length !== perWeek) {
    state.ticketCounts = Array.from({ length: perWeek }, () => [0, 0, 0, 0, 0, 0] as RankCounts);
  }
  const ticketCounts = state.ticketCounts;
  let ran = 0;
  let lastBonus = 0;
  let hadDraw = false;

  for (; ran < weeks; ) {
    // Inline partial Fisher-Yates producing the draw mask directly (no array alloc / sort).
    for (let i = 0; i < MAX_NUMBER; i++) scratch[i] = i + 1;
    let lo = 0;
    let hi = 0;
    for (let i = 0; i < PICK_COUNT; i++) {
      const j = i + rng.nextInt(MAX_NUMBER - i);
      const n = scratch[j];
      scratch[j] = scratch[i];
      scratch[i] = n;
      if (n <= 32) lo |= 1 << (n - 1);
      else hi |= 1 << (n - 33);
    }
    const jb = PICK_COUNT + rng.nextInt(MAX_NUMBER - PICK_COUNT);
    const bonus = scratch[jb];
    scratch[jb] = scratch[PICK_COUNT];
    scratch[PICK_COUNT] = bonus;
    lastBonus = bonus;
    hadDraw = true;

    ran++;
    state.weeks++;
    state.games += perWeek;
    state.spent += costPerWeek;

    let hitFirst = -1;
    for (let t = 0; t < perWeek; t++) {
      const tk = tickets[t];
      const matches = popcount(tk.lo & lo) + popcount(tk.hi & hi);
      if (matches < 3) continue;
      let r: Rank;
      if (matches === 6) r = 1;
      else if (matches === 5) {
        const bm = bonus <= 32 ? (tk.lo & (1 << (bonus - 1))) !== 0 : (tk.hi & (1 << (bonus - 33))) !== 0;
        r = bm ? 2 : 3;
      } else if (matches === 4) r = 4;
      else r = 5;
      counts[r]++;
      ticketCounts[t][r]++;
      if (state.bestRank === 0 || r < state.bestRank) {
        state.bestRank = r;
        state.bestWin = { week: state.weeks, rank: r, ticket: t, numbers: materializeDraw(), bonus };
      }
      if (r <= notifyRank && wins && wins.length < maxWins) {
        wins.push({ week: state.weeks, rank: r, ticket: t, numbers: materializeDraw(), bonus });
      }
      if (r === 1 && hitFirst < 0) hitFirst = t;
    }
    if (hitFirst >= 0 && state.firstPrizeWeek === null) {
      state.firstPrizeWeek = state.weeks;
      state.firstPrizeTicketIndex = hitFirst;
      if (stopOnFirst) break;
    }
  }
  if (hadDraw) {
    // scratch[0..5] still holds the last draw, scratch[6] the bonus.
    state.lastDraw = { numbers: materializeDraw(), bonus: lastBonus };
  }
  return ran;
}

/** Sorted copy of the draw currently sitting in scratch[0..5]. */
function materializeDraw(): number[] {
  return Array.from(scratch.subarray(0, PICK_COUNT)).sort((a, b) => a - b);
}

/** Which of `ticket` numbers appear in the draw (for highlighting). */
export function matchedNumbers(ticket: readonly number[], draw: Draw): { hit: Set<number>; bonusHit: boolean } {
  const set = new Set(draw.numbers);
  const hit = new Set<number>();
  for (const n of ticket) if (set.has(n)) hit.add(n);
  return { hit, bonusHit: ticket.includes(draw.bonus) };
}

export function validateTicket(numbers: readonly number[]): boolean {
  if (numbers.length !== PICK_COUNT) return false;
  const seen = new Set<number>();
  for (const n of numbers) {
    if (!Number.isInteger(n) || n < 1 || n > MAX_NUMBER) return false;
    if (seen.has(n)) return false;
    seen.add(n);
  }
  return true;
}
