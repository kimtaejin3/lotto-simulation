import { ballColor } from "@/lib/lotto/balls";

interface Props {
  n: number;
  size?: number; // px
  className?: string;
  dim?: boolean;
  bonus?: boolean;
}

/** A glossy lottery ball. SVG so it stays crisp at any size. */
export function Ball({ n, size = 44, className = "", dim = false, bonus = false }: Props) {
  const c = ballColor(n);
  const id = `b${n}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`${bonus ? "보너스 " : ""}${n}번 공`}
      style={{ opacity: dim ? 0.35 : 1 }}
    >
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}g)`} />
      <ellipse cx="38" cy="28" rx="16" ry="10" fill="#fff" opacity="0.55" />
      <circle cx="50" cy="50" r="30" fill="#fff" opacity={c.text === "#FFFFFF" ? 0.14 : 0.35} />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize={n >= 10 ? 42 : 46}
        fill={c.text === "#FFFFFF" ? "#fff" : c.text}
        style={{ paintOrder: "stroke", stroke: c.text === "#FFFFFF" ? c.dark : "rgba(255,255,255,0.6)", strokeWidth: 3 }}
      >
        {n}
      </text>
      {bonus && (
        <circle cx="50" cy="50" r="47" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="6 6" opacity="0.9" />
      )}
    </svg>
  );
}
