"use client";
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * 황금 장갑을 낀 손. 검지를 아래로 뻗고 나머지 손가락은 말아 쥔 모양이라
 * 작은 크기에서도 실루엣만으로 읽힌다. 눌리면 버튼 쪽으로 내려간다.
 * 가로:세로 = 2:3.
 */
export function GoldenHand({ pressed, size = 110 }: { pressed: boolean; size?: number }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const g = (n: string) => `gh${uid}${n}`;

  return (
    <motion.svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 200 300"
      aria-hidden="true"
      initial={false}
      animate={reduce ? {} : pressed ? { y: 30, rotate: 0 } : { y: [0, -7, 0], rotate: -3 }}
      transition={
        pressed
          ? { type: "spring", stiffness: 520, damping: 26 }
          : { y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.4 } }
      }
      style={{ filter: "drop-shadow(0 10px 16px rgba(50,30,0,0.55))" }}
    >
      <defs>
        <linearGradient id={g("main")} x1="0.12" y1="0.02" x2="0.9" y2="0.95">
          <stop offset="0%" stopColor="#FFF9E0" />
          <stop offset="16%" stopColor="#FCE493" />
          <stop offset="42%" stopColor="#F2C544" />
          <stop offset="72%" stopColor="#D59A14" />
          <stop offset="100%" stopColor="#9A6A07" />
        </linearGradient>
        <linearGradient id={g("thumb")} x1="0.95" y1="0.1" x2="0.05" y2="0.9">
          <stop offset="0%" stopColor="#FDEEB4" />
          <stop offset="42%" stopColor="#EFC147" />
          <stop offset="100%" stopColor="#A5740A" />
        </linearGradient>
        <linearGradient id={g("cuff")} x1="0.1" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#FBEDBC" />
          <stop offset="45%" stopColor="#E3AE23" />
          <stop offset="100%" stopColor="#7F5503" />
        </linearGradient>
        <radialGradient id={g("hi")} cx="0.3" cy="0.2" r="0.6">
          <stop offset="0%" stopColor="#FFFFFA" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#FFFFFA" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("dark")} x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0%" stopColor="#54380A" stopOpacity="0" />
          <stop offset="100%" stopColor="#54380A" stopOpacity="0.46" />
        </linearGradient>
      </defs>

      <g stroke="#6F4A03" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* 엄지 */}
        <path
          d="M66 100 C42 94 21 113 21 139 C21 164 40 178 60 173 C74 169 80 154 77 139 L72 111 C70 102 73 101 66 100 Z"
          fill={`url(#${g("thumb")})`}
        />
        {/* 손등 + 말아 쥔 손가락 + 뻗은 검지 */}
        <path
          d="M58 52 H138 C158 52 173 61 173 80 C173 99 158 107 138 107 C157 107 171 115 171 133 C171 151 157 159 138 159 C154 159 166 165 166 179 C166 193 152 199 137 198 L112 194 C104 193 100 198 100 208 L101 264 C101 284 92 293 80 293 C68 293 59 284 59 264 L60 196 C60 186 56 180 50 176 C41 170 39 157 41 140 L45 77 C46 60 48 52 58 52 Z"
          fill={`url(#${g("main")})`}
        />
        {/* 소매 */}
        <path d="M52 5 H148 Q158 5 158 16 V45 Q158 57 148 57 H52 Q42 57 42 45 V16 Q42 5 52 5 Z" fill={`url(#${g("cuff")})`} />
      </g>

      {/* 소매 밴드와 주름 */}
      <path d="M42 39 H158 V45 Q158 57 148 57 H52 Q42 57 42 45 Z" fill="#FFF8E0" opacity="0.95" />
      <path d="M42 39 H158 V42 H42 Z" fill="#7F5503" opacity="0.4" />
      <g stroke="#9A6A07" strokeWidth="2.6" strokeLinecap="round" opacity="0.5">
        <path d="M70 15 V33" />
        <path d="M100 15 V33" />
        <path d="M130 15 V33" />
      </g>

      {/* 손가락 사이 음영과 측면 그늘 */}
      <path
        d="M138 107 C157 107 171 115 171 133 C171 151 157 159 138 159 C151 152 155 143 155 133 C155 121 149 111 138 107 Z"
        fill="#54380A"
        opacity="0.2"
      />
      <path
        d="M138 159 C154 159 166 165 166 179 C166 193 152 199 137 198 C148 192 151 186 151 178 C151 169 146 163 138 159 Z"
        fill="#54380A"
        opacity="0.2"
      />
      <path d="M130 54 Q169 63 169 116 Q170 172 140 197 L113 194 Q151 171 151 119 Q151 69 130 54 Z" fill={`url(#${g("dark")})`} />
      <path d="M96 200 Q101 234 100 264 Q100 282 90 290 Q97 265 96 230 Z" fill="#54380A" opacity="0.22" />

      {/* 광택 */}
      <ellipse cx="79" cy="86" rx="26" ry="15" fill={`url(#${g("hi")})`} transform="rotate(-28 79 86)" />
      <ellipse cx="72" cy="236" rx="8" ry="32" fill={`url(#${g("hi")})`} opacity="0.9" />
      <ellipse cx="38" cy="131" rx="7" ry="18" fill={`url(#${g("hi")})`} opacity="0.7" transform="rotate(14 38 131)" />

      {/* 봉제선 */}
      <g fill="none" stroke="#6F4A03" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" opacity="0.7">
        <path d="M60 70 Q100 62 140 71" />
        <path d="M60 200 Q80 194 100 199" />
        <path d="M60 246 Q80 241 100 246" />
      </g>
    </motion.svg>
  );
}
