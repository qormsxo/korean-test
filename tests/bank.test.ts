import { describe, expect, it } from "vitest";
import { bank, getRawQuestion, OPTION_KEYS, toDomain } from "@/lib/bank";
import { EXPLANATION_NOTES, INTERNAL_CAUTIONS } from "@/lib/notes";
import { getCurrentSetQuestions } from "@/lib/quiz";
import { domainTotals } from "@/lib/setMeta";
import { CURRENT_SET } from "@/lib/sets";

describe("문제은행 검증", () => {
  it("ID가 중복되지 않는다", () => {
    const ids = bank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 문항이 선택지 4개, answer A~D, 알려진 domain을 가진다", () => {
    for (const q of bank) {
      for (const k of OPTION_KEYS) expect(q[`option_${k}`], `${q.id} option_${k}`).toBeTruthy();
      expect(OPTION_KEYS, q.id).toContain(q.answer);
      expect(() => toDomain(q.domain), q.id).not.toThrow();
    }
  });
});

describe("출제 세트 v1", () => {
  it("보고서 10장의 20문항이 모두 문제은행에 있다", () => {
    expect(CURRENT_SET.questionIds).toHaveLength(20);
    for (const id of CURRENT_SET.questionIds) expect(() => getRawQuestion(id)).not.toThrow();
  });

  it("영역 구성이 어휘력 8 · 표기 7 · 문해력 3 · 띄어쓰기 2 이다", () => {
    expect(domainTotals()).toEqual({ 어휘력: 8, 표기: 7, 문해력: 3, 띄어쓰기: 2 });
  });

  it("문항 내용은 JSON 원문과 글자 하나까지 같다", () => {
    for (const q of getCurrentSetQuestions()) {
      const raw = getRawQuestion(q.id);
      expect(q.context).toBe(raw.context);
      expect(q.question).toBe(raw.question);
      expect(q.answer).toBe(raw.answer);
      expect(q.whyCorrect).toBe(raw.why_correct);
      expect(q.whyWrong).toBe(raw.why_wrong);
      for (const o of q.options) expect(o.text).toBe(raw[`option_${o.key}`]);
    }
  });

  it("caution이 있거나 certainty가 '보통'인 문항은 반영 방식이 모두 정해져 있다", () => {
    for (const id of CURRENT_SET.questionIds) {
      const raw = getRawQuestion(id);
      const needs = raw.caution.trim() !== "" || raw.certainty === "보통";
      if (!needs) continue;
      const handled = id in EXPLANATION_NOTES || id in INTERNAL_CAUTIONS;
      expect(handled, `${id}의 caution 처리 방식이 notes.ts에 없음: ${raw.caution}`).toBe(true);
    }
  });

  it("certainty '보통' 문항은 화면 주의 문구가 있다", () => {
    for (const id of CURRENT_SET.questionIds) {
      if (getRawQuestion(id).certainty !== "보통") continue;
      expect(EXPLANATION_NOTES[id]?.length, id).toBeGreaterThan(0);
    }
  });
});
