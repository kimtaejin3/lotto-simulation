import type { Metadata } from "next";
import { TopBar } from "@/components/ui/TopBar";
import { SetupFlow } from "@/components/sim/SetupFlow";

export const metadata: Metadata = {
  title: "번호 고르기 · 매주 몇 게임 살지 정하기",
  description: "로또 용지에 직접 번호를 마킹하거나 자동 선택한 뒤, 1등이 나올 때까지 시간을 돌리는 시뮬레이션을 시작하세요.",
  alternates: { canonical: "/setup" },
};

export default function SetupPage() {
  return (
    <>
      <TopBar back="/" title="1 / 2 · 번호 고르기" />
      <SetupFlow />
    </>
  );
}
