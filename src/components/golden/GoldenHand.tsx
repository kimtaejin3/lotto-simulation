"use client";
import { motion, useReducedMotion } from "motion/react";

/**
 * 황금 장갑을 낀 손이 추첨 버튼 위에 떠 있다가 눌러 내려간다.
 * 실제 방송 장면을 그대로 베끼지 않고 실루엣만 단순화했다.
 */
export function GoldenHand({ pressed, size = 150 }: { pressed: boolean; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      width={size}
      height={size * (160 / 120)}
      viewBox="0 0 120 160"
      aria-hidden="true"
      initial={false}
      animate={reduce ? {} : pressed ? { y: 26, rotate: 0 } : { y: [0, -6, 0], rotate: -3 }}
      transition={
        pressed
          ? { type: "spring", stiffness: 500, damping: 24 }
          : { y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.4 } }
      }
      style={{ filter: "drop-shadow(0 12px 18px rgba(80,50,0,0.35))" }}
    >
      <defs>
        <linearGradient id="goldSkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0B8" />
          <stop offset="35%" stopColor="#F5C842" />
          <stop offset="75%" stopColor="#D9A017" />
          <stop offset="100%" stopColor="#A8720A" />
        </linearGradient>
        <linearGradient id="goldCuff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8B534" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>

      {/* 소매 */}
      <rect x="18" y="0" width="84" height="30" rx="9" fill="url(#goldCuff)" />
      <rect x="18" y="22" width="84" height="7" fill="#FFF6D8" opacity="0.75" />

      {/* 손등 */}
      <rect x="22" y="26" width="76" height="72" rx="24" fill="url(#goldSkin)" />
      {/* 손가락 마디 결 */}
      <g stroke="#B8860B" strokeWidth="2" strokeLinecap="round" opacity="0.45">
        <line x1="44" y1="40" x2="44" y2="74" />
        <line x1="60" y1="38" x2="60" y2="76" />
        <line x1="76" y1="40" x2="76" y2="74" />
      </g>
      {/* 검지 */}
      <rect x="50" y="92" width="20" height="48" rx="10" fill="url(#goldSkin)" />
      <ellipse cx="60" cy="136" rx="9" ry="7" fill="#FFF0B8" opacity="0.65" />
      {/* 하이라이트 */}
      <ellipse cx="42" cy="44" rx="13" ry="8" fill="#FFFBEA" opacity="0.55" transform="rotate(-20 42 44)" />
    </motion.svg>
  );
}
