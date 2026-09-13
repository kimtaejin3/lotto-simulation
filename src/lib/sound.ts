/** Tiny synthesized sounds (no assets). All calls are no-ops until `unlock()` after a user gesture. */
let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) unlock();
}

export function unlock() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.08, when = 0) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  mark: () => tone(660, 0.08, "triangle", 0.05),
  pop: (i = 0) => tone(520 + i * 60, 0.12, "sine", 0.07),
  tick: () => tone(1200, 0.03, "square", 0.015),
  win: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.35, "triangle", 0.09, i * 0.09));
  },
};

export function haptic(ms: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    /* ignore */
  }
}
