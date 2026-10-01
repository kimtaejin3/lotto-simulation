import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL, ADSENSE_CLIENT } from "@/lib/flags";
import { SEO, websiteJsonLd, webAppJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Suspense } from "react";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";

const display = Jua({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SEO.title} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: SEO.description,
  keywords: [...SEO.keywords],
  applicationName: SITE_NAME,
  authors: [{ name: "개발세발" }],
  creator: "개발세발",
  category: "entertainment",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: "/",
    siteName: SITE_NAME,
    title: SEO.title,
    description: SEO.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
      : undefined,
  },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1519" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <head>
        {ADSENSE_CLIENT ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <JsonLd data={[websiteJsonLd(), webAppJsonLd()]} />
        <Suspense fallback={null}>
          <PostHogProvider />
        </Suspense>
        <div className="flex-1">{children}</div>
        <footer className="mx-auto w-full max-w-3xl px-5 pb-8 pt-10 text-center text-[11px] leading-relaxed text-muted">
          <nav className="mb-3 flex justify-center gap-4 text-xs">
            <Link href="/" className="hover:text-ink">홈</Link>
            <Link href="/golden" className="hover:text-ink">황금손 추첨기</Link>
            <Link href="/guide" className="hover:text-ink">로또 확률 가이드</Link>
            <Link href="/setup" className="hover:text-ink">시뮬레이션 시작</Link>
          </nav>
          <p>이 서비스는 확률 체험을 위한 시뮬레이션이며 실제 복권 당첨 결과를 예측하지 않습니다.</p>
          <p>실제 복권 구매를 권유하거나 당첨을 보장하지 않습니다. 공식 복권 사업자와 무관합니다.</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE_NAME} · 만든 곳: 개발세발
          </p>
        </footer>
      </body>
    </html>
  );
}
