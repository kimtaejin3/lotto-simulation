export const MIN_NUMBER = 1;
export const MAX_NUMBER = 45;
export const PICK_COUNT = 6;
export const GAME_PRICE = 1000; // KRW per game
export const WEEKS_PER_YEAR = 52;
export const GAMES_PER_SHEET = 5; // A~E

/** Official first-prize odds for 6/45: C(45,6) */
export const FIRST_PRIZE_ODDS = 8_145_060;

export type Rank = 0 | 1 | 2 | 3 | 4 | 5;

export const RANK_LABEL: Record<Rank, string> = {
  0: "낙첨",
  1: "1등",
  2: "2등",
  3: "3등",
  4: "4등",
  5: "5등",
};
