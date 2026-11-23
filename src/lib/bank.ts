// 문제은행 원본(data/korean_quiz_bank.json)을 읽는 유일한 통로.
// 문항 내용(context·question·선택지·answer·why_correct·why_wrong)은 가공하지 않고 그대로 전달한다.
import rawBank from "../../data/korean_quiz_bank.json";

export type OptionKey = "A" | "B" | "C" | "D";
export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export type RawQuestion = {
  id: string;
  category: string;
  domain: string;
  area: string;
  target: string;
  context: string;
  question: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  answer: string;
  answer_text: string;
  why_correct: string;
  why_wrong: string;
  basis: string;
  source_urls: string;
  controversy: string;
  difficulty: string;
  error_cause: string;
  certainty: string;
  caution: string;
  solve_type: string;
  fun_score: number;
  learning_score: number;
  share_score: number;
  viral_potential: number;
  educational_value: number;
};

/** 결과 계산에 쓰는 4개 영역. JSON의 domain 값과 1:1로 대응한다. */
export const DOMAINS = ["어휘력", "표기", "문해력", "띄어쓰기"] as const;
export type Domain = (typeof DOMAINS)[number];

/** JSON domain 원문 → 영역 키. 새 domain 값이 생기면 여기서 실패하도록 둔다. */
const DOMAIN_MAP: Record<string, Domain> = {
  어휘력: "어휘력",
  "표기(맞춤법·표준어·외래어)": "표기",
  문해력: "문해력",
  띄어쓰기: "띄어쓰기",
};

export function toDomain(raw: string): Domain {
  const d = DOMAIN_MAP[raw];
  if (!d) throw new Error(`알 수 없는 domain 값: ${raw}`);
  return d;
}

export const bank = rawBank as RawQuestion[];
const byId = new Map(bank.map((q) => [q.id, q]));

export function getRawQuestion(id: string): RawQuestion {
  const q = byId.get(id);
  if (!q) throw new Error(`문제은행에 없는 문항 ID: ${id}`);
  return q;
}

