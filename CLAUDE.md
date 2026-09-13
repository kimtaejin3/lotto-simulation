@AGENTS.md

# 15만년 로또

- 제품 스펙: `PRD.md` 전체를 먼저 읽을 것. 핵심 원칙: 통계 대시보드가 아니라 "시간 체감" 경험.
- 시각 방향: 한국 로또 용지/추첨기 감성을 귀엽게 재해석. `references/` 사진은 분위기 참고용이며 그대로 복제하지 않는다. 공식 로고/UI 복제 금지.
- 무거운 시뮬레이션은 반드시 `src/workers/sim.worker.ts`에서. 메인 스레드는 애니메이션/카운터만.
- 확률을 조작하지 않는다. 엔진 변경 시 `pnpm test` 필수.
- 스타일: Tailwind v4 토큰은 `src/app/globals.css`. 디스플레이 폰트 Jua, 본문 Noto Sans KR.
