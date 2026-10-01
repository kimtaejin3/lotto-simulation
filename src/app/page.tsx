import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { LandingTracker } from "@/components/landing/LandingTracker";
import { JsonLd } from "@/components/ui/JsonLd";
import { AdSlot } from "@/components/ui/AdSlot";
import Link from "next/link";
import { FIRST_PRIZE_ODDS } from "@/lib/lotto/constants";
import { SITE_NAME } from "@/lib/flags";
import { SEO, FAQ, RANK_ODDS, expectedYears, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `${SEO.title} | ${SITE_NAME}` },
  alternates: { canonical: "/" },
};

const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

export default function Home() {
  return (
    <main className="bg-dots">
      <LandingTracker />
      <JsonLd data={faqJsonLd()} />
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <span className="font-display text-2xl text-accent">{SITE_NAME}</span>
        <LinkButton href="/setup" variant="secondary" className="h-10 px-4 text-base">
          바로 시작
        </LinkButton>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-10 pt-6 lg:grid-cols-[1.05fr_1fr] lg:pt-10">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-[44px] leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            당신은 몇 년 뒤<br />
            로또 <span className="text-accent">1등</span>이 될까요?
          </h1>
          <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-ink-2 sm:text-lg">
            매주 살 게임 수와 번호를 정하고, 1등이 나올 때까지 시간을 돌려보세요. 직접 추첨 버튼을 누르는 황금손 모드도 있습니다.
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <HeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="choose">
        <h2 id="choose" className="sr-only">
          두 가지 모드 중 선택
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/setup"
            className="btn-press group flex flex-col rounded-card border border-line bg-paper/70 p-6 transition-colors hover:border-accent dark:bg-bg-2"
          >
            <span className="self-start rounded-full bg-accent-tint px-2.5 py-1 text-xs text-accent-ink">시간 체험</span>
            <h3 className="mt-3 font-display text-2xl leading-tight sm:text-[28px]">평생 로또 시뮬레이터</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">
              번호를 마킹하고 시간을 빨리 감아, 1등이 나올 때까지 몇 년이 걸리는지 직접 지켜봅니다.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-lg text-accent">
              내 로또 인생 시작하기
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>

          <Link
            href="/golden"
            className="btn-press group relative flex flex-col overflow-hidden rounded-card border border-[#E3B23C]/50 p-6 transition-colors hover:border-[#E3B23C]"
            style={{ background: "linear-gradient(150deg, rgba(245,200,66,0.16) 0%, rgba(245,200,66,0.04) 60%)" }}
          >
            <span className="self-start rounded-full bg-[#F5C842] px-2.5 py-1 text-xs font-medium text-[#3D2A00]">NEW</span>
            <h3 className="mt-3 font-display text-2xl leading-tight sm:text-[28px]">황금손 추첨기</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">
              추첨 방송의 황금손처럼 한마디 남기고 버튼을 누릅니다. 뽑은 번호로 1등 당첨 화면까지 만들 수 있어요.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-lg text-[#B8860B] dark:text-[#F5C842]">
              황금손 되어보기
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="odds">
        <div className="grid grid-cols-1 gap-8 rounded-card border border-line bg-paper/60 px-6 py-8 dark:bg-bg-2 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12 sm:px-10">
          <div>
            <div className="text-sm text-muted">로또 1등 확률</div>
            <div id="odds" className="font-display tabular text-4xl leading-none text-accent sm:text-5xl">
              1 / {FIRST_PRIZE_ODDS.toLocaleString("ko-KR")}
            </div>
          </div>
          <p className="max-w-[40ch] text-base leading-relaxed text-ink-2">
            매주 5게임을 사면 평균 3만 년쯤 걸립니다. 숫자로는 안 와닿죠. 그래서 직접 시간을 흘려 보게 만들었습니다.
          </p>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ["게임 수 정하기", "매주 1게임부터 원하는 만큼."],
            ["용지에 마킹하기", "직접 고르거나 전부 자동으로."],
            ["시간 돌리기", "1등이 나오면 자동으로 멈춰요. 지치면 언제든 멈춰도 돼요."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white">{i + 1}</span>
              <div>
                <div className="font-display text-xl leading-tight">{t}</div>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="how-long">
        <h2 id="how-long" className="font-display text-3xl leading-tight sm:text-4xl">
          매주 로또를 사면 1등까지 평균 몇 년?
        </h2>
        <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-ink-2">
          1등 확률 8,145,060분의 1을 매주 사는 게임 수로 나눈 평균값입니다. 평균이라 운이 좋으면 훨씬 빨리, 나쁘면 몇 배 더 걸립니다.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[1, 5, 10, 20, 100].map((g) => (
            <div key={g} className="rounded-card border border-line bg-paper/60 px-4 py-4 dark:bg-bg-2">
              <div className="text-sm text-muted">매주 {g}게임</div>
              <div className="font-display tabular mt-1 text-2xl leading-tight text-accent sm:text-3xl">{fmt(expectedYears(g))}년</div>
              <div className="mt-1 text-xs text-muted">₩{(g * 1000).toLocaleString("ko-KR")}/주</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          매주 1게임이면 약 15만 6천 년. 그래서 이름이 {SITE_NAME}입니다. 시뮬레이터를 돌리면 당신의 결과는 이 평균과 얼마나 다른지 바로 알 수 있습니다.
        </p>
      </section>

      <AdSlot id="landing_mid" className="mb-20" />

      <section className="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="rank-odds">
        <h2 id="rank-odds" className="font-display text-3xl leading-tight sm:text-4xl">
          로또 6/45 등수별 당첨 확률
        </h2>
        <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-ink-2">
          시뮬레이터가 그대로 사용하는 실제 규칙입니다. 1부터 45까지 중 6개를 뽑고 보너스 번호 1개를 추가로 뽑습니다.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[300px] border-collapse text-left text-sm sm:text-base">
            <thead>
              <tr className="text-muted">
                <th className="py-2 pr-4 font-normal">등수</th>
                <th className="py-2 pr-4 font-normal">조건</th>
                <th className="py-2 text-right font-normal">확률</th>
              </tr>
            </thead>
            <tbody>
              {RANK_ODDS.map((r) => (
                <tr key={r.rank} className="border-t border-line">
                  <td className="py-3 pr-4 font-display text-lg text-accent">{r.rank}</td>
                  <td className="py-3 pr-4 text-ink-2">{r.condition}</td>
                  <td className="py-3 text-right font-display tabular text-lg">1 / {r.oneIn.toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-3xl leading-tight sm:text-4xl">
          자주 묻는 질문
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-card border border-line bg-paper/60 px-5 py-4 dark:bg-bg-2">
              <summary className="cursor-pointer list-none font-display text-lg leading-snug marker:content-none">
                <span className="mr-2 text-accent">Q.</span>
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-card border border-line bg-paper/60 px-6 py-6 dark:bg-bg-2 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="font-display text-2xl leading-tight">로또 확률, 제대로 알고 싶다면</h2>
            <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-ink-2">
              1등 확률이 왜 814만분의 1인지, 매주 사면 정말 몇 년이 걸리는지, 흔한 오해까지 차근차근 정리한 글입니다.
            </p>
          </div>
          <Link href="/guide" className="mt-4 inline-flex h-11 shrink-0 items-center rounded-full border border-line px-5 font-display text-base hover:bg-accent-tint sm:mt-0">
            확률 가이드 읽기
          </Link>
        </div>
      </section>

      <AdSlot id="landing_bottom" className="mb-16" />

      <section className="mx-auto max-w-6xl px-5 pb-24 text-center">
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">평균은 평균일 뿐. 당신의 1등은 언제일까요?</h2>
        <LinkButton href="/setup" className="mt-6 h-14 px-8 text-xl">
          내 로또 인생 시작하기
        </LinkButton>
      </section>
    </main>
  );
}
