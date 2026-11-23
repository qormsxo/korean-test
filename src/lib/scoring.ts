// 채점과 결과 유형 판정(순수 함수 — 문제은행을 직접 읽지 않아 클라이언트에서도 쓴다).
// 연령대는 입력으로 받지 않는다(유형 판정에 쓰지 않음).
import type { Domain, OptionKey } from "./bank";
import type { ResultTypeKey } from "./resultTypes";

const DOMAIN_LIST: Domain[] = ["어휘력", "표기", "문해력", "띄어쓰기"];

export type Answers = Record<string, OptionKey>; // questionId → 고른 선택지
export type ScoringItem = { id: string; domain: Domain; answer: string };

export type DomainScore = { correct: number; total: number };
export type ScoreSummary = {
  total: number;
  max: number;
  domains: Record<Domain, DomainScore>;
  correctIds: string[];
};

export function scoreAnswers(items: readonly ScoringItem[], answers: Answers): ScoreSummary {
  const domains = Object.fromEntries(DOMAIN_LIST.map((d) => [d, { correct: 0, total: 0 }])) as Record<Domain, DomainScore>;
  const correctIds: string[] = [];
  for (const q of items) {
    domains[q.domain].total += 1;
    if (answers[q.id] === q.answer) {
      domains[q.domain].correct += 1;
      correctIds.push(q.id);
    }
  }
  return { total: correctIds.length, max: items.length, domains, correctIds };
}

// '높음'·'낮음' 기준(영역 정답 비율). 20문항 세트에서
//   높음 ≥ 0.75 → 어휘력 6/8 이상, 문해력 3/3
//   낮음 ≤ 0.45 → 표기 3/7 이하, 문해력 1/3 이하, 띄어쓰기 0/2
export const HIGH = 0.75;
export const LOW = 0.45;

const ratio = (s: DomainScore) => (s.total === 0 ? 0 : s.correct / s.total);
const high = (s: DomainScore) => ratio(s) >= HIGH;
const low = (s: DomainScore) => ratio(s) <= LOW;
const perfect = (s: DomainScore) => s.total > 0 && s.correct === s.total;

/**
 * 보고서 10장 결과 유형 규칙. 여러 조건에 해당하면 위에서부터 먼저 맞는 유형으로 정한다.
 * normChangedIds: 규범이 바뀐 문항(짜장면, '너무 좋다' 등).
 */
export function decideResultType(summary: ScoreSummary, normChangedIds: readonly string[]): ResultTypeKey {
  const { domains: d, correctIds, max } = summary;
  const correct = new Set(correctIds);

  // 1. 국어사전 수호자: 전체 18점 이상 (90%)
  if (summary.total >= Math.ceil(max * 0.9)) return "guardian";

  // 2. 옛 규범에 머문 클래식파: 규범 변경 문항 모두 오답, 나머지는 75% 이상(18문항 중 14)
  if (normChangedIds.length > 0 && normChangedIds.every((id) => !correct.has(id))) {
    const restMax = max - normChangedIds.length;
    if (summary.total >= Math.ceil(restMax * 0.75)) return "classic";
  }

  // 3. 엄격한 맞춤법 꼰대: 표기 만점, 문해력 낮음
  if (perfect(d["표기"]) && low(d["문해력"])) return "strict";

  // 4. 문맥으로 살아남는 실전파: 문해력 높음, 표기 낮음
  if (high(d["문해력"]) && low(d["표기"])) return "practical";

  // 5. 감으로 쓰는 언어 천재: 어휘력 높음, 띄어쓰기 낮음
  if (high(d["어휘력"]) && low(d["띄어쓰기"])) return "intuitive";

  // 6. 기본 유형
  return "grower";
}
