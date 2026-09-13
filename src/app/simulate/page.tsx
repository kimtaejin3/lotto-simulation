import type { Metadata } from "next";
import { TopBar } from "@/components/ui/TopBar";
import { SimulateScreen } from "@/components/sim/SimulateScreen";

export const metadata: Metadata = {
  title: "추첨 중",
  robots: { index: false, follow: true },
};

export default function SimulatePage() {
  return (
    <>
      <TopBar back="/setup" title="2 / 2 · 추첨" />
      <SimulateScreen />
    </>
  );
}
