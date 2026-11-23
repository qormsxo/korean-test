import { describe, expect, it } from "vitest";
import { getRawQuestion, type OptionKey } from "@/lib/bank";
import { decideResultType, scoreAnswers, type Answers } from "@/lib/scoring";
import { scoringItems } from "@/lib/setMeta";
import { CURRENT_SET } from "@/lib/sets";

const ids = CURRENT_SET.questionIds;
const items = scoringItems();
const norm = CURRENT_SET.normChangedIds;
const right = (id: string) => getRawQuestion(id).answer as OptionKey;
const wrong = (id: string) => (["A", "B", "C", "D"] as OptionKey[]).find((k) => k !== right(id))!;
const domainOf = (id: string) => getRawQuestion(id).domain;

/** wrongIds에 든 문항만 틀리고 나머지는 맞힌 답안 */
function answersWrongOn(wrongIds: string[]): Answers {
  return Object.fromEntries(ids.map((id) => [id, wrongIds.includes(id) ? wrong(id) : right(id)]));
}
const idsIn = (domainPrefix: string) => ids.filter((id) => domainOf(id).startsWith(domainPrefix));

function typeOf(a: Answers) {
  return decideResultType(scoreAnswers(items, a), norm);
}

describe("채점", () => {
  it("전부 맞히면 20점, 영역 만점", () => {
    const s = scoreAnswers(items, answersWrongOn([]));
    expect(s.total).toBe(20);
    expect(s.domains["표기"]).toEqual({ correct: 7, total: 7 });
  });
  it("답하지 않은 문항은 오답", () => {
    expect(scoreAnswers(items, {}).total).toBe(0);
  });
});

describe("결과 유형", () => {
  it("18점 이상 → 국어사전 수호자", () => {
    expect(typeOf(answersWrongOn(["A02", "A03"]))).toBe("guardian");
  });

  it("A17·A18만 틀리면 18점이라 수호자가 우선", () => {
    expect(typeOf(answersWrongOn(["A17", "A18"]))).toBe("guardian");
  });

  it("A17·A18 오답 + 나머지 14/18 → 클래식파", () => {
    expect(typeOf(answersWrongOn(["A17", "A18", "A02", "A03", "A12", "C16"]))).toBe("classic");
  });

  it("A17·A18 오답이어도 나머지가 13/18이면 클래식파 아님", () => {
    expect(typeOf(answersWrongOn(["A17", "A18", "A02", "A03", "A12", "C16", "B17"]))).not.toBe("classic");
  });

  it("표기 만점 + 문해력 1/3 → 꼰대", () => {
    const lit = idsIn("문해력");
    expect(typeOf(answersWrongOn([lit[0], lit[1], "A02"]))).toBe("strict");
  });

  it("문해력 3/3 + 표기 3/7 → 실전파", () => {
    const pyo = idsIn("표기").filter((id) => !norm.includes(id as never));
    expect(typeOf(answersWrongOn(pyo.slice(0, 4)))).toBe("practical");
  });

  it("표기 오답에 A17·A18이 함께 있으면 클래식파가 우선", () => {
    expect(typeOf(answersWrongOn(["B04", "A17", "B05", "A18"]))).toBe("classic");
  });

  it("어휘력 6/8 + 띄어쓰기 0/2 → 언어 천재", () => {
    const voc = idsIn("어휘력");
    const sp = idsIn("띄어쓰기");
    expect(typeOf(answersWrongOn([...sp, voc[0], voc[1], "B04"]))).toBe("intuitive");
  });

  it("아무 조건에도 해당하지 않으면 기본 유형", () => {
    expect(typeOf({})).toBe("grower");
  });
});
