"use client";
import { useState } from "react";
import { ShareNetwork, DownloadSimple, LinkSimple, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { renderShareCard, shareHeadline, type ShareData } from "@/lib/share-card";
import { SITE_URL, SITE_NAME } from "@/lib/flags";
import { track } from "@/lib/analytics";

export function ShareButton({ data }: { data: ShareData }) {
  const [busy, setBusy] = useState(false);
  const [fallback, setFallback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const text = `${shareHeadline(data)} ${SITE_NAME}`;

  const share = async () => {
    track("result_share_click", { won: data.won });
    setBusy(true);
    try {
      const blob = await renderShareCard(data);
      const file = new File([blob], "lotto-life.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData | { files: File[] }) => boolean };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: SITE_NAME, text });
        track("result_share_success", { method: "native" });
      } else if (nav.share) {
        await nav.share({ title: SITE_NAME, text, url: SITE_URL });
        track("result_share_success", { method: "native-text" });
      } else {
        setFallback(URL.createObjectURL(blob));
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        try {
          const blob = await renderShareCard(data);
          setFallback(URL.createObjectURL(blob));
        } catch {
          /* ignore */
        }
      }
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
      /* ignore */
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Button onClick={share} disabled={busy} className="h-14 w-full text-xl">
        <ShareNetwork size={22} weight="bold" /> {busy ? "카드 만드는 중" : "내 결과 공유하기"}
      </Button>
      {fallback && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={fallback}
            download="lotto-life.png"
            className="btn-press flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-paper/70 text-sm text-ink dark:bg-bg-2"
          >
            <DownloadSimple size={18} weight="bold" /> 이미지 저장
          </a>
          <button
            type="button"
            onClick={copy}
            className="btn-press flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-paper/70 text-sm text-ink dark:bg-bg-2"
          >
            {copied ? <Check size={18} weight="bold" /> : <LinkSimple size={18} weight="bold" />} {copied ? "복사됨" : "링크 복사"}
          </button>
        </div>
      )}
    </div>
  );
}
