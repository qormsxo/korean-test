// 화면에 내려보낼 문항 형태. 서버 컴포넌트에서만 만들고 클라이언트에는 출제 세트 20문항만 전달한다.
import { displayBasis, getRawQuestion, OPTION_KEYS, toDomain, type Domain, type OptionKey } from "./bank";
import { EXPLANATION_NOTES, type ExplanationNote } from "./notes";
import { CURRENT_SET } from "./sets";

export type QuizQuestion = {
  id: string;
  target: string; // 문항이 다루는 표현(다시 보기 목록 제목용)
  domain: Domain;
  difficulty: string;
  context: string;
  question: string;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
  whyCorrect: string;
  whyWrong: string;
  basis: string;
  moderateCertainty: boolean;
  notes: ExplanationNote[];
};

export function toQuizQuestion(id: string): QuizQuestion {
  const q = getRawQuestion(id);
  return {
    id: q.id,
    target: q.target,
    domain: toDomain(q.domain),
    difficulty: q.difficulty,
    context: q.context,
    question: q.question,
    options: OPTION_KEYS.map((key) => ({ key, text: q[`option_${key}`] })),
    answer: q.answer as OptionKey,
    whyCorrect: q.why_correct,
    whyWrong: q.why_wrong,
    basis: displayBasis(q.basis),
    moderateCertainty: q.certainty === "보통",
    notes: EXPLANATION_NOTES[q.id] ?? [],
  };
}

export function getCurrentSetQuestions(): QuizQuestion[] {
  return CURRENT_SET.questionIds.map(toQuizQuestion);
}
