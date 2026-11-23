// caution 필드를 해설에 '반영'하는 방식.
//
// JSON의 caution에는 사용자에게 보여 줄 내용(해설 팁, 주의점)과 출제자용 메모
// (출처 보강, 세트 출제 권장 등)가 섞여 있다. 출제자용 메모를 그대로 노출하지 않도록
// 출제 세트의 caution 있는 문항은 모두 아래 둘 중 하나로 분류해야 한다
// (tests/bank.test.ts가 분류 누락을 잡는다).
//
//  - EXPLANATION_NOTES: 해설 아래 '알아두세요' 박스로 보여 줄 문구.
//    caution 지시를 따라 작성한 문구이며, 원문 caution은 주석으로 남긴다.
//  - INTERNAL_CAUTIONS: 화면에 노출하지 않는 출제자용 메모와, 그 메모가 어떻게 반영됐는지.

export type ExplanationNote =
  | { kind: "tip"; text: string }
  | { kind: "caution"; text: string }
  | { kind: "rule"; title: string; text: string; source: string };

export const EXPLANATION_NOTES: Record<string, ExplanationNote[]> = {
  // caution: "해설 팁: 자리에 '해요/하요'를 넣어 보면 '해요'가 되므로 '봬요'."
  B04: [
    {
      kind: "tip",
      text: "헷갈리면 그 자리에 '하/해'를 넣어 보세요. '하요'가 아니라 '해요'가 자연스러우므로 '봬요'가 맞습니다.",
    },
  ],
  // caution: "'답안지를 정답과 맞추어 보다'는 '맞추다'가 맞다는 점을 해설에 넣을 것."
  B05: [
    {
      kind: "tip",
      text: "반대로 '답안지를 정답과 맞추어 보다'처럼 둘을 견주어 볼 때는 '맞추다'가 맞습니다.",
    },
  ],
  // certainty: 보통
  // caution: "'○명=한 자릿수'는 규정 조항이 아니라 관행이다. 정답 문구를 '흔히 쓰는 의미'로 한정해 출제할 것."
  A05: [
    {
      kind: "caution",
      text: "'○명=한 자릿수'는 어문 규정에 적힌 조항이 아니라 공고문에서 흔히 쓰는 관행적 표기입니다. 그래서 이 문항은 '흔히 쓰는 의미'를 기준으로 정답을 정했습니다.",
    },
  ],
  // caution: "정답 공개 시 반발이 예상되는 문항. 해설에 규정 원문을 꼭 붙일 것."
  A22: [
    {
      kind: "rule",
      title: "규정 원문",
      text: "사이시옷은 다음과 같은 경우에 받치어 적는다. 1. 순 우리말로 된 합성어로서 앞말이 모음으로 끝난 경우 (1) 뒷말의 첫소리가 된소리로 나는 것",
      source: "한글 맞춤법 제30항",
    },
  ],
};

export const INTERNAL_CAUTIONS: Record<string, string> = {
  A02: "출처 보강 메모(2020년 원 보도). 노출하지 않음.",
  A01: "결과 문구 지침('모르는 사람=무식' 프레임 금지). resultTypes.ts 문구 작성에 반영.",
  A04: "정치적 중립 지침. 문제 본문이 이미 '정치인 A'로 실명을 빼고 있어 추가 조치 없음.",
  A18: "'꼰대' 유형 연결 메모. 규범 변경 문항으로 SET_V1.normChangedIds에 반영.",
  B13: "세트 구성 메모(B12와 세트 출제 권장). 초기 세트에는 B12가 없어 노출하지 않음.",
  C16: "근거 메모(사전 근거만 있음, 출제 전 표준국어대사전 재확인 필요). 노출하지 않음.",
};

/** certainty가 '보통'인 문항에 붙는 고정 배지 문구. */
export const MODERATE_CERTAINTY_BADGE = "문맥에 따라 판단이 갈릴 수 있는 문항";
