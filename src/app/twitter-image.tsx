import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/lib/flags";

export const alt = "로또 1등까지 나는 몇 년 걸릴까? 평생 로또 시뮬레이터";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const jua = await readFile(join(process.cwd(), "src/assets/jua-og-subset.ttf"));

const BALLS: { n: number; c: string; t: string }[] = [
  { n: 3, c: "#FFC531", t: "#3D2A00" },
  { n: 11, c: "#4FB5F5", t: "#fff" },
  { n: 18, c: "#4FB5F5", t: "#fff" },
  { n: 27, c: "#FF6B6B", t: "#fff" },
  { n: 32, c: "#8E97A6", t: "#fff" },
  { n: 41, c: "#7DC95E", t: "#fff" },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "linear-gradient(160deg, #fff4f1 0%, #ffe1e8 100%)",
          fontFamily: "Jua",
          color: "#2b2330",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#ee3d62" }}>{SITE_NAME} · 평생 로또 시뮬레이터</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 92, lineHeight: 1.08 }}>
          <span>로또 1등까지</span>
          <span>
            나는 <span style={{ color: "#ee3d62", margin: "0 14px" }}>몇 년</span> 걸릴까?
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 32, color: "#6b5f68" }}>
          매주 로또를 산다면 1등까지 얼마나 걸릴까요? 직접 번호를 고르고 시간을 돌려보세요
        </div>
        <div style={{ display: "flex", marginTop: 46, gap: 22 }}>
          {BALLS.map((b) => (
            <div
              key={b.n}
              style={{
                width: 96,
                height: 96,
                borderRadius: 96,
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75) 0%, ${b.c} 45%, ${b.c} 100%)`,
                color: b.t,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
                boxShadow: "0 12px 24px rgba(80,30,45,0.25)",
              }}
            >
              {b.n}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 60,
            width: 260,
            height: 260,
            borderRadius: 260,
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(255,240,244,0.5) 55%, rgba(238,61,98,0.18) 100%)",
            border: "6px solid rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 30,
            gap: 6,
          }}
        >
          {[
            { n: 7, c: "#FFC531", t: "#3D2A00", y: 0 },
            { n: 23, c: "#FF6B6B", t: "#fff", y: -38 },
            { n: 45, c: "#7DC95E", t: "#fff", y: -6 },
            { n: 14, c: "#4FB5F5", t: "#fff", y: -60 },
          ].map((b) => (
            <div
              key={b.n}
              style={{
                width: 58,
                height: 58,
                borderRadius: 58,
                marginTop: b.y,
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75) 0%, ${b.c} 45%, ${b.c} 100%)`,
                color: b.t,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {b.n}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Jua", data: jua, style: "normal", weight: 400 }] },
  );
}
