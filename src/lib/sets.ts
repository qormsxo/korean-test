// 출제 세트. 보고서 10장 '초기 웹서비스에 넣을 20문항 추천 세트'의 순서를 그대로 따른다.
export const SET_V1 = {
  id: "v1",
  questionIds: [
    "A02", "A03", "A12", "A06", "B04",
    "A01", "A17", "B05", "A04", "A05",
    "A18", "B15", "E03", "E18", "F06",
    "A22", "B13", "C16", "B17", "G01",
  ],
  /** '옛 규범에 머문 클래식파' 판정에 쓰는 규범 변경 문항(보고서 10장: A17·A18 등). */
  normChangedIds: ["A17", "A18"],
} as const;

export const CURRENT_SET = SET_V1;
