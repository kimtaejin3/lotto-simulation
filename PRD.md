# 평생 로또 시뮬레이터 — MVP PRD

> Working title: **15만년 로또**
>
> 핵심 질문: **“내가 매주 로또를 산다면 1등에 당첨되기까지 얼마나 걸릴까?”**

---

## 0. 제품 한 줄 정의

사용자가 **매주 구매할 로또 게임 수와 번호**를 정하면, 실제 로또 추첨처럼 시각적으로 추첨을 반복하여 **1등에 당첨되기까지 걸린 시간과 사용 금액을 체감하게 만드는 인터랙티브 웹서비스**.

이 서비스의 목적은 단순 확률 계산이 아니다.

**숫자로는 잘 느껴지지 않는 로또 1등의 희박한 확률을 ‘시간이 흐르는 경험’으로 보여주는 것**이 핵심이다.

---

# 1. Product Vision

기존 로또 시뮬레이터는 다음에 집중하는 경우가 많다.

- 누적 구매 금액
- 누적 당첨 금액
- 등수별 당첨 횟수
- 확률
- 번호 통계
- 단순 반복 추첨

본 서비스는 기능 수를 늘리는 대신 다음 경험에 집중한다.

> **“언제 1등이 되는가?”**

사용자는 자신이 실제로 로또를 사는 상황처럼 번호를 마킹하고, 한 주씩 시간이 흐르는 추첨을 보며, 몇 년·몇백 년·몇만 년이 지나서야 1등이 나오는지 직접 경험한다.

따라서 이 제품은 **로또 계산기**가 아니라 **확률 체험형 콘텐츠**로 설계한다.

---

# 2. Channel / Marketing Story

이 제품은 `개발세발` Instagram 채널의 콘텐츠와 제품 UX가 하나의 스토리로 연결되어야 한다.

## Reel Story

릴스 인트로:

> **“여러분 저 로또 당첨됐어요!!”**

짧은 pause.

> **“네, 대략 15만 년 뒤에요…”**

이후 실제 로또 판매점에 방문하여 번호를 마킹하는 1인칭 장면.

> **“결과 기다리기 심심해서 로또 시뮬레이터를 만들기로 했어요.”**

개발 장면 / 서비스 화면.

시뮬레이션 실행.

> **“여러분, 저 15만 년 뒤에 당첨이에요!!”**

또는 사용자가 직접 멈췄을 때:

> **“여기서 멈췄더니 아직도 1등이 안 나왔어요…”**

마무리:

> **“좋은 기운인 것 같아요. 오늘 밤 8시 기다려볼게요.”**

CTA:

> **“직접 해보고 싶은 분들은 프로필 링크에서 돌려보세요.”**

---

# 3. Product Message

서비스의 메인 메시지는 아래 한 문장이다.

> **평생 로또를 사면 1등은 언제 될까?**

또는 결과 중심 표현:

> **당신의 1등은 몇 년 뒤일까요?**

제품 UI와 모든 기능은 이 메시지를 강화해야 한다.

기능이 많더라도 이 질문과 직접 연결되지 않으면 MVP에서는 제외한다.

---

# 4. Core Differentiation

## 4.5 Existing Simulator Reference

기능/맥락 레퍼런스 URL:

```text
https://parkminkyu.github.io/newLotto/lottoWin.html
```

이 레퍼런스와의 차별점은 아래와 같다.

- 기존 시뮬레이터는 다양한 통계/계산 기능 중심
- 우리 서비스는 **릴스 스토리와 연결된 체험 중심**
- 기존 시뮬레이터는 진행 중에 여러 결과를 보여주는 구조
- 우리 서비스는 진행 중에는 **회차와 흘러간 시간만 중심적으로 노출**
- 기존 시뮬레이터는 계산기 느낌이 강함
- 우리 서비스는 **로또 용지 + 추첨기 + 시간 흐름**을 강조한 몰입형 경험

즉, 이 URL은 기능 참고용일 뿐이며 복제 대상이 아니다.


## 4.1 Time-based Simulation

기존 시뮬레이터의 “몇 회 구매”보다 사람이 직관적으로 느낄 수 있는 **시간 단위**를 중심으로 표현한다.

예:

```text
1주
3개월
1년
10년
100년
1,000년
15,284년
```

시뮬레이션 속도가 빨라져도 화면의 중심은 항상 **현재까지 흐른 시간**이다.

## 4.2 Time-Flow + User Stop Mode

대표 모드.

기존 시뮬레이터와 달리 이 서비스는 시뮬레이션 도중에 **복잡한 통계 패널을 계속 노출하지 않는다.**
진행 중에는 아래 두 가지만 중심적으로 보여준다.

1. **회차가 얼마나 진행되었는지**
2. **시간이 얼마나 흘렀는지**

즉 사용자는 추첨이 흘러가는 과정을 보다가 **원할 때 직접 멈춘다.**
그리고 멈춘 그 시점에서 비로소 결과 요약을 본다.

진행 중 핵심 표시 예시:

```text
진행 회차
8,138,231회

흘러간 시간
156,504년
```

멈춘 뒤 결과 예시 1 — 1등 당첨이 나온 경우:

```text
🎉 1등 당첨!

당첨까지 걸린 시간
153,428년 17주

진행 회차
7,978,308회

총 구매 금액
₩39,891,540,000
```

멈춘 뒤 결과 예시 2 — 아직 1등이 안 나온 경우:

```text
아직 1등은 나오지 않았습니다.

현재까지 걸린 시간
12,583년

진행 회차
654,316회

총 구매 금액
₩654,316,000

최고 당첨
3등 2회
```

즉 이 제품은 “끝까지 자동 계산해서 통계를 보여주는 도구”가 아니라
**“시간이 흘러가는 걸 체감하다가, 사용자가 직접 멈춰서 그 순간의 결과를 확인하는 체험형 서비스”**다.

## 4.3 Lottery Drawing Machine Visualization

시뮬레이션은 단순 숫자 테이블이 아니라 **실제 추첨을 보는 느낌**으로 구성한다.

중앙에 추첨기.

- 투명 구형 드럼
- 내부에서 움직이는 1~45 번호 공
- 추첨 시 공이 하나씩 선택됨
- 당첨 번호 6개가 슬롯에 들어감
- 번호별 실제 로또 공을 연상시키는 색상 체계
- 고속 모드에서는 애니메이션을 간소화해 성능 확보

중요:

공식 로또 서비스의 로고, 상표, UI를 그대로 복제하지 않는다.

**한국 로또의 감성을 연상시키되 독자적인 그래픽 스타일**을 사용한다.

## 4.4 Physical Ticket-like Number Selection

번호 선택 UI는 단순한 checkbox grid보다 **로또 용지를 마킹하는 감각**을 제공한다.

구성:

```text
A 게임
1  2  3 ... 45

B 게임
1  2  3 ... 45

...
```

사용자가 번호를 누르면 연필/마킹펜으로 칠한 듯한 애니메이션.

선택 가능한 방식:

```text
직접 선택
자동 선택
반자동
```

MVP에서는 `직접 선택 + 자동 선택`만 필수.

---

# 5. Target User

Primary:

- 실제로 로또를 가끔 구매하는 사람
- “로또 1등 확률이 얼마나 낮은지” 궁금한 사람
- SNS에서 재미있는 웹서비스를 체험하는 사람
- 친구에게 결과를 공유하고 싶은 사용자

Secondary:

- 확률/통계 콘텐츠에 관심 있는 사용자
- 재미있는 인터랙티브 웹사이트를 좋아하는 사용자

이 서비스는 개발자를 대상으로 하지 않는다.

**누구나 3초 안에 이해할 수 있어야 한다.**

---

# 6. Main User Flow

```text
Instagram Reel
↓
Landing Page
↓
“내 1등은 몇 년 뒤?”
↓
매주 구매할 게임 수 선택
↓
번호 선택 / 자동
↓
시뮬레이션 시작
↓
추첨기 작동
↓
시간이 빠르게 흐름
↓
1등 발생
↓
결과 화면
↓
결과 공유 / 다시하기
```

---

# 7. Landing Page

Route:

```text
/
```

## Hero

Main copy:

> **당신은 몇 년 뒤 로또 1등이 될까요?**

Subcopy:

> 매주 몇 게임을 살지 정하고  
> 1등이 나올 때까지 시간을 돌려보세요.

Primary CTA:

> **내 로또 인생 시작하기**

Secondary CTA:

> **다른 사람 결과 보기**  
> Optional — MVP 이후 추가 가능

Hero background:

- 추첨기
- 로또 공
- 복권 용지를 연상시키는 graphic
- 너무 카지노스럽지 않게 밝고 유쾌한 분위기

---

# 8. Setup Flow

시뮬레이션 시작 전에 입력받는 값은 최소화한다.

중요:
사용자에게 `몇 살까지 살지` 같은 입력은 받지 않는다.
제품의 중심은 인생 종료 시점이 아니라 **“내가 멈출 때까지 얼마나 시간이 흘렀는가”** 이다.

## Required Input

### 8.1 Weekly Purchase

질문:

> **매주 몇 게임씩 구매하시겠어요?**

Preset:

```text
1게임 — ₩1,000 / 주
5게임 — ₩5,000 / 주
10게임 — ₩10,000 / 주
20게임 — ₩20,000 / 주
직접 입력
```

추천 default:

```text
5게임
```

### 8.2 Number Selection

각 게임별:

```text
직접 선택
자동 선택
```

자동 선택은 1~45 사이 중복 없는 6개 숫자.

`전체 자동` 버튼 제공.

---

# 9. Simulation Screen

Route:

```text
/simulate
```

화면의 핵심은 세 영역.

중요:
진행 중 화면에서는 **회차 수와 흘러간 시간**을 가장 크게 보여주고,
그 외 결과 정보는 최소화하거나 숨긴다.
결과는 사용자가 멈춘 시점에 결과 패널/결과 화면으로 보여준다.

## 9.1 Main Drawing Machine

화면 중앙.

Desktop:

```text
              elapsed time

          ┌───────────────┐
          │ Lottery Drum  │
          │   ○ ○ ○ ○     │
          └───────────────┘

       4   11   18   27   32   41
```

Mobile에서는 추첨기를 화면 상단~중단의 주 시각 요소로 사용.

## 9.2 Time Counter

가장 중요한 숫자.

예:

```text
흘러간 시간

000,153년 08개월
```

단위 변화:

```text
1~51주 → 주
1~99년 → 년 + 개월
100년 이상 → 년
10,000년 이상 → 천 단위 comma
```

시간이 빨라질수록 숫자가 빠르게 증가하는 시각 효과.

## 9.3 Current Stats

시뮬레이션 중 최소 정보:

```text
진행 회차
654,316회

흘러간 시간
12,583년
```

선택적으로 아주 작은 보조 정보만 표시 가능:

```text
총 구매 금액
₩654,316,000
```

하지만 핵심은 어디까지나:

- **몇 회차가 흘렀는지**
- **얼마나 오랜 시간이 흘렀는지**

이다.

`당첨 등수별 세부 결과`, `수익률`, `상세 통계`는 진행 중에 전면 노출하지 않는다.
핵심 스토리가 흐려지지 않게 한다.

---

# 10. Simulation Speed

User controls:

```text
1x
100x
10,000x
MAX
```

실제 구현에서는 최대 속도 시 개별 추첨 애니메이션을 모두 렌더링하지 않는다.

예:

- 1x: 모든 공 애니메이션
- 100x: 1회 대표 animation + 숫자 batch update
- 10,000x: 결과만 주기적 update
- MAX: Worker에서 batch simulation, UI는 aggregate만 표시

---

# 11. Lottery Probability Engine

한국 Lotto 6/45 규칙 기반.

한 게임:

- 1~45
- 중복 없이 6개 선택
- 추첨 번호 6개
- bonus number 별도

당첨 판정:

```text
1등: 6개 일치
2등: 5개 + bonus
3등: 5개
4등: 4개
5등: 3개
```

중요:

**확률을 fake하지 않는다.**

바이럴을 위해 1등을 인위적으로 빨리 발생시키지 않는다.

난수 생성은 가능한 한 신뢰할 수 있는 브라우저 RNG 사용.

권장:

```text
crypto.getRandomValues()
```

단, 초고속 대량 simulation에서는 성능을 고려한 구현 가능.

시뮬레이션임을 명확히 표시한다.

---

# 12. Performance Architecture

1등 확률은 매우 낮기 때문에 수백만 회 이상의 추첨이 발생할 수 있다.

UI main thread에서 직접 반복하면 안 된다.

## Web Worker

시뮬레이션 로직은 `Web Worker`에서 실행.

Main thread:

- animation
- counters
- user interaction

Worker:

- batch lottery generation
- rank calculation
- statistics

Communication:

```text
Worker → Main

every N simulations
```

aggregate state 전달.

예:

```json
{
  "weeks": 8138231,
  "spent": 40691155000,
  "bestRank": 2,
  "counts": {
    "first": 0,
    "second": 4,
    "third": 201
  }
}
```

---

# 13. Result Screen

결과 확인은 두 가지 방식으로 발생한다.

1. **1등이 발생했을 때 자동 정지**
2. **사용자가 직접 멈췄을 때 수동 정지**

### 13.1 Auto Stop on First Prize

1등이 발생하면 simulation 즉시 pause.

Animation:

- machine stop
- confetti
- winning numbers 강조
- sound effect
- 화면 vibration-like visual

Main copy:

> 🎉 **축하합니다. 1등입니다!**

바로 아래:

> **153,428년 만에요.**

이 문장이 핵심.

Stats:

```text
당첨까지
153,428년 17주

진행 회차
7,978,308회

총 구매 게임
39,891,540

총 구매 금액
₩39,891,540,000

그동안 나온 2등
24회

그동안 나온 3등
1,287회
```

### 13.2 Manual Stop Result

사용자가 `멈추기` 버튼을 누르면 그 시점의 결과를 요약해서 보여준다.

Main copy example:

> **여기서 멈췄습니다.**
>
> **아직 1등은 나오지 않았어요.**

또는:

> **여기서 멈췄습니다.**
>
> **이미 1등이 한 번 나왔어요!**

예시 stats:

```text
현재까지 흘러간 시간
12,583년

진행 회차
654,316회

총 구매 금액
₩654,316,000

1등
0회

최고 당첨
3등 2회
```

즉 결과 화면은 **“1등이 나왔을 때만 존재하는 화면”**이 아니라,
**“사용자가 멈춘 시점의 상태를 공유 가능한 결과로 정리하는 화면”** 이어야 한다.

---

# 14. Share Result

결과 화면에는 반드시 **공유하기 버튼**을 넣는다.

Button copy:

> **공유하기**

또는

> **내 결과 공유하기**

공유는 두 경우 모두 가능해야 한다.

1. **얼마 뒤에 1등 당첨이 되었는지**
2. **사용자가 멈췄지만 아직 1등 당첨이 안 되었는지**

### 14.1 Share Card — First Prize Reached

9:16 또는 1:1.

예:

```text
나는 로또 1등까지
153,428년 걸렸습니다.

매주 5게임 구매
진행 회차 7,978,308회

총 사용금액
₩39,891,540,000

당신은 몇 년 걸릴까요?

[service name]
```

### 14.2 Share Card — No First Prize Yet

예:

```text
저는 12,583년 동안
로또를 샀지만
아직 1등이 안 나왔습니다.

매주 5게임 구매
진행 회차 654,316회

총 사용금액
₩654,316,000

당신은 어디까지 버틸 수 있나요?

[service name]
```

Web Share API 우선 사용.

```text
navigator.share()
```

미지원 환경:

```text
이미지 저장
링크 복사
```

공유 card는 반드시 **친구에게 보여주고 싶을 정도로 강한 한 줄**을 포함해야 한다.
예:

- `나는 15만 년 뒤에 당첨됩니다`
- `나는 1만 2천 년을 버텼지만 아직 1등이 안 나왔습니다`

---

# 15. Replay

Result CTA:

```text
다시 인생 돌리기
같은 번호로 다시
새 번호로 다시
```

재방문/반복 사용을 유도한다.

---

# 16. Visual Direction

사용자가 별도로 저장한 시각 자료를 reference로 사용한다.

권장 폴더:

```text
/references/
  lotto-ticket/
  drawing-machine/
  balls/
  typography/
  mood/
```

Reference URL:

```text
https://parkminkyu.github.io/newLotto/lottoWin.html
```

위 URL은 기능/맥락 참고용 레퍼런스로만 사용한다.

Claude Code 또는 구현 Agent는 제공된 레퍼런스 이미지와 위 URL을 먼저 확인하고 스타일/구조적 차이를 파악한다.

단:

- 공식 로고 직접 복제 금지
- 공식 복권 UI pixel-copy 금지
- “동행복권 공식 서비스”로 오인될 요소 금지
- 사진을 그대로 asset으로 재사용하지 말고 reference로만 사용

특히 사용자가 제공한 사진 자료는 **그대로 베끼지 말고**, 분위기와 핵심 형태만 참고한다.

Goal:

> **“한국에서 로또 사본 사람이라면 바로 익숙하지만, 명확히 독립적인 서비스”**

---

# 17. Visual Components

## Lottery Ticket

추천 방식:

```text
SVG + CSS
```

이유:

- 모바일 responsive
- 번호 클릭 애니메이션
- crisp rendering
- 간단한 출력/공유 가능

Texture는 아주 약한 paper effect.

## Lottery Balls

SVG 또는 CSS / Canvas.

번호가 명확히 읽혀야 한다.

공별 subtle depth:

- radial gradient
- highlight
- shadow

모바일에서도 45개가 구별되어야 함.

## Lottery Machine

MVP Recommended:

```text
Canvas / SVG + Motion
```

추후 immersive version:

```text
Three.js
React Three Fiber
```

실제 3D physics까지는 MVP 필수가 아니다.

중요한 것은:

- 공이 실제로 섞이는 느낌
- 추첨 순간의 suspense
- 고속 simulation에서도 성능 유지

디자인 원칙:

- 사용자가 준 추첨기 사진을 그대로 복제하지 않는다.
- **실제 로또 추첨기보다 더 예쁘고 세련된 그래픽**으로 재해석한다.
- 약간 장난감 같거나 저렴해 보이는 느낌은 피한다.
- 유리 재질, 조명, 공 움직임, 슬롯 구조를 시각적으로 매력적으로 만든다.
- `현실감을 주되 더 보기 좋은 추첨기`가 목표다.

---

# 18. Audio / Haptics

Optional sound:

```text
ball mixing sound
ball pop
win sound
button mark sound
```

기본 mute 또는 사용자가 음소거 가능.

Mobile에서는 가능할 경우 작은 haptic-style feedback.

브라우저 정책상 audio는 사용자 interaction 이후 시작.

---

# 19. Technology Stack

구현 시점의 **current stable version**을 사용하고 PRD에서 특정 minor version에 고정하지 않는다.

Recommended:

```text
Next.js
React
TypeScript
Tailwind CSS
Motion
```

Simulation:

```text
Web Workers
crypto.getRandomValues()
```

Graphics:

```text
SVG
Canvas
```

Optional immersive graphics:

```text
Three.js
React Three Fiber
```

Analytics:

```text
PostHog
or
Google Analytics
```

Deployment:

```text
Vercel
or
Cloudflare
```

서비스는 대부분 client-side computation이므로 서버 비용이 매우 낮아야 한다.

---

# 20. Mobile First

주 유입 경로:

```text
Instagram Reel
→ Profile Link
→ Mobile Browser
```

따라서 390px viewport를 우선 설계한다.

핵심 버튼은 thumb reachable.

사용자가 페이지 진입 후 **5초 이내 시뮬레이션 시작**할 수 있어야 한다.

---

# 21. AdSense Monetization

수익 모델:

> **무료 서비스 + Google AdSense**

단, 광고가 핵심 몰입을 깨뜨리면 안 된다.

## Recommended Placement

### A. Setup Screen

번호 선택 완료 후 CTA 아래.

```text
[시뮬레이션 시작]

--- ad ---
```

### B. Simulation Screen

Desktop: right sidebar.

Mobile: stats 아래 또는 화면 하단의 non-intrusive 영역.

추첨기 바로 위에 광고를 넣지 않는다.

### C. Result Screen

결과 stats와 공유 CTA 사이 또는 공유 CTA 이후.

결과를 보기 위해 광고 클릭/시청을 강제하지 않는다.

## Ad Policy Requirement

본 서비스에는 실제 돈을 베팅하거나 경품을 획득하는 기능이 없다.

즉:

```text
실제 복권 구매 기능 없음
베팅 기능 없음
현금/상품 지급 없음
구매 사이트 affiliate link 없음
```

그러나 로또 시뮬레이션은 Google 정책상 **simulated gambling / social casino 계열의 민감 콘텐츠로 분류될 가능성**이 있으므로 AdSense 승인 및 광고 게재량을 보장하지 않는다.

Google 정책 검토 후 production AdSense를 활성화한다.

AdSense integration은 feature flag:

```text
NEXT_PUBLIC_ADS_ENABLED=false
```

로 on/off 가능하도록 설계한다.

---

# 22. Responsible Messaging

서비스 하단:

> 이 서비스는 확률 체험을 위한 시뮬레이션이며 실제 복권 당첨 결과를 예측하지 않습니다.

> 실제 복권 구매를 권유하거나 당첨을 보장하지 않습니다.

과도한 구매를 부추기는 카피 금지.

예:

```text
❌ 이 번호면 당첨됩니다
❌ 지금 바로 로또를 사세요
❌ 당첨 확률을 높여드립니다

✅ 확률을 직접 체험해보세요
✅ 같은 번호로 몇 년 걸리는지 시뮬레이션
```

---

# 23. Analytics

필수 event:

```text
landing_view
start_click
weekly_games_selected
manual_number_selected
auto_number_selected
simulation_started
simulation_speed_changed
simulation_100_years
simulation_1000_years
simulation_10000_years
first_prize_reached
result_share_click
result_share_success
replay_same_numbers
replay_new_numbers
ad_impression
```

---

# 24. Primary KPI

서비스 성공의 핵심은 광고 매출보다 먼저 **사람들이 끝까지 체험하고 공유하는지**다.

Primary:

```text
Simulation Start Rate
```

목표:

```text
Landing 방문자 → Simulation 시작
50%+
```

Secondary:

```text
Result completion rate
Share click rate
Replay rate
Average session duration
Instagram → website CTR
```

초기 목표:

```text
Share click rate: 5%+
Replay rate: 15%+
```

---

# 25. SEO / Share Metadata

Title:

```text
나는 로또 1등까지 몇 년 걸릴까? | [서비스명]
```

Description:

```text
매주 로또를 산다면 1등에 당첨되기까지 얼마나 걸릴까요?
직접 번호를 선택하고 시간을 돌려보세요.
```

OG card:

```text
로또 1등까지
나는 몇 년 걸릴까?
```

---

# 26. MVP Scope

반드시 구현:

```text
Landing
주간 게임 수 선택
번호 직접 선택
번호 자동 선택
로또 용지 UI
추첨 시뮬레이션
Web Worker
추첨기 animation
시간 counter
총 구매 금액
등수 count
1등까지 자동 simulation
결과 page
공유 card
Replay
Mobile responsive
Analytics
AdSense placeholder / feature flag
```

---

# 27. Not MVP

초기에는 만들지 않는다.

```text
회원가입
로그인
랭킹
댓글
친구 시스템
실제 복권 구매 연결
추천 번호 AI
당첨 번호 예측
번호 통계 분석
과거 당첨 번호 DB
커뮤니티
결제
Native app
```

이 제품은 기능 수가 아니라 **경험 자체**가 핵심이다.

---

# 28. Performance Requirements

Target:

```text
First Contentful Paint < 1.5s
Mobile interaction ready < 2s
60fps UI animation where practical
```

초고속 simulation 중 main UI는 freeze되지 않아야 한다.

대량 simulation은 Web Worker batch 처리.

DOM에 각 추첨 결과를 계속 추가하지 않는다.

최신 상태만 렌더링.

---

# 29. Accessibility

- 숫자 공은 색상만으로 구별하지 않는다.
- number text 항상 표시.
- animations에 `prefers-reduced-motion` 대응.
- 모든 button keyboard accessible.
- animation 없이도 결과 확인 가능.

---

# 30. Development Phases

## Phase 0 — Probability Engine

UI 개발 전 먼저 검증.

Tests:

```text
6 unique numbers generated
bonus never overlaps winning numbers
rank calculation correct
weekly game count correct
spent amount correct
elapsed week/year conversion correct
```

Monte Carlo test를 통해 결과 분포가 이론 확률과 크게 어긋나지 않는지 확인.

## Phase 1 — UI Prototype

Mock으로 구현:

```text
Landing
Setup
Simulation
Result
```

이 단계에서 시각 reference 반영.

## Phase 2 — Worker Simulation

Simulation engine을 Web Worker로 이동.

1M+ simulations에서도 UI가 멈추지 않는지 확인.

## Phase 3 — Visual Immersion

추가:

```text
ticket marking
lottery machine
ball drawing
sound
win animation
```

## Phase 4 — Share

결과 card 생성 + Web Share API.

## Phase 5 — Analytics

event tracking.

## Phase 6 — AdSense

Google Publisher 정책 검토 후 enable.

광고가 UX/성능에 주는 영향 측정.

---

# 31. Reel ↔ Product Connection

릴스에서 보여준 UI가 실제 사이트에 그대로 존재해야 한다.

릴스:

> “여러분 저 로또 당첨됐어요!”

결과 UI:

```text
🎉 1등 당첨!

153,428년 만에요.
```

릴스:

> “기다리기 심심해서 만들어봤습니다.”

Website CTA:

```text
내 1등은 몇 년 뒤?
```

릴스:

> “15만 년 뒤에 당첨이에요.”

Share Card:

```text
나는 153,428년 걸렸습니다.
```

**홍보 영상과 제품 경험이 같은 이야기를 해야 한다.**

---

# 32. Suggested Screen Copy

## Landing

```text
당신은 몇 년 뒤
로또 1등이 될까요?

매주 살 게임 수와 번호를 정하고
1등이 나올 때까지 시간을 돌려보세요.

[내 로또 인생 시작하기]
```

## Setup

```text
매주 얼마나 사실 건가요?

○ 1게임 / 주
● 5게임 / 주
○ 10게임 / 주
○ 직접 입력

이번 주 번호

[직접 선택]
[전부 자동]

[추첨 시작]
```

## Simulation

```text
진행 회차
654,316회

흘러간 시간
12,583년

[멈추기]
[속도 MAX]
```

필요하다면 매우 작은 보조 정보:

```text
총 구매 금액
₩654,316,000
```

## Result

1등 당첨 시:

```text
🎉 드디어 1등입니다!

153,428년 만에요.

매주 5게임씩 구매했다면

진행 회차 7,978,308회
총 구매 금액 ₩39,891,540,000

[공유하기]

[같은 번호로 다시]
[새 번호로 다시]
```

1등 미당첨 상태에서 사용자가 멈춘 경우:

```text
여기서 멈췄습니다.

아직 1등은 나오지 않았어요.

흘러간 시간 12,583년
진행 회차 654,316회
총 구매 금액 ₩654,316,000

[공유하기]

[같은 번호로 다시]
[새 번호로 다시]
```

---

# 33. Design Principle

모든 디자인 의사결정은 이 세 질문으로 판단한다.

### 1.

> 이 요소가 **시간의 규모를 체감**하게 만드는가?

### 2.

> 사용자가 **실제로 로또를 사는 느낌**을 강화하는가?

### 3.

> 결과를 **친구에게 보여주고 싶게** 만드는가?

셋 중 어느 것에도 해당하지 않는 기능은 우선순위를 낮춘다.

---

# 34. Claude Code Implementation Instruction

아래 지시사항을 프로젝트 구현 Agent에게 함께 전달한다.

```text
You are the lead engineer and product-focused frontend developer for this project.

Read the entire PRD before writing code.

The product is not a generic lottery statistics dashboard.
Its purpose is to let users emotionally experience how long it can take to win the lottery.

The core story is:

"How many years would it take me to win first prize if I bought lottery tickets every week?"

Before coding:

1. Inspect all reference screenshots/assets provided in /references.
2. Extract visual characteristics from them, but do not directly copy official logos, trademarks, or pixel-identical UI.
3. Create a short implementation plan.
4. Implement the probability engine and tests first.
5. Then implement the mobile-first UI.
6. Move heavy simulation work to a Web Worker.
7. Keep animation and simulation logic separated.
8. Make sure MAX-speed simulation never blocks the main UI thread.
9. Treat the lottery-machine visualization and ticket-marking interaction as important product features, not decorative extras.
10. Do not add features outside the MVP scope.

Use current stable versions of the chosen web technologies at implementation time.

The first deliverable should include:

- working lottery probability engine
- test coverage for prize rank calculations
- mobile landing/setup screen
- ticket-style number selector
- simulation screen
- Web Worker based batch simulation
- elapsed-year counter
- total spending counter
- first-prize stopping condition
- result screen

Do not implement AdSense until the core experience works.

Add an AdSense placeholder and feature flag so advertising can be enabled later after policy review.

After the first implementation, report:

- simulation performance
- simulations per second
- time required for 1 million simulations
- browser/mobile performance issues
- any probability-engine risks
- recommended optimization
```

---

# 35. Launch Checklist

```text
[ ] 확률 로직 unit test
[ ] 1~45 중복 없는 번호 생성
[ ] 1~5등 판정 검증
[ ] mobile 390px QA
[ ] Web Worker stress test
[ ] MAX mode에서 UI freeze 없는지 확인
[ ] share card 생성
[ ] Instagram in-app browser test
[ ] Safari iPhone test
[ ] Android Chrome test
[ ] official lottery branding 혼동 여부 확인
[ ] responsible-use disclaimer
[ ] analytics events
[ ] AdSense policy review
[ ] ads feature flag off 상태로 launch 가능
```

---

# 36. Core Rule

이 프로젝트에서 가장 중요한 원칙:

> **“로또 통계를 많이 보여주는 사이트”를 만들지 않는다.**

만들어야 하는 것은:

> **“내 번호로 1등까지 몇 년 걸리는지 직접 체감하는 사이트.”**

기능보다 **스토리와 몰입감**을 우선한다.
