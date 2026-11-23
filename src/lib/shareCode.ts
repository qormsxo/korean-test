// 공유 URL 코드: /r/{유형}-{어휘}{표기}{문해}{띄어}  예) /r/guardian-8732
// DB 조회 없이 결과 페이지와 공유 카드를 만들 수 있게 결과를 URL에 담는다.
// 개인 정보와 연령대는 넣지 않는다.
import { DOMAINS, type Domain } from "./bank";
import { isResultTypeKey, type ResultTypeKey } from "./resultTypes";
import type { ScoreSummary } from "./scoring";

export type SharedResult = {
  type: ResultTypeKey;
  domains: Record<Domain, { correct: number; total: number }>;
  total: number;
  max: number;
};

export function encodeShareCode(type: ResultTypeKey, summary: ScoreSummary): string {
  return `${type}-${DOMAINS.map((d) => summary.domains[d].correct).join("")}`;
}

/** domainTotals: 현재 세트의 영역별 문항 수. 범위를 벗어난 코드는 null. */
export function decodeShareCode(
  code: string,
  domainTotals: Record<Domain, number>,
): SharedResult | null {
  const m = /^([a-z]+)-(\d{4})$/.exec(code);
  if (!m || !isResultTypeKey(m[1])) return null;
  const digits = m[2].split("").map(Number);
  const domains = {} as SharedResult["domains"];
  let total = 0;
  let max = 0;
  for (const [i, d] of DOMAINS.entries()) {
    const t = domainTotals[d];
    if (digits[i] > t) return null;
    domains[d] = { correct: digits[i], total: t };
    total += digits[i];
    max += t;
  }
  return { type: m[1], domains, total, max };
}
