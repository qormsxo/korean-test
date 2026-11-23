// 연령대: 저장만 하고 결과 판정에는 쓰지 않는다. 나중에 연령대별 정답률 비교에 사용.
export const AGE_GROUPS = [
  { key: "10s", label: "10대" },
  { key: "20s", label: "20대" },
  { key: "30s", label: "30대" },
  { key: "40s", label: "40대" },
  { key: "50s", label: "50대" },
  { key: "60plus", label: "60대 이상" },
  { key: "undisclosed", label: "밝히지 않음" },
] as const;

export type AgeGroupKey = (typeof AGE_GROUPS)[number]["key"];

export function isAgeGroupKey(v: unknown): v is AgeGroupKey {
  return typeof v === "string" && AGE_GROUPS.some((a) => a.key === v);
}
