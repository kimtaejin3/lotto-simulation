import { SITE_NAME, SITE_URL } from "./flags";
import { FIRST_PRIZE_ODDS, WEEKS_PER_YEAR } from "./lotto/constants";

export const SEO = {
  name: SITE_NAME,
  url: SITE_URL,
  title: "로또 1등까지 나는 몇 년 걸릴까? 평생 로또 시뮬레이터",
  shortTitle: "로또 1등까지 몇 년 걸릴까?",
  description:
    "매주 로또를 산다면 1등에 당첨되기까지 얼마나 걸릴까요? 번호를 직접 고르고 추첨기를 돌려 몇 년, 몇만 년이 흐르는지 직접 체험하는 무료 로또 확률 시뮬레이터입니다.",
  keywords: [
    "로또 시뮬레이터",
    "로또 시뮬레이션",
    "로또 1등 확률",
    "로또 당첨 확률",
    "로또 확률 계산",
    "로또 1등 몇 년",
    "매주 로또 사면",
    "로또 6/45 확률",
    "로또 추첨기",
    "로또 번호 추첨 시뮬레이션",
    "평생 로또",
    "15만년 로또",
  ],
  locale: "ko_KR",
  twitterHandle: undefined as string | undefined,
} as const;

/** Rank odds for Korean Lotto 6/45 (exact combinatorics). */
export const RANK_ODDS: { rank: string; condition: string; oneIn: number }[] = [
  { rank: "1등", condition: "6개 일치", oneIn: FIRST_PRIZE_ODDS },
  { rank: "2등", condition: "5개 + 보너스", oneIn: 1_357_510 },
  { rank: "3등", condition: "5개 일치", oneIn: 35_724 },
  { rank: "4등", condition: "4개 일치", oneIn: 733 },
  { rank: "5등", condition: "3개 일치", oneIn: 45 },
];

/** Expected years to first prize when buying `games` per week (average, not guarantee). */
export const expectedYears = (games: number) => FIRST_PRIZE_ODDS / games / WEEKS_PER_YEAR;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "로또 1등 확률은 얼마인가요?",
    a: "로또 6/45에서 한 게임이 1등이 될 확률은 8,145,060분의 1입니다. 1부터 45까지 숫자 중 6개를 고르는 경우의 수가 8,145,060가지이기 때문입니다.",
  },
  {
    q: "매주 로또를 사면 1등까지 평균 몇 년이 걸리나요?",
    a: "매주 1게임을 사면 평균 약 15만 6천 년, 매주 5게임이면 약 3만 1천 년, 매주 10게임이면 약 1만 5천 년이 걸립니다. 이 서비스 이름 '15만년 로또'도 여기서 나왔습니다. 평균일 뿐이라 운이 좋으면 빨리, 나쁘면 훨씬 오래 걸릴 수 있습니다.",
  },
  {
    q: "이 시뮬레이터는 실제 확률을 그대로 쓰나요?",
    a: "네. 매 회차 1부터 45 사이에서 중복 없는 6개 번호와 보너스 번호를 실제 규칙 그대로 추첨하고, 1등부터 5등까지 실제 당첨 기준으로 판정합니다. 재미를 위해 1등을 인위적으로 빨리 나오게 만들지 않습니다.",
  },
  {
    q: "같은 번호를 계속 사면 당첨 확률이 올라가나요?",
    a: "아니요. 매 회차 추첨은 독립적이라 지난주에 안 나온 번호가 이번 주에 더 잘 나오지 않습니다. 같은 번호든 매번 다른 번호든 한 게임의 1등 확률은 똑같이 8,145,060분의 1입니다.",
  },
  {
    q: "실제 로또를 살 수 있나요?",
    a: "아니요. 이 서비스는 확률을 체험하기 위한 시뮬레이션이며 실제 복권 구매, 당첨 예측, 번호 추천 기능이 없습니다. 공식 복권 사업자와도 무관합니다.",
  },
];

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko",
    description: SEO.description,
  };
}

export function webAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    alternateName: SEO.shortTitle,
    url: SITE_URL,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "ko",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: SEO.description,
    image: `${SITE_URL}/opengraph-image`,
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
