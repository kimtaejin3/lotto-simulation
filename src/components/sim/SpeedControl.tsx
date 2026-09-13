"use client";
import type { SpeedKey } from "./speeds";
import { SPEEDS } from "./speeds";

export function SpeedControl({ value, onChange, disabled }: { value: SpeedKey; onChange: (k: SpeedKey) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="시뮬레이션 속도" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-paper/60 p-1 dark:bg-bg-2">
      {SPEEDS.map((s) => {
        const active = s.key === value;
        return (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(s.key)}
            className={`btn-press h-10 rounded-full font-display text-sm transition-colors sm:text-base ${
              active ? "bg-accent text-white" : "text-ink-2 hover:bg-accent-tint"
            } disabled:opacity-50`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
