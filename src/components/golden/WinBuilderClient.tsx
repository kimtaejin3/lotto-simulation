"use client";
import dynamic from "next/dynamic";

/**
 * 당첨 화면은 열 때마다 번호와 날짜가 달라져서 서버 렌더와 어긋난다.
 * 검색에 노출할 페이지도 아니므로 아예 클라이언트에서만 그린다.
 */
const WinBuilder = dynamic(() => import("./WinBuilder").then((m) => m.WinBuilder), {
  ssr: false,
  loading: () => <div className="min-h-[100dvh] bg-[#2b2330]" />,
});

export default function WinBuilderClient() {
  return <WinBuilder />;
}
