"use client";
import { motion, useReducedMotion } from "motion/react";
import { Ball } from "@/components/ui/Ball";
import { MiniTicket } from "@/components/ticket/MiniTicket";

const TICKET = [
  [3, 11, 18, 27, 32, 41],
  [7, 14, 22, 29, 36, 44],
  [1, 9, 20, 25, 38, 45],
  [5, 13, 19, 31, 40, 43],
  [8, 16, 23, 30, 34, 42],
];
const FLOATERS: { n: number; x: string; y: string; s: number; d: number }[] = [
  { n: 7, x: "4%", y: "8%", s: 64, d: 0 },
  { n: 23, x: "78%", y: "2%", s: 52, d: 0.6 },
  { n: 41, x: "86%", y: "58%", s: 72, d: 1.1 },
  { n: 14, x: "0%", y: "66%", s: 48, d: 1.7 },
  { n: 33, x: "62%", y: "84%", s: 40, d: 0.3 },
];

export function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-[4/3.6] w-full max-w-[420px] lg:max-w-[520px]">
      <motion.div
        className="absolute left-1/2 top-1/2"
        initial={reduce ? false : { rotate: -12, y: 30, opacity: 0 }}
        animate={{ rotate: -7, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        style={{ x: "-50%", translateY: "-50%" }}
      >
        <MiniTicket numbers={TICKET} className="sm:scale-110 lg:scale-125" />
      </motion.div>
      {FLOATERS.map((f) => (
        <motion.div
          key={f.n}
          className="absolute"
          style={{ left: f.x, top: f.y }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={reduce ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: [0, -10, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 300, damping: 16, delay: 0.3 + f.d * 0.3 },
            opacity: { delay: 0.3 + f.d * 0.3 },
            y: { duration: 3 + f.d, repeat: Infinity, ease: "easeInOut", delay: f.d },
          }}
        >
          <Ball n={f.n} size={f.s} className="drop-shadow-[0_10px_14px_rgba(80,30,45,0.25)]" />
        </motion.div>
      ))}
    </div>
  );
}
