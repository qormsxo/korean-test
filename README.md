# 내 한국어 실력 유형 테스트

연령대 선택 → 20문항(문항마다 정답·짧은 해설) → 결과 유형 → 공유 카드. 점수는 화면에 내지 않고 유형 판정과 로그에만 쓴다.
Next.js 16 (App Router) · Supabase · Vercel.

## 실행

```
npm install
cp .env.example .env.local   # Supabase 값은 비워도 동작
npm run dev                  # http://localhost:3000
npm test                     # 문제은행·채점·결과 유형 테스트
```

## 구조

| 경로 | 역할 |
|---|---|
| `data/korean_quiz_bank.json` | 문제은행 원본. **수정하지 않음** (테스트가 화면 문항 = JSON 원문인지 검사) |
| `src/lib/questionVoice.ts` | 화면에 보일 질문 문장(말투만 바꿈). 원문 질문이 바뀌면 테스트가 재검토를 요구 |
| `src/lib/sets.ts` | 출제 세트 v1 (보고서 10장 20문항 순서), 규범 변경 문항(A17·A18) |
| `src/lib/notes.ts` | `caution` 반영 방식: 화면에 보일 해설 메모 / 노출하지 않는 출제자용 메모 |
| `src/lib/scoring.ts` | 채점·결과 유형 판정(연령대 미사용) |
| `src/lib/resultTypes.ts` | 결과 유형 이름·설명 문구 |
| `src/app/api/events` | 풀이 로그 수집(서버에서 다시 채점) |
| `supabase/migrations/0001_init.sql` | 로그 테이블·연령대별 정답률 뷰 |
| `src/app/r/[code]` | 결과 페이지 + 공유 카드(`opengraph-image`). URL은 유형만: `/r/{유형}` (6개 모두 빌드 때 생성) |

## 결과 유형 규칙 (내부 판정용, 위에서부터 먼저 맞는 것)

1. 국어사전 수호자 — 총점 18 이상
2. 옛 규범에 머문 클래식파 — A17·A18 모두 오답 + 나머지 18문항 중 14 이상
3. 엄격한 맞춤법 꼰대 — 표기 7/7 + 문해력 1/3 이하
4. 문맥으로 살아남는 실전파 — 문해력 3/3 + 표기 3/7 이하
5. 감으로 쓰는 언어 천재 — 어휘력 6/8 이상 + 띄어쓰기 0/2
6. 차곡차곡 성장형 — 그 밖의 경우

## 문항을 추가·교체할 때

1. `data/korean_quiz_bank.json`에 같은 필드로 추가
2. `sets.ts`에 새 세트를 만들고 `CURRENT_SET` 교체 (로그의 `set_id`·`bank_hash`로 버전이 구분됨)
3. `npm test` — `caution`이 있거나 `certainty`가 '보통'인 문항은 `notes.ts`에 처리 방식을 적어야 통과
