import { WEEKS_PER_YEAR } from "./constants";

export interface Elapsed {
  years: number;
  months: number;
  weeks: number; // remaining weeks within the year (0..51)
}

const WEEKS_PER_MONTH = WEEKS_PER_YEAR / 12;

export function weeksToElapsed(totalWeeks: number): Elapsed {
  const years = Math.floor(totalWeeks / WEEKS_PER_YEAR);
  const rem = totalWeeks - years * WEEKS_PER_YEAR;
  const months = Math.floor(rem / WEEKS_PER_MONTH);
  return { years, months, weeks: rem };
}

export const fmtInt = (n: number): string => Math.floor(n).toLocaleString("ko-KR");

export const fmtKRW = (n: number): string => `₩${fmtInt(n)}`;

/**
 * Headline time string according to PRD:
 *  - < 1 year:   "N주"
 *  - 1..99 years: "N년 M개월"
 *  - >= 100 years: "N년" (comma separated)
 */
export function formatElapsed(totalWeeks: number): string {
  const e = weeksToElapsed(totalWeeks);
  if (e.years === 0) return `${e.weeks}주`;
  if (e.years < 100) return e.months > 0 ? `${e.years}년 ${e.months}개월` : `${e.years}년`;
  return `${fmtInt(e.years)}년`;
}

/** Precise variant for result screens: "153,428년 17주" / "3년 2개월" / "12주" */
export function formatElapsedPrecise(totalWeeks: number): string {
  const e = weeksToElapsed(totalWeeks);
  if (e.years === 0) return `${e.weeks}주`;
  if (e.years < 100) return e.months > 0 ? `${e.years}년 ${e.months}개월` : `${e.years}년`;
  return e.weeks > 0 ? `${fmtInt(e.years)}년 ${e.weeks}주` : `${fmtInt(e.years)}년`;
}

/** Split for the big counter: primary number + unit + optional secondary */
export function splitElapsed(totalWeeks: number): { value: string; unit: string; sub?: string } {
  const e = weeksToElapsed(totalWeeks);
  if (e.years === 0) return { value: String(e.weeks), unit: "주" };
  if (e.years < 100) return { value: String(e.years), unit: "년", sub: `${e.months}개월` };
  return { value: fmtInt(e.years), unit: "년" };
}

/** Human scale comparison used on result screen, e.g. "인류 문명 30번" */
export function scaleComparison(years: number): string | null {
  if (years >= 200_000) return `호모 사피엔스가 등장한 뒤 지금까지보다 긴 시간이에요.`;
  if (years >= 50_000) return `구석기 시대 사람이 지금까지 매주 로또를 산 셈이에요.`;
  if (years >= 10_000) return `농경이 시작된 뒤 지금까지 매주 샀다면 이 정도예요.`;
  if (years >= 5_000) return `피라미드가 세워진 뒤 지금까지 매주 산 시간보다 길어요.`;
  if (years >= 2_000) return `로마 제국 시절부터 매주 로또를 샀다면 이 정도예요.`;
  if (years >= 500) return `조선 건국 즈음부터 매주 로또를 산 시간이에요.`;
  if (years >= 100) return `증조할아버지 때부터 지금까지 매주 산 시간이에요.`;
  return null;
}
