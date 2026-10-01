import type { Metadata } from "next";
import WinBuilderClient from "@/components/golden/WinBuilderClient";

export const metadata: Metadata = {
  title: "1등 당첨 화면 만들기",
  description: "회차와 추첨일, 당첨번호를 넣어 1등 당첨 확인 화면을 만들어 영상으로 찍어보세요.",
  robots: { index: false, follow: true },
};

export default function WinPage() {
  return <WinBuilderClient />;
}
