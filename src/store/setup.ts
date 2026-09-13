"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { autoPick } from "@/lib/lotto/engine";
import { CryptoRng } from "@/lib/lotto/rng";

export type TicketMode = "manual" | "auto";
export interface TicketGame {
  numbers: number[]; // 0..6 numbers while editing; must be 6 to start
  mode: TicketMode;
}

export const PRESETS = [1, 5, 10, 20] as const;
export const MAX_GAMES = 100;

interface SetupState {
  gamesPerWeek: number;
  games: TicketGame[];
  soundOn: boolean;
  setGamesPerWeek: (n: number) => void;
  toggleNumber: (game: number, n: number) => void;
  autoGame: (game: number) => void;
  autoAll: () => void;
  clearGame: (game: number) => void;
  setSound: (on: boolean) => void;
  reshuffleAll: () => void;
}

const rng = new CryptoRng();

function ensureGames(games: TicketGame[], n: number): TicketGame[] {
  const out = games.slice(0, n);
  while (out.length < n) out.push({ numbers: [], mode: "manual" });
  return out;
}

export const useSetup = create<SetupState>()(
  persist(
    (set, get) => ({
      gamesPerWeek: 5,
      games: ensureGames([], 5),
      soundOn: false,
      setGamesPerWeek: (n) => {
        const clamped = Math.max(1, Math.min(MAX_GAMES, Math.floor(n) || 1));
        set({ gamesPerWeek: clamped, games: ensureGames(get().games, clamped) });
      },
      toggleNumber: (gi, n) =>
        set((s) => {
          const games = s.games.map((g, i) => {
            if (i !== gi) return g;
            const has = g.numbers.includes(n);
            if (has) return { mode: "manual" as const, numbers: g.numbers.filter((x) => x !== n) };
            if (g.numbers.length >= 6) return g;
            return { mode: "manual" as const, numbers: [...g.numbers, n].sort((a, b) => a - b) };
          });
          return { games };
        }),
      autoGame: (gi) =>
        set((s) => ({
          games: s.games.map((g, i) => (i === gi ? { mode: "auto", numbers: autoPick(rng) } : g)),
        })),
      autoAll: () =>
        set((s) => {
          const allFull = s.games.every((g) => g.numbers.length === 6);
          // First press fills the blanks; pressing again when everything is full reshuffles all.
          return { games: s.games.map((g) => (g.numbers.length === 6 && !allFull ? g : { mode: "auto", numbers: autoPick(rng) })) };
        }),
      reshuffleAll: () => set((s) => ({ games: s.games.map(() => ({ mode: "auto", numbers: autoPick(rng) })) })),
      clearGame: (gi) =>
        set((s) => ({ games: s.games.map((g, i) => (i === gi ? { mode: "manual", numbers: [] } : g)) })),
      setSound: (on) => set({ soundOn: on }),
    }),
    {
      name: "lotto-life-setup",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    },
  ),
);

export const isSetupComplete = (games: TicketGame[]) => games.length > 0 && games.every((g) => g.numbers.length === 6);
