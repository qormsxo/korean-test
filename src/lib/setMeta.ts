// 서버 전용: 문제은행에서 세트 메타데이터를 만든다.
import { createHash } from "node:crypto";
import { bank, DOMAINS, getRawQuestion, toDomain, type Domain } from "./bank";
import type { ScoringItem } from "./scoring";
import { CURRENT_SET } from "./sets";

/** 현재 세트의 영역별 문항 수 (어휘력 8 · 표기 7 · 문해력 3 · 띄어쓰기 2). */
export function domainTotals(ids: readonly string[] = CURRENT_SET.questionIds): Record<Domain, number> {
  const t = Object.fromEntries(DOMAINS.map((d) => [d, 0])) as Record<Domain, number>;
  for (const id of ids) t[toDomain(getRawQuestion(id).domain)] += 1;
  return t;
}

export function scoringItems(ids: readonly string[] = CURRENT_SET.questionIds): ScoringItem[] {
  return ids.map((id) => {
    const q = getRawQuestion(id);
    return { id, domain: toDomain(q.domain), answer: q.answer };
  });
}

/** 문제은행 내용 해시(앞 12자). 문항이 바뀌어도 로그를 버전별로 나눠 볼 수 있게 세션에 함께 저장한다. */
export const BANK_HASH = createHash("sha256").update(JSON.stringify(bank)).digest("hex").slice(0, 12);
