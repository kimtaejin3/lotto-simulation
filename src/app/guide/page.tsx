import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/ui/TopBar";
import { AdSlot } from "@/components/ui/AdSlot";
import { JsonLd } from "@/components/ui/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { RANK_ODDS, expectedYears } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/flags";

const TITLE = "로또 1등 확률과 매주 사면 걸리는 시간, 제대로 계산해보기";
const DESC =
  "로또 6/45 1등 확률 8,145,060분의 1이 어떻게 나오는지, 매주 몇 게임을 사면 평균 몇 년이 걸리는지, 흔한 오해 4가지와 시뮬레이터의 계산 방식까지 정리했습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/guide" },
  openGraph: { title: TITLE, description: DESC, url: "/guide", type: "article" },
};

const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

export default function GuidePage() {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESC,
    inLanguage: "ko",
    author: { "@type": "Organization", name: "개발세발" },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/guide`,
    datePublished: "2026-09-14",
    dateModified: "2026-09-14",
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "로또 확률 가이드", item: `${SITE_URL}/guide` },
    ],
  };

  return (
    <>
      <TopBar back="/" title="로또 확률 가이드" />
      <JsonLd data={[article, breadcrumb]} />
      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8">
        <article className="prose-lotto">
          <header>
            <p className="text-sm text-accent">로또 확률 가이드</p>
            <h1 className="mt-1 font-display text-4xl leading-[1.15] sm:text-5xl">{TITLE}</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">
              “로또 1등 확률은 814만분의 1”이라는 말은 다들 들어봤지만, 그 숫자가 어디서 나오는지, 매주 사면 실제로 얼마나 걸리는지는 잘 모릅니다. 이
              글은 계산 과정을 하나씩 보여주고, 마지막에 그걸 직접 체험할 수 있는 시뮬레이터로 연결합니다.
            </p>
          </header>

          <h2>로또 6/45 규칙 한 줄 요약</h2>
          <p>
            1부터 45까지 숫자 중 6개를 고릅니다. 매주 토요일 추첨에서 6개 번호와 보너스 번호 1개가 뽑히고, 내 번호와 몇 개가 겹치느냐로 등수가
            정해집니다. 6개 모두 맞으면 1등, 5개가 맞고 보너스 번호까지 맞으면 2등, 5개만 맞으면 3등, 4개는 4등, 3개는 5등입니다. 1게임에 1,000원입니다.
          </p>

          <h2>1등 확률 8,145,060분의 1은 어떻게 나오나</h2>
          <p>
            45개 숫자 중 6개를 고르는 경우의 수를 세면 됩니다. 순서는 상관없으니 조합입니다. 45 × 44 × 43 × 42 × 41 × 40을 6 × 5 × 4 × 3 × 2 × 1로
            나누면 정확히 8,145,060이 나옵니다. 그중 당첨 조합은 딱 하나이므로 한 게임의 1등 확률은 8,145,060분의 1입니다.
          </p>
          <p>
            감이 안 오면 이렇게 생각해 보세요. 동전을 던져 앞면이 23번 연속으로 나올 확률이 8,388,608분의 1입니다. 로또 1등은 그보다 아주 조금 더
            어렵습니다. 동전 23번 연속 앞면, 딱 한 번의 시도로.
          </p>

          <h2>등수별 확률표</h2>
          <div className="not-prose overflow-x-auto">
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
          <p>
            5등(3개 일치)은 45게임에 한 번꼴이라 매주 5게임을 사면 두 달에 한 번 정도 5,000원을 받습니다. 4등은 733게임에 한 번이니 같은 조건이면
            약 3년에 한 번입니다. 3등부터는 평생 한 번 보기 어려운 확률로 넘어갑니다.
          </p>

          <AdSlot id="guide_mid" className="not-prose my-10" />

          <h2>매주 사면 1등까지 평균 몇 년?</h2>
          <p>
            매주 n게임을 사면 1년에 52n게임입니다. 1등 확률의 역수 8,145,060을 1년 게임 수로 나누면 평균 대기 기간이 나옵니다.
          </p>
          <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 5, 10, 20].map((g) => (
              <div key={g} className="rounded-card border border-line bg-paper/60 px-4 py-4 dark:bg-bg-2">
                <div className="text-sm text-muted">매주 {g}게임</div>
                <div className="font-display tabular mt-1 text-2xl leading-tight text-accent">{fmt(expectedYears(g))}년</div>
                <div className="mt-1 text-xs text-muted">₩{(g * 1000 * 52).toLocaleString("ko-KR")}/년</div>
              </div>
            ))}
          </div>
          <p>
            매주 1게임이면 약 15만 6천 년. 이 서비스의 이름이 {SITE_NAME}인 이유입니다. 게임 수를 10배로 늘리면 기간은 10분의 1로 줄지만, 쓰는 돈도
            정확히 10배가 됩니다. 총 지출은 어느 쪽이든 평균 약 81억 원으로 같습니다.
          </p>

          <h3>“평균”의 함정</h3>
          <p>
            평균 3만 년이라고 해서 3만 년째에 당첨된다는 뜻이 아닙니다. 매주 추첨은 독립적이라, 평균 시점이 됐을 때 이미 1등을 한 번이라도 했을 확률은
            약 63%입니다. 나머지 37%는 평균보다 더 오래 걸립니다. 운이 좋으면 몇백 년 만에 나오고, 나쁘면 평균의 몇 배가 걸립니다. 시뮬레이터를 여러 번
            돌려보면 이 편차를 바로 느낄 수 있습니다.
          </p>

          <h2>흔한 오해 4가지</h2>
          <h3>1. 오래 안 나온 번호가 나올 때가 됐다</h3>
          <p>
            아닙니다. 추첨기는 지난주 결과를 기억하지 않습니다. 100주 동안 안 나온 번호도 이번 주에 나올 확률은 다른 번호와 똑같습니다. 이걸 도박사의
            오류라고 부릅니다.
          </p>
          <h3>2. 1, 2, 3, 4, 5, 6은 절대 안 나온다</h3>
          <p>
            연속 번호 조합도 확률은 8,145,060분의 1로 다른 조합과 완전히 같습니다. 다만 이런 조합을 고르는 사람이 많아서 당첨되면 상금을 나눠 갖게
            될 가능성이 큽니다. 확률이 낮은 게 아니라 기대 상금이 낮은 겁니다.
          </p>
          <h3>3. 같은 번호를 계속 사면 언젠가는 된다</h3>
          <p>
            매주 번호를 바꾸든 고정하든 각 회차의 확률은 같습니다. 같은 번호를 고수하는 건 심리적 만족일 뿐 확률에는 영향이 없습니다. 이 시뮬레이터는
            같은 번호로 계속 사는 상황을 재현하지만, 매주 자동으로 바꿔도 결과 분포는 같습니다.
          </p>
          <h3>4. 많이 사면 확률이 확 올라간다</h3>
          <p>
            10게임을 사면 확률은 정확히 10배가 됩니다. 8,145,060분의 10, 즉 814,506분의 1입니다. 여전히 동전 앞면 20번 연속에 가까운 확률이고, 돈은
            10배 나갑니다. 확률이 “올라가는” 건 맞지만 체감할 수준으로 바뀌지는 않습니다.
          </p>

          <h2>이 시뮬레이터는 어떻게 계산하나</h2>
          <p>
            매 회차 1부터 45 사이에서 중복 없이 6개 번호와 보너스 번호를 뽑고, 사용자가 고른 게임 하나하나와 비교해 등수를 판정합니다. 난수는
            브라우저의 암호학적 난수 생성기로 시드를 만들어 사용하고, 1등을 빨리 보여주려고 확률을 조작하는 코드는 없습니다. 초당 수천 회의 추첨을
            돌리기 위해 계산은 별도 스레드에서 처리하고, 화면에는 흘러간 시간과 회차, 당첨 현황만 표시합니다.
          </p>
          <p>
            그래서 시뮬레이터에서 나온 결과는 확률의 “한 표본”입니다. 같은 번호로 다시 돌리면 완전히 다른 시간이 나옵니다. 몇 번 돌려보면 평균이
            얼마나 믿을 수 없는 숫자인지 알게 됩니다.
          </p>

          <h2>알아둘 점</h2>
          <p>
            이 서비스는 확률을 체험하기 위한 시뮬레이션이며 실제 복권 구매, 당첨 예측, 번호 추천 기능이 없습니다. 공식 복권 사업자와 무관합니다. 복권은
            정해진 예산 안에서 재미로만 즐기시길 권합니다.
          </p>
        </article>

        <AdSlot id="guide_bottom" className="my-10" />

        <div className="rounded-card border border-line bg-paper/60 px-6 py-8 text-center dark:bg-bg-2">
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">숫자로는 안 와닿죠. 직접 돌려보세요.</h2>
          <p className="mt-2 text-sm text-muted">번호를 고르고 1등이 나올 때까지 시간을 흘려보냅니다. 1분이면 충분합니다.</p>
          <LinkButton href="/setup" className="mt-5 h-14 px-8 text-xl">
            내 로또 인생 시작하기
          </LinkButton>
          <p className="mt-4 text-xs text-muted">
            <Link href="/" className="underline-offset-2 hover:underline">
              홈으로 돌아가기
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
