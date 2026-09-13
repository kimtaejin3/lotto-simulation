import { ballColor } from "@/lib/lotto/balls";

/** Small decorative receipt-style ticket used on landing / share visuals. */
export function MiniTicket({ numbers, className = "" }: { numbers: number[][]; className?: string }) {
  const letters = "ABCDE";
  return (
    <div className={`paper paper-perforated w-[240px] rounded-[6px] px-4 pb-5 pt-5 text-[#2b2330] ${className}`}>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl text-[#d8386a]">로또 6/45</span>
        <span className="text-[9px] text-[#b06a7c]">시뮬레이션</span>
      </div>
      <div className="mt-2 border-t border-dashed border-[#f0a3b6] pt-2 text-[9px] text-[#8a7f86]">
        발행일 : 언젠가의 토요일
      </div>
      <div className="mt-2 space-y-1.5">
        {numbers.map((row, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            <span className="w-10 shrink-0 whitespace-nowrap font-display text-[#d8386a]">{letters[i]} 자동</span>
            {row.map((n) => (
              <span
                key={n}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full font-display text-[10px] text-white"
                style={{ background: ballColor(n).base, color: ballColor(n).text }}
              >
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between border-t border-dashed border-[#f0a3b6] pt-2 text-[10px]">
        <span>금액</span>
        <span className="font-display">₩{(numbers.length * 1000).toLocaleString("ko-KR")}</span>
      </div>
      <div
        className="mt-3 h-6 w-full opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #2b2330 0 2px, transparent 2px 4px, #2b2330 4px 5px, transparent 5px 8px, #2b2330 8px 11px, transparent 11px 13px)",
        }}
      />
    </div>
  );
}
