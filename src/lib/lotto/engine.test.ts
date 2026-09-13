import { describe, expect, it } from "vitest";
import { drawNumbers, autoPick, rankOf, toMask, popcount, runWeeks, createSimState, validateTicket, rankFromMatches, matchedNumbers, type WinEvent } from "./engine";
import { Xoshiro128ss, CryptoRng } from "./rng";
import { GAME_PRICE, FIRST_PRIZE_ODDS } from "./constants";

const rng = new Xoshiro128ss(new Uint32Array([1, 2, 3, 4]));

describe("drawNumbers", () => {
  it("generates 6 unique ascending numbers in 1..45 and a non-overlapping bonus", () => {
    for (let i = 0; i < 5000; i++) {
      const d = drawNumbers(rng);
      expect(d.numbers).toHaveLength(6);
      expect(new Set(d.numbers).size).toBe(6);
      for (const n of d.numbers) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(45);
      }
      for (let k = 1; k < 6; k++) expect(d.numbers[k]).toBeGreaterThan(d.numbers[k - 1]);
      expect(d.bonus).toBeGreaterThanOrEqual(1);
      expect(d.bonus).toBeLessThanOrEqual(45);
      expect(d.numbers).not.toContain(d.bonus);
    }
  });

  it("autoPick with crypto rng is valid", () => {
    const c = new CryptoRng();
    for (let i = 0; i < 200; i++) expect(validateTicket(autoPick(c))).toBe(true);
  });

  it("is roughly uniform over 1..45", () => {
    const hist = new Array(46).fill(0);
    const N = 45_000;
    for (let i = 0; i < N; i++) for (const n of drawNumbers(rng).numbers) hist[n]++;
    const expected = (N * 6) / 45; // 6000
    for (let n = 1; n <= 45; n++) {
      expect(hist[n]).toBeGreaterThan(expected * 0.9);
      expect(hist[n]).toBeLessThan(expected * 1.1);
    }
  });
});

describe("masks", () => {
  it("popcount is correct", () => {
    expect(popcount(0)).toBe(0);
    expect(popcount(0xffffffff)).toBe(32);
    expect(popcount(0b1011)).toBe(3);
  });
  it("toMask round-trips across the lo/hi boundary", () => {
    const m = toMask([1, 32, 33, 45]);
    expect(popcount(m.lo)).toBe(2);
    expect(popcount(m.hi)).toBe(2);
    expect(m.lo & 1).toBe(1);
    expect(m.lo & (1 << 31)).not.toBe(0);
    expect(m.hi & 1).toBe(1);
    expect(m.hi & (1 << 12)).not.toBe(0);
  });
});

describe("rank", () => {
  const draw = toMask([3, 11, 18, 27, 32, 41]);
  const bonus = 45;
  it("1등: 6 match", () => expect(rankOf(toMask([3, 11, 18, 27, 32, 41]), draw, bonus)).toBe(1));
  it("2등: 5 + bonus", () => expect(rankOf(toMask([3, 11, 18, 27, 32, 45]), draw, bonus)).toBe(2));
  it("3등: 5 without bonus", () => expect(rankOf(toMask([3, 11, 18, 27, 32, 44]), draw, bonus)).toBe(3));
  it("4등: 4 match", () => expect(rankOf(toMask([3, 11, 18, 27, 1, 2]), draw, bonus)).toBe(4));
  it("5등: 3 match", () => expect(rankOf(toMask([3, 11, 18, 1, 2, 4]), draw, bonus)).toBe(5));
  it("낙첨: 2 match", () => expect(rankOf(toMask([3, 11, 1, 2, 4, 5]), draw, bonus)).toBe(0));
  it("bonus alone doesn't count", () => expect(rankOf(toMask([1, 2, 4, 5, 6, 45]), draw, bonus)).toBe(0));
  it("rankFromMatches", () => {
    expect(rankFromMatches(6, false)).toBe(1);
    expect(rankFromMatches(5, true)).toBe(2);
    expect(rankFromMatches(5, false)).toBe(3);
    expect(rankFromMatches(4, true)).toBe(4);
    expect(rankFromMatches(3, false)).toBe(5);
    expect(rankFromMatches(2, true)).toBe(0);
  });
});

describe("runWeeks", () => {
  it("tracks weeks, games and spend for 5 games/week", () => {
    const s = createSimState();
    const tickets = Array.from({ length: 5 }, () => toMask(autoPick(rng)));
    const ran = runWeeks(s, tickets, 1000, rng);
    expect(ran).toBeLessThanOrEqual(1000);
    expect(s.weeks).toBe(ran);
    expect(s.games).toBe(ran * 5);
    expect(s.spent).toBe(ran * 5 * GAME_PRICE);
    expect(s.lastDraw).not.toBeNull();
  });

  it("stops at first prize and records the week", () => {
    // Force a hit by using a rigged rng-free approach: run until first prize with a
    // fixed seed and many tickets. 1000 tickets * ~20k weeks ≈ 2.4 expected hits.
    const tickets = Array.from({ length: 1000 }, () => toMask(autoPick(rng)));
    const s = createSimState();
    runWeeks(s, tickets, 200_000, rng);
    expect(s.firstPrizeWeek).not.toBeNull();
    expect(s.firstPrizeWeek).toBe(s.weeks);
    expect(s.counts[1]).toBe(1);
    expect(s.bestRank).toBe(1);
  });

  it("5등 frequency matches theory (~1/45 per game)", () => {
    // P(3 match) = C(6,3)*C(39,3)/C(45,6) = 182780/8145060 ≈ 0.02244
    const tickets = Array.from({ length: 10 }, () => toMask(autoPick(rng)));
    const s = createSimState();
    const weeks = 50_000;
    runWeeks(s, tickets, weeks, rng, { stopOnFirst: false });
    const games = weeks * 10;
    const p5 = s.counts[5] / games;
    expect(p5).toBeGreaterThan(0.0224 * 0.95);
    expect(p5).toBeLessThan(0.0224 * 1.05);
    // P(4 match) = C(6,4)*C(39,2)/C(45,6) = 11115/8145060 ≈ 0.0013646
    const p4 = s.counts[4] / games;
    expect(p4).toBeGreaterThan(0.0013646 * 0.85);
    expect(p4).toBeLessThan(0.0013646 * 1.15);
  });

  it("per-ticket counts sum to totals and notable wins carry a valid draw", () => {
    const tickets = Array.from({ length: 7 }, () => toMask(autoPick(rng)));
    const s = createSimState(tickets.length);
    const wins: WinEvent[] = [];
    runWeeks(s, tickets, 20_000, rng, { stopOnFirst: false, notifyRank: 4, wins, maxWins: 50 });
    for (let r = 1; r <= 5; r++) {
      const sum = s.ticketCounts.reduce((a, tc) => a + tc[r], 0);
      expect(sum).toBe(s.counts[r]);
    }
    expect(wins.length).toBeGreaterThan(0);
    expect(wins.length).toBeLessThanOrEqual(50);
    for (const w of wins) {
      expect(w.rank).toBeLessThanOrEqual(4);
      expect(w.rank).toBeGreaterThanOrEqual(1);
      expect(validateTicket(w.numbers)).toBe(true);
      expect(w.numbers).not.toContain(w.bonus);
      expect(w.week).toBeGreaterThan(0);
      expect(w.week).toBeLessThanOrEqual(s.weeks);
    }
    expect(s.bestWin).not.toBeNull();
    expect(s.bestWin!.rank).toBe(s.bestRank);
  });

  it("matchedNumbers highlights hits and bonus", () => {
    const m = matchedNumbers([3, 11, 18, 27, 32, 45], { numbers: [3, 11, 18, 27, 32, 41], bonus: 45 });
    expect([...m.hit].sort((a, b) => a - b)).toEqual([3, 11, 18, 27, 32]);
    expect(m.bonusHit).toBe(true);
  });

  it("first prize odds sanity: 8,145,060", () => {
    // C(45,6)
    let c = 1;
    for (let i = 0; i < 6; i++) c = (c * (45 - i)) / (i + 1);
    expect(c).toBe(FIRST_PRIZE_ODDS);
  });
});
