/**
 * 황금손 추첨기: 방송에서 황금 장갑을 낀 출연자가 덕담 한마디를 하고
 * 추첨 버튼을 누르는 장면을 그대로 옮긴 모드.
 */

/** 기준점: 제1003회가 2022-02-19(토) 추첨이었다. 이후 매주 1회씩. */
const ANCHOR_ROUND = 1003;
const ANCHOR_DATE = Date.UTC(2022, 1, 19);
const DAY = 86_400_000;

/** 주어진 날짜 기준 가장 최근(또는 당일) 토요일 */
export function lastSaturday(from: Date = new Date()): Date {
  const d = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()));
  const back = (d.getUTCDay() + 1) % 7; // 토=6 → 0, 일=0 → 1 ...
  d.setUTCDate(d.getUTCDate() - back);
  return d;
}

/** 해당 추첨일의 회차 번호 */
export function roundOf(drawDate: Date): number {
  const weeks = Math.round((Date.UTC(drawDate.getFullYear(), drawDate.getMonth(), drawDate.getDate()) - ANCHOR_DATE) / (7 * DAY));
  return ANCHOR_ROUND + weeks;
}

/** yyyy-MM-dd */
export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** 1등 1게임 기준 당첨금 기본값 (실제 회차에서 흔히 나오는 규모) */
export const DEFAULT_PRIZE_PER_GAME = 1_811_116_822;

export const GAME_LETTERS = ["A", "B", "C", "D", "E"] as const;

/** 추첨 전 한마디 예시. 방송 덕담 톤. */
export const MESSAGE_PRESETS = [
  "이번 주, 보고 계신 모든 분께 행운이 가기를 바랍니다.",
  "고생하신 한 주였으니까, 오늘은 좋은 일 하나쯤 생겼으면 좋겠습니다.",
  "제 손끝에 담긴 행운, 여러분께 전해드리겠습니다.",
  "오래 기다리신 분들께 이번엔 꼭 돌아가길 바랍니다.",
  "떨리네요. 그래도 믿고 눌러보겠습니다.",
];

export function pickPreset(exclude?: string): string {
  const pool = MESSAGE_PRESETS.filter((m) => m !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const fmtWon = (n: number) => n.toLocaleString("ko-KR");
