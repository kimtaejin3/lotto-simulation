import { ballColor } from "@/lib/lotto/balls";
import { formatElapsedPrecise, fmtInt, fmtKRW, weeksToElapsed } from "@/lib/lotto/time";
import { SITE_NAME, SITE_URL } from "@/lib/flags";

export interface ShareData {
  won: boolean;
  weeks: number;
  gamesPerWeek: number;
  spent: number;
  bestRank: number;
  bestCount: number;
  numbers?: number[]; // winning ticket when won
}

export function shareHeadline(d: ShareData): string {
  const y = weeksToElapsed(d.weeks).years;
  if (d.won) return `나는 로또 1등까지 ${formatElapsedPrecise(d.weeks)} 걸렸습니다.`;
  return `저는 ${y >= 1 ? `${fmtInt(y)}년` : `${d.weeks}주`} 동안 로또를 샀지만 아직 1등이 안 나왔습니다.`;
}

/** Render a 1080x1920 share card and return a PNG blob. */
export async function renderShareCard(d: ShareData): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const display = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "system-ui";
  const body = getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() || "system-ui";
  // Korean web fonts are served in unicode-range slices; pass the actual text so every needed slice loads.
  const sample = `로또 6/45 시뮬레이션 결과 나는 1등까지 걸렸습니다 저는 년 주 동안 샀지만 아직 이 안 나왔습니다 매주 구매 게임 진행 회차 총 사용 금액 최고 당첨 없음 회 당신은 몇 걸릴까요 어디까지 버틸 수 있나요 ${SITE_NAME} 0123456789₩,`;
  try {
    await Promise.all([document.fonts.load(`80px ${display}`, sample), document.fonts.load(`40px ${body}`, sample)]);
  } catch {
    /* fonts optional */
  }

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#fff4f1");
  bg.addColorStop(1, "#ffe1e8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(238,61,98,0.12)";
  for (let y = 40; y < H; y += 44) for (let x = 40; x < W; x += 44) ctx.fillRect(x, y, 3, 3);

  // ticket paper
  const px = 90;
  const py = 260;
  const pw = W - px * 2;
  const ph = 1460;
  ctx.save();
  ctx.shadowColor = "rgba(80,30,45,0.25)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 30;
  ctx.fillStyle = "#fffdfc";
  perforatedRect(ctx, px, py, pw, ph, 18);
  ctx.fill();
  ctx.restore();

  const cx = W / 2;
  ctx.textAlign = "center";
  ctx.fillStyle = "#d8386a";
  ctx.font = `64px ${display}`;
  ctx.fillText("로또 6/45  시뮬레이션 결과", cx, py + 120);
  dashed(ctx, px + 60, py + 170, px + pw - 60);

  // headline
  ctx.fillStyle = "#2b2330";
  const y0 = py + 300;
  if (d.won) {
    ctx.font = `56px ${display}`;
    ctx.fillText("나는 로또 1등까지", cx, y0);
    ctx.font = `112px ${display}`;
    ctx.fillStyle = "#ee3d62";
    ctx.fillText(formatElapsedPrecise(d.weeks), cx, y0 + 150);
    ctx.fillStyle = "#2b2330";
    ctx.font = `56px ${display}`;
    ctx.fillText("걸렸습니다.", cx, y0 + 250);
  } else {
    const y = weeksToElapsed(d.weeks).years;
    ctx.font = `56px ${display}`;
    ctx.fillText("저는", cx, y0);
    ctx.font = `112px ${display}`;
    ctx.fillStyle = "#ee3d62";
    ctx.fillText(y >= 1 ? `${fmtInt(y)}년 동안` : `${d.weeks}주 동안`, cx, y0 + 150);
    ctx.fillStyle = "#2b2330";
    ctx.font = `56px ${display}`;
    ctx.fillText("로또를 샀지만", cx, y0 + 250);
    ctx.fillText("아직 1등이 안 나왔습니다.", cx, y0 + 330);
  }

  // numbers
  if (d.numbers && d.numbers.length === 6) {
    const r = 46;
    const gap = 22;
    const total = 6 * r * 2 + 5 * gap;
    let x = cx - total / 2 + r;
    const y = y0 + 430;
    for (const n of d.numbers) {
      const c = ballColor(n);
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, c.light);
      g.addColorStop(0.55, c.base);
      g.addColorStop(1, c.dark);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.fillStyle = c.text === "#FFFFFF" ? "#fff" : c.text;
      ctx.font = `44px ${display}`;
      ctx.fillText(String(n), x, y + 16);
      x += r * 2 + gap;
    }
  }

  // stats
  dashed(ctx, px + 60, 1080, px + pw - 60);
  const rows: [string, string][] = [
    ["매주 구매", `${d.gamesPerWeek}게임`],
    ["진행 회차", `${fmtInt(d.weeks)}회`],
    ["총 사용 금액", fmtKRW(d.spent)],
    [d.won ? "1등" : "최고 당첨", d.won ? "1회" : d.bestRank ? `${d.bestRank}등 ${fmtInt(d.bestCount)}회` : "없음"],
  ];
  let ry = 1140;
  for (const [k, v] of rows) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#8a7f86";
    ctx.font = `36px ${body}`;
    ctx.fillText(k, px + 80, ry);
    ctx.textAlign = "right";
    ctx.fillStyle = "#2b2330";
    ctx.font = `48px ${display}`;
    ctx.fillText(v, px + pw - 80, ry);
    ry += 96;
  }
  dashed(ctx, px + 60, 1470, px + pw - 60);

  ctx.textAlign = "center";
  ctx.fillStyle = "#d8386a";
  ctx.font = `52px ${display}`;
  ctx.fillText(d.won ? "당신은 몇 년 걸릴까요?" : "당신은 어디까지 버틸 수 있나요?", cx, 1560);

  // barcode-ish
  ctx.fillStyle = "#2b2330";
  let bx = px + 120;
  let seed = d.weeks || 7;
  while (bx < px + pw - 120) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const w = 3 + (seed % 4) * 2;
    ctx.fillRect(bx, 1610, w, 64);
    bx += w + 4 + (seed % 3) * 3;
  }

  // footer
  ctx.fillStyle = "#ee3d62";
  ctx.font = `60px ${display}`;
  ctx.fillText(SITE_NAME, cx, H - 105);
  ctx.fillStyle = "#8a7f86";
  ctx.font = `30px ${body}`;
  ctx.fillText(SITE_URL.replace(/^https?:\/\//, ""), cx, H - 55);

  return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
}

function dashed(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number) {
  ctx.save();
  ctx.strokeStyle = "#f0a3b6";
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 14]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

function perforatedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, notch: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  // top edge with scallops
  const n = Math.floor(w / (notch * 2));
  const step = w / n;
  for (let i = 0; i < n; i++) {
    const sx = x + i * step;
    ctx.lineTo(sx, y);
    ctx.arc(sx + step / 2, y, step / 2 - 3, Math.PI, 0, true);
  }
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  for (let i = n - 1; i >= 0; i--) {
    const sx = x + i * step;
    ctx.lineTo(sx + step, y + h);
    ctx.arc(sx + step / 2, y + h, step / 2 - 3, 0, Math.PI, true);
  }
  ctx.lineTo(x, y + h);
  ctx.closePath();
}
