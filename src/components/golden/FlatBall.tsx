import type { CSSProperties } from "react";

/**
 * 당첨 확인 화면에 쓰는 납작한 번호 공.
 * 추첨기의 입체 공(Ball)과 달리 단색이라 캡처가 깔끔하다.
 * `size`를 주면 고정 크기, 안 주면 부모가 className으로 크기를 정한다.
 */
const BANDS = ["#D9A441", "#4A90D9", "#D7574F", "#9E9E9E", "#6DBA5B"];

export const flatBallColor = (n: number) => BANDS[Math.min(4, Math.max(0, Math.floor((n - 1) / 10)))];

export function FlatBall({
  n,
  size,
  className = "",
  style,
}: {
  n: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        ...(size ? { width: size, height: size, fontSize: Math.round(size * 0.42) } : {}),
        background: flatBallColor(n),
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
      aria-label={`${n}번`}
    >
      {n}
    </span>
  );
}
