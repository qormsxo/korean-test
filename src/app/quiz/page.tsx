import type { Metadata } from "next";
import { Quiz } from "./Quiz";
import { getCurrentSetQuestions } from "@/lib/quiz";
import { CURRENT_SET } from "@/lib/sets";

export const metadata: Metadata = { title: "문제 풀기 — 내 한국어 실력 유형 테스트", robots: { index: false } };

export default function QuizPage() {
  return (
    <Quiz questions={getCurrentSetQuestions()} setId={CURRENT_SET.id} normChangedIds={[...CURRENT_SET.normChangedIds]} />
  );
}
