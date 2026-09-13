"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ShareNetwork, LinkSimple, Check, X, HandTap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { renderShareCard, shareHeadline, type ShareData } from "@/lib/share-card";
import { SITE_URL, SITE_NAME } from "@/lib/flags";
import { track } from "@/lib/analytics";

/** Instagram / Facebook / KakaoTalk / LINE in-app browsers block file share and downloads. */
function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|Line\/|NAVER\(inapp/i.test(navigator.userAgent);
}

export function ShareButton({ data }: { data: ShareData }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const text = `${shareHeadline(data)} ${SITE_NAME}`;

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const openPreview = (blob: Blob, reason: string) => {
    setPreview(URL.createObjectURL(blob));
    track("result_share_card_view", { reason, won: data.won });
  };

  const share = async () => {
    track("result_share_click", { won: data.won, inApp: isInAppBrowser() });
    setBusy(true);
    try {
      const blob = await renderShareCard(data);
      const file = new File([blob], "lotto-life.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      const canShareFile = !isInAppBrowser() && typeof nav.share === "function" && nav.canShare?.({ files: [file] });
      if (canShareFile) {
        try {
          await nav.share({ files: [file], title: SITE_NAME, text });
          track("result_share_success", { method: "native" });
          return;
        } catch (e) {
          if ((e as Error)?.name === "AbortError") return; // user dismissed the sheet
          // fall through to the inline card
        }
      }
      openPreview(blob, canShareFile ? "native-failed" : isInAppBrowser() ? "in-app" : "no-file-share");
    } catch {
      /* card render failed; nothing to show */
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${SITE_URL}`);
      setCopied(true);
      track("result_share_success", { method: "copy" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  const shareLink = async () => {
    try {
      await navigator.share({ title: SITE_NAME, text, url: SITE_URL });
      track("result_share_success", { method: "native-text" });
    } catch {
      /* dismissed or unsupported */
    }
  };

  return (
    <>
      <Button onClick={share} disabled={busy} className="h-14 w-full text-xl">
        <ShareNetwork size={22} weight="bold" /> {busy ? "카드 만드는 중" : "내 결과 공유하기"}
      </Button>

      {/* Portal: the sticky footer uses backdrop-filter, which would trap a fixed overlay inside it. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
        {preview && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="결과 카드 저장"
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreview(null);
            }}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="닫기"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={22} weight="bold" />
            </button>
            <motion.img
              src={preview}
              alt="내 로또 시뮬레이션 결과 카드"
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="max-h-[62dvh] w-auto max-w-full rounded-2xl shadow-2xl"
              style={{ WebkitTouchCallout: "default" }}
            />
            <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <HandTap size={18} weight="fill" /> 이미지를 길게 눌러 사진에 저장하세요
            </div>
            <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copy}
                className="btn-press flex h-11 items-center justify-center gap-1.5 rounded-full bg-white font-display text-base text-ink"
              >
                {copied ? <Check size={18} weight="bold" /> : <LinkSimple size={18} weight="bold" />} {copied ? "복사됨" : "링크 복사"}
              </button>
              {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
                <button
                  type="button"
                  onClick={shareLink}
                  className="btn-press flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent font-display text-base text-white"
                >
                  <ShareNetwork size={18} weight="bold" /> 링크 공유
                </button>
              ) : (
                <a
                  href={preview}
                  download="lotto-life.png"
                  className="btn-press flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent font-display text-base text-white"
                >
                  이미지 저장
                </a>
              )}
            </div>
          </motion.div>
        )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
