import { describe, expect, it } from "vitest";
import { weeksToElapsed, formatElapsed, formatElapsedPrecise, splitElapsed, fmtKRW } from "./time";

describe("time", () => {
  it("weeksToElapsed", () => {
    expect(weeksToElapsed(0)).toEqual({ years: 0, months: 0, weeks: 0 });
    expect(weeksToElapsed(51)).toEqual({ years: 0, months: 11, weeks: 51 });
    expect(weeksToElapsed(52)).toEqual({ years: 1, months: 0, weeks: 0 });
    expect(weeksToElapsed(52 * 3 + 13)).toEqual({ years: 3, months: 3, weeks: 13 });
  });
  it("formatElapsed follows PRD unit rules", () => {
    expect(formatElapsed(0)).toBe("0주");
    expect(formatElapsed(12)).toBe("12주");
    expect(formatElapsed(52)).toBe("1년");
    expect(formatElapsed(52 + 26)).toBe("1년 6개월");
    expect(formatElapsed(52 * 99 + 4)).toBe("99년 0개월".replace(" 0개월", ""));
    expect(formatElapsed(52 * 100)).toBe("100년");
    expect(formatElapsed(52 * 153_428 + 17)).toBe("153,428년");
  });
  it("formatElapsedPrecise keeps remaining weeks for long spans", () => {
    expect(formatElapsedPrecise(52 * 153_428 + 17)).toBe("153,428년 17주");
    expect(formatElapsedPrecise(52 * 153_428)).toBe("153,428년");
  });
  it("splitElapsed", () => {
    expect(splitElapsed(10)).toEqual({ value: "10", unit: "주" });
    expect(splitElapsed(52 * 5 + 30)).toEqual({ value: "5", unit: "년", sub: "6개월" });
    expect(splitElapsed(52 * 12_583)).toEqual({ value: "12,583", unit: "년" });
  });
  it("fmtKRW", () => {
    expect(fmtKRW(39_891_540_000)).toBe("₩39,891,540,000");
  });
});
