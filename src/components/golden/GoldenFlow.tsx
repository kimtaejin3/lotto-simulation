"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Shuffle, SpeakerHigh, SpeakerSlash, ArrowClockwise, Receipt, HandPointing } from "@phosphor-icons/react";
import { Drum } from "@/components/machine/Drum";
import { Ball } from "@/components/ui/Ball";
import { GoldenHand } from "./GoldenHand";
import { Button } from "@/components/ui/Button";
import { drawNumbers, type Draw } from "@/lib/lotto/engine";
import { CryptoRng } from "@/lib/lotto/rng";
import { MESSAGE_PRESETS, pickPreset } from "@/lib/golden";
import { useSetup } from "@/store/setup";
import { sfx, setSoundEnabled, unlock, haptic } from "@/lib/sound";
import { track } from "@/lib/analytics";

const rng = new CryptoRng();
type Phase = "intro" | "ready" | "drawing" | "done";

const REVEAL_MS = 950;

export function GoldenFlow() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [draw, setDraw] = useState<Draw | null>(null);
  const [revealed, setRevealed] = useState(0); // 0~7 (6 + 보너스)
  const [drawKey, setDrawKey] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const soundOn = useSetup((s) => s.soundOn);
  const setSound = useSetup((s) => s.setSound);
  useEffect(() => {
    let alive = true;
    Promise.resolve(useSetup.persist.rehydrate()).then(() => {
      if (alive) setSoundEnabled(useSetup.getState().soundOn);
    });
    return () => {
      alive = false;
    };
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const press = () => {
    unlock();
    haptic([25, 40, 25]);
    track("golden_pressed", { hasMessage: message.trim().length > 0, len: message.trim().length });
    const d = drawNumbers(rng);
    setDraw(d);
    setRevealed(0);
    setPhase("drawing");

    // 공이 하나씩 통에서 빠져나오도록 간격을 두고 공개한다.
    for (let i = 1; i <= 7; i++) {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i);
          setDrawKey((k) => k + 1);
          sfx.pop(i - 1);
          if (i === 7) {
            timers.current.push(
              setTimeout(() => {
                setPhase("done");
                sfx.win();
                haptic([40, 60, 40]);
                track("golden_draw_done");
              }, 700),
            );
          }
        }, 1100 + (i - 1) * REVEAL_MS),
      );
    }
  };

  const again = () => {
    clearTimers();
    setDraw(null);
    setRevealed(0);
    setPhase("ready");
  };

  const shown = draw ? draw.numbers.slice(0, Math.min(revealed, 6)) : [];
  const bonusShown = draw && revealed >= 7 ? draw.bonus : null;
  const drumBalls = draw ? [...draw.numbers.slice(0, Math.min(revealed, 6)), ...(revealed >= 7 ? [draw.bonus] : [])] : [];
  const agitation = phase === "drawing" ? 2.6 : phase === "ready" ? 1.1 : 0.5;
  const captionVisible = phase !== "intro" && (name.trim() || message.trim());
  const winHref = draw ? `/win?n=${draw.numbers.join(",")}&b=${draw.bonus}` : "/win";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#1a1016]">
      {/* 무대 조명 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(255,214,120,0.22) 0%, rgba(255,170,60,0.08) 35%, transparent 70%), radial-gradient(80% 50% at 50% 110%, rgba(238,61,98,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col px-5 pb-5 pt-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-lg text-[#F5C842]">
            황금손 추첨기
          </Link>
          <button
            type="button"
            onClick={() => {
              setSound(!soundOn);
              setSoundEnabled(!soundOn);
              unlock();
            }}
            aria-pressed={soundOn}
            aria-label={soundOn ? "소리 끄기" : "소리 켜기"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            {soundOn ? <SpeakerHigh size={20} /> : <SpeakerSlash size={20} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.div
              key="intro"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -12 }}
              className="flex flex-1 flex-col justify-center py-8"
            >
              <h1 className="font-display text-[34px] leading-tight text-white sm:text-5xl">
                오늘의 <span className="text-[#F5C842]">황금손</span>은<br />
                당신입니다
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                추첨 버튼을 누르기 전에 한마디 남겨주세요. 방송처럼 자막으로 띄워드립니다.
              </p>

              <label className="mt-8 flex flex-col gap-2">
                <span className="text-sm text-white/60">이름 (선택)</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 12))}
                  placeholder="황금손으로 나올 이름"
                  className="h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-white placeholder:text-white/30 outline-none focus:border-[#F5C842]"
                />
              </label>

              <label className="mt-4 flex flex-col gap-2">
                <span className="text-sm text-white/60">추첨 전 한마디</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 60))}
                  rows={2}
                  placeholder="이번 주, 보고 계신 모든 분께 행운이 가기를 바랍니다."
                  className="resize-none rounded-xl border border-white/15 bg-white/10 px-4 py-3 leading-relaxed text-white placeholder:text-white/30 outline-none focus:border-[#F5C842]"
                />
                <span className="self-end text-xs text-white/35">{message.length}/60</span>
              </label>

              <div className="mt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMessage(pickPreset(message))}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-sm text-white/80 hover:bg-white/10"
                >
                  <Shuffle size={15} weight="bold" /> 예시 문구
                </button>
                {MESSAGE_PRESETS.slice(0, 2).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMessage(m)}
                    className="h-9 max-w-full truncate rounded-full border border-white/15 px-3 text-sm text-white/60 hover:bg-white/10"
                  >
                    {m.slice(0, 14)}…
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-press mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full font-display text-xl text-[#3D2A00] shadow-[0_10px_24px_-10px_rgba(245,200,66,0.8)] transition-[filter,transform] hover:brightness-105"
                style={{ background: "linear-gradient(180deg,#FFE07A 0%,#F5C842 55%,#E0A91C 100%)" }}
                onClick={() => {
                  track("golden_started", { hasName: name.trim().length > 0 });
                  if (message.trim()) track("golden_message_entered", { len: message.trim().length });
                  unlock();
                  setPhase("ready");
                }}
              >
                <HandPointing size={22} weight="fill" /> 황금 장갑 끼기
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="stage"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col"
            >
              {/* 추첨기 */}
              <div className="relative mx-auto mt-1 aspect-[4/4.2] w-full max-w-[330px]">
                <Drum agitation={agitation} drawKey={drawKey} drawn={drumBalls} />
              </div>

              {/* 공개된 번호 */}
              <div className="mt-1 flex min-h-[52px] items-center justify-center gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => {
                  const n = shown[i];
                  return (
                    <div key={i} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07]">
                      <AnimatePresence>
                        {n !== undefined && (
                          <motion.div
                            initial={reduce ? false : { scale: 0.4, y: -16, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 20 }}
                          >
                            <Ball n={n} size={44} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <span className="mx-0.5 font-display text-white/50">+</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07]">
                  <AnimatePresence>
                    {bonusShown !== null && (
                      <motion.div
                        initial={reduce ? false : { scale: 0.4, y: -16, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                      >
                        <Ball n={bonusShown} size={44} bonus />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 방송 자막 */}
              <AnimatePresence>
                {captionVisible && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mx-auto mt-4 w-full max-w-[460px] overflow-hidden rounded-xl border border-[#F5C842]/30 bg-black/55 backdrop-blur"
                  >
                    <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2">
                      <span className="rounded-md bg-[#F5C842] px-2 py-0.5 font-display text-sm text-[#3D2A00]">황금손</span>
                      <span className="font-display text-base text-white">{name.trim() || "오늘의 주인공"}</span>
                    </div>
                    {message.trim() && (
                      <p className="px-3.5 py-2.5 text-[15px] leading-relaxed text-white">“{message.trim()}”</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 버튼 + 황금손 */}
              <div className="mt-auto flex flex-col items-center pt-3">
                {phase !== "done" && (
                  <div className="pointer-events-none relative z-10 flex h-[112px] w-full items-end justify-center">
                    <GoldenHand pressed={phase === "drawing"} size={84} />
                  </div>
                )}

                {phase === "ready" && (
                  <button
                    type="button"
                    onClick={press}
                    className="btn-press relative z-0 flex h-[84px] w-[84px] items-center justify-center rounded-full border-[6px] border-[#8E1B2E] bg-gradient-to-b from-[#FF5A72] to-[#C8102E] font-display text-lg text-white shadow-[0_10px_0_#7A1024,0_18px_30px_rgba(0,0,0,0.45)] active:translate-y-[6px] active:shadow-[0_4px_0_#7A1024]"
                    aria-label="추첨 버튼 누르기"
                  >
                    추첨
                  </button>
                )}

                {phase === "drawing" && (
                  <div
                    aria-hidden="true"
                    className="flex h-[84px] w-[84px] translate-y-[6px] items-center justify-center rounded-full border-[6px] border-[#8E1B2E] bg-gradient-to-b from-[#D8334B] to-[#A80D26] font-display text-lg text-white/80 shadow-[0_4px_0_#7A1024]"
                  >
                    추첨
                  </div>
                )}

                {phase === "ready" && <p className="mt-3 text-sm text-white/50">버튼을 눌러 추첨을 시작하세요</p>}
                {phase === "drawing" && <p className="mt-3 text-sm text-[#F5C842]">추첨 중입니다…</p>}

                {phase === "done" && (
                  <div className="w-full">
                    <p className="mb-4 text-center font-display text-xl text-[#F5C842]">추첨이 끝났습니다</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="secondary" onClick={again} className="text-base">
                        <ArrowClockwise size={20} weight="bold" /> 다시 추첨
                      </Button>
                      <Link
                        href={winHref}
                        className="btn-press flex h-12 items-center justify-center gap-2 rounded-full font-display text-base text-[#3D2A00] transition-[filter] hover:brightness-105"
                        style={{ background: "linear-gradient(180deg,#FFE07A 0%,#F5C842 55%,#E0A91C 100%)" }}
                      >
                        <Receipt size={20} weight="bold" /> 1등 화면 만들기
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
