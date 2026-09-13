# 15만년 로또 — 평생 로또 시뮬레이터

"매주 로또를 산다면 1등까지 몇 년 걸릴까?"를 시간 흐름으로 체감하게 만드는 인터랙티브 웹서비스. 제품 정의는 [PRD.md](./PRD.md) 참고.

## 개발

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # 확률 엔진 vitest
pnpm lint
pnpm build
```

환경 변수는 `.env.example` 참고. `NEXT_PUBLIC_ADS_ENABLED=true` 로 AdSense 슬롯을 켤 수 있다(기본 off).

## 구조

```
src/lib/lotto/      확률 엔진 (engine.ts, rng.ts, time.ts) + 테스트
src/workers/        sim.worker.ts — 배치 시뮬레이션 Web Worker
src/store/          setup.ts — 게임 수/번호 상태 (sessionStorage)
src/components/
  ticket/           로또 마킹 용지 UI
  machine/          Canvas 추첨기(Drum) + 당첨 공 슬롯
  sim/              시뮬레이션 화면, 시간 카운터, 속도 컨트롤
  result/           결과 패널, 공유 카드
src/app/            / (랜딩) · /setup · /simulate · /share-preview (dev 전용)
references/         시각 레퍼런스 사진 (복제 금지, 분위기 참고용)
```

## 엔진 메모

- 6/45, 보너스 포함. 등수 판정은 비트마스크 popcount.
- RNG: xoshiro128** (crypto.getRandomValues 시드). 용지 자동 선택은 crypto 직접 사용.
- 처리량: 약 2M 주/초 (Node 22, M-series). UI 최고 속도는 1만x(초당 5,000주)로 제한해 시간 체감을 유지한다. 매주 5게임 기준 1등까지 평균 약 1.6M주 → 1만x에서 약 5분.
