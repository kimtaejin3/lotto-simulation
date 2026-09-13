/**
 * Ball color bands loosely follow the familiar Korean 6/45 convention
 * (1-10 yellow, 11-20 blue, 21-30 red, 31-40 gray, 41-45 green) but with
 * our own softer, toy-like palette.
 */
export interface BallColor {
  base: string;
  light: string;
  dark: string;
  text: string;
}

export const BALL_BANDS: BallColor[] = [
  { base: "#FFC531", light: "#FFE38A", dark: "#E09A00", text: "#3D2A00" }, // 1-10
  { base: "#4FB5F5", light: "#A6DDFF", dark: "#1F7FC2", text: "#FFFFFF" }, // 11-20
  { base: "#FF6B6B", light: "#FFB0B0", dark: "#D63A3A", text: "#FFFFFF" }, // 21-30
  { base: "#8E97A6", light: "#C9CFD9", dark: "#5C6573", text: "#FFFFFF" }, // 31-40
  { base: "#7DC95E", light: "#BDEBA6", dark: "#4E9A31", text: "#FFFFFF" }, // 41-45
];

export function ballColor(n: number): BallColor {
  const idx = Math.min(4, Math.max(0, Math.floor((n - 1) / 10)));
  return BALL_BANDS[idx];
}
