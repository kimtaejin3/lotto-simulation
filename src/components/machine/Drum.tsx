"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ballColor } from "@/lib/lotto/balls";

interface Props {
  /** 0 = resting, 1 = gentle mixing, up to 3 = frantic */
  agitation: number;
  /** Increment to trigger a "draw" pulse: highlighted balls fly to the outlet */
  drawKey: number;
  drawn: number[];
  className?: string;
}

interface B {
  n: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  exiting: number; // 0 = no, else timestamp when exit began
  hidden: boolean;
  spin: number;
}

/**
 * Canvas lottery drum: a glass sphere with 45 bouncing balls, lightly
 * physics-driven. Deliberately toy-like rather than photoreal.
 */
export function Drum({ agitation, drawKey, drawn, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balls = useRef<B[]>([]);
  const agit = useRef(agitation);
  const drawnRef = useRef(drawn);
  const lastDrawKey = useRef(drawKey);
  const reduce = useReducedMotion();

  useEffect(() => {
    agit.current = agitation;
    drawnRef.current = drawn;
  }, [agitation, drawn]);

  useEffect(() => {
    if (drawKey === lastDrawKey.current) return;
    lastDrawKey.current = drawKey;
    const now = performance.now();
    const set = new Set(drawnRef.current);
    for (const b of balls.current) {
      if (set.has(b.n) && !b.hidden) b.exiting = now;
    }
  }, [drawKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let last = performance.now();

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H * 0.86) * 0.44;
      cx = W / 2;
      cy = H * 0.46;
      const r = R * 0.105;
      if (balls.current.length === 0) {
        const arr: B[] = [];
        for (let n = 1; n <= 45; n++) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.sqrt(Math.random()) * (R - r) * 0.9;
          arr.push({ n, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: 0, vy: 0, r, exiting: 0, hidden: false, spin: 0 });
        }
        balls.current = arr;
      } else {
        for (const b of balls.current) b.r = r;
      }
    };

    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    init();

    const step = (dt: number, now: number) => {
      const a = agit.current;
      const bs = balls.current;
      const g = 1400;
      for (const b of bs) {
        if (b.hidden) {
          if (now - b.exiting > 1400) {
            b.hidden = false;
            b.exiting = 0;
            b.x = cx + (Math.random() - 0.5) * R * 0.6;
            b.y = cy - R * 0.6;
            b.vx = (Math.random() - 0.5) * 200;
            b.vy = 0;
          }
          continue;
        }
        if (b.exiting) {
          // steer to the outlet at the bottom of the sphere
          const tx = cx;
          const ty = cy + R + b.r * 0.5;
          b.vx += (tx - b.x) * 18 * dt;
          b.vy += (ty - b.y) * 18 * dt;
          b.vx *= 0.9;
          b.vy *= 0.9;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (now - b.exiting > 700) b.hidden = true;
          continue;
        }
        // gravity + air jet (from the bottom, stronger with agitation)
        b.vy += g * dt;
        if (a > 0) {
          const dx = b.x - cx;
          const dy = b.y - (cy + R);
          const dist = Math.hypot(dx, dy) + 1;
          const jet = (a * 5200 * Math.max(0, 1 - dist / (R * 1.4))) / 1;
          b.vy -= jet * dt * (0.6 + Math.random() * 0.8);
          b.vx += (Math.random() - 0.5) * a * 1600 * dt + (dx / dist) * jet * 0.25 * dt;
        }
        b.vx *= 1 - 0.35 * dt;
        b.vy *= 1 - 0.35 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.spin += b.vx * dt * 0.02;
        // sphere wall
        const dx = b.x - cx;
        const dy = b.y - cy;
        const d = Math.hypot(dx, dy);
        const maxD = R - b.r - 2;
        if (d > maxD) {
          const nx = dx / d;
          const ny = dy / d;
          b.x = cx + nx * maxD;
          b.y = cy + ny * maxD;
          const vn = b.vx * nx + b.vy * ny;
          if (vn > 0) {
            b.vx -= (1 + 0.55) * vn * nx;
            b.vy -= (1 + 0.55) * vn * ny;
          }
        }
      }
      // ball-ball separation (cheap positional correction)
      for (let i = 0; i < bs.length; i++) {
        const p = bs[i];
        if (p.hidden || p.exiting) continue;
        for (let j = i + 1; j < bs.length; j++) {
          const q = bs[j];
          if (q.hidden || q.exiting) continue;
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const minD = p.r + q.r;
          const d2 = dx * dx + dy * dy;
          if (d2 < minD * minD && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const ov = (minD - d) / 2;
            const nx = dx / d;
            const ny = dy / d;
            p.x -= nx * ov;
            p.y -= ny * ov;
            q.x += nx * ov;
            q.y += ny * ov;
            const rvx = q.vx - p.vx;
            const rvy = q.vy - p.vy;
            const vn = rvx * nx + rvy * ny;
            if (vn < 0) {
              const imp = -vn * 0.75;
              p.vx -= nx * imp;
              p.vy -= ny * imp;
              q.vx += nx * imp;
              q.vy += ny * imp;
            }
          }
        }
      }
    };

    const drawBall = (b: B, now: number) => {
      const c = ballColor(b.n);
      let alpha = 1;
      if (b.exiting) alpha = Math.max(0, 1 - (now - b.exiting - 450) / 250);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(b.x, b.y);
      const grad = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.4, b.r * 0.1, 0, 0, b.r);
      grad.addColorStop(0, c.light);
      grad.addColorStop(0.55, c.base);
      grad.addColorStop(1, c.dark);
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // number window
      ctx.beginPath();
      ctx.arc(0, 0, b.r * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = c.text === "#FFFFFF" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.38)";
      ctx.fill();
      ctx.fillStyle = c.text === "#FFFFFF" ? "#fff" : c.text;
      ctx.font = `${Math.round(b.r * 0.95)}px var(--font-display), system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(b.n), 0, b.r * 0.05);
      // highlight
      ctx.beginPath();
      ctx.ellipse(-b.r * 0.3, -b.r * 0.45, b.r * 0.32, b.r * 0.18, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();
      ctx.restore();
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      // pedestal
      const pedW = R * 1.1;
      ctx.save();
      const ped = ctx.createLinearGradient(0, cy + R * 0.95, 0, cy + R * 1.27);
      ped.addColorStop(0, "rgba(238,61,98,0.28)");
      ped.addColorStop(1, "rgba(238,61,98,0.12)");
      ctx.fillStyle = ped;
      roundRect(ctx, cx - pedW / 2, cy + R * 0.95, pedW, R * 0.32, 18);
      ctx.fill();
      ctx.restore();
      // outlet chute (glass tube)
      ctx.save();
      const tube = ctx.createLinearGradient(cx - R * 0.14, 0, cx + R * 0.14, 0);
      tube.addColorStop(0, "rgba(255,255,255,0.35)");
      tube.addColorStop(0.5, "rgba(255,255,255,0.75)");
      tube.addColorStop(1, "rgba(255,255,255,0.3)");
      ctx.fillStyle = tube;
      roundRect(ctx, cx - R * 0.14, cy + R * 0.85, R * 0.28, R * 0.32, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(238,61,98,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      // glass sphere back
      const glass = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      glass.addColorStop(0, "rgba(255,255,255,0.75)");
      glass.addColorStop(0.6, "rgba(255,240,244,0.35)");
      glass.addColorStop(1, "rgba(238,61,98,0.10)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = glass;
      ctx.fill();
      // balls (clipped)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
      ctx.clip();
      for (const b of balls.current) if (!b.hidden) drawBall(b, now);
      ctx.restore();
      // glass front: rim + highlights
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(3, R * 0.03);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, R + ctx.lineWidth * 0.9, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(238,61,98,0.35)";
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx - R * 0.42, cy - R * 0.5, R * 0.28, R * 0.12, -0.7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.93, Math.PI * 0.15, Math.PI * 0.45);
      ctx.lineWidth = R * 0.03;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!reduce) step(dt, now);
      render(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
