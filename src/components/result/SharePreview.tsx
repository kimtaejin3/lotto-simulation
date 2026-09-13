"use client";
import { useEffect, useState } from "react";
import { renderShareCard } from "@/lib/share-card";

export function SharePreview() {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    Promise.all([
      renderShareCard({ won: true, weeks: 52 * 153_428 + 17, gamesPerWeek: 5, spent: 39_891_540_000, bestRank: 1, bestCount: 1, numbers: [3, 11, 18, 27, 32, 41] }),
      renderShareCard({ won: false, weeks: 52 * 12_583, gamesPerWeek: 5, spent: 3_271_580_000, bestRank: 3, bestCount: 2 }),
    ]).then((blobs) => setUrls(blobs.map((b) => URL.createObjectURL(b))));
  }, []);
  return (
    <main className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6 p-6">
      {urls.map((u) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={u} src={u} alt="share card" className="w-[320px] rounded-xl shadow-xl" />
      ))}
    </main>
  );
}
