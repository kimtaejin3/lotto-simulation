import type { Metadata } from "next";
import { GoldenFlow } from "@/components/golden/GoldenFlow";

export const metadata: Metadata = {
  title: "황금손 추첨기 · 덕담 한마디 하고 직접 추첨",
  description:
    "로또 추첨 방송의 황금손처럼, 추첨 버튼을 누르기 전에 한마디를 남기고 직접 번호를 뽑아보세요. 뽑은 번호로 1등 당첨 화면도 만들 수 있습니다.",
  alternates: { canonical: "/golden" },
  openGraph: { title: "황금손 추첨기", description: "한마디 남기고 직접 누르는 로또 추첨기", url: "/golden" },
};

export default function GoldenPage() {
  return <GoldenFlow />;
}
