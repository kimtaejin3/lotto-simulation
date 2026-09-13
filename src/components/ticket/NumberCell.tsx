"use client";
import { motion, useReducedMotion } from "motion/react";

interface Props {
  n: number;
  marked: boolean;
  disabled?: boolean;
  onToggle?: (n: number) => void;
  size?: "sm" | "md";
}

export function NumberCell({ n, marked, disabled, onToggle, size = "md" }: Props) {
  const reduce = useReducedMotion();
  const h = size === "md" ? "h-9" : "h-7";
  return (
    <button
      type="button"
      aria-pressed={marked}
      aria-label={`${n}번`}
      aria-disabled={disabled && !marked}
      onClick={() => onToggle?.(n)}
      className={`relative ${h} w-full select-none rounded-cell border border-[#f0a3b6] bg-white text-[13px] leading-none text-[#d8386a] transition-colors duration-150 ${disabled && !marked ? "opacity-40" : ""} ${
        marked ? "" : "hover:bg-[#fff0f3] active:bg-[#ffe1e8]"
      }`}
      style={{ touchAction: "manipulation" }}
    >
      <span className="font-display tabular">{n}</span>
      {marked && (
        <motion.span
          aria-hidden
          className="mark absolute inset-[3px] origin-left"
          initial={reduce ? false : { scaleX: 0, rotate: -6, opacity: 0.6 }}
          animate={{ scaleX: 1, rotate: -2, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.6 }}
        />
      )}
    </button>
  );
}
