// 결과 유형 이름(보고서 10장)과 설명 문구.
// 설명 문구는 초안이다. A01 caution에 따라 '모르면 무식하다'는 식의 표현을 쓰지 않는다.
// 'grower'(기본 유형)는 보고서에 없어 새로 추가한 유형이다.

export const RESULT_TYPE_KEYS = ["guardian", "classic", "strict", "practical", "intuitive", "grower"] as const;
export type ResultTypeKey = (typeof RESULT_TYPE_KEYS)[number];

export type ResultTypeInfo = {
  name: string;
  emoji: string;
  headline: string;
  description: string;
};

export const RESULT_TYPES: Record<ResultTypeKey, ResultTypeInfo> = {
  guardian: {
    name: "국어사전 수호자",
    emoji: "📖",
    headline: "헷갈릴 때 다들 먼저 물어보는 사람",
    description:
      "어휘, 표기, 띄어쓰기, 문해력 어느 쪽도 흔들리지 않았어요. 사전을 펴 보기 전에 이미 답을 알고 있는 타입입니다.",
  },
  classic: {
    name: "옛 규범에 머문 클래식파",
    emoji: "🎻",
    headline: "기본기는 탄탄, 업데이트만 남았어요",
    description:
      "대부분 정확했지만 규범이 바뀐 말에서 예전 기준을 골랐어요. '짜장면'도 '너무 좋다'도 지금은 맞는 말입니다. 예전에 배운 대로 답한 것이니 틀렸다기보다 기준이 바뀐 거예요.",
  },
  strict: {
    name: "엄격한 맞춤법 꼰대",
    emoji: "🧐",
    headline: "맞춤법은 완벽, 행간은 아직",
    description:
      "표기 문항은 하나도 놓치지 않았어요. 다만 안내문·공고의 속뜻을 읽는 문항에서 미끄러졌습니다. 맞춤법만큼 맥락도 챙기면 빈틈이 없어요.",
  },
  practical: {
    name: "문맥으로 살아남는 실전파",
    emoji: "🧭",
    headline: "철자는 흔들려도 뜻은 정확히",
    description:
      "표기는 조금 헷갈려도 글이 무슨 말을 하는지는 정확히 읽어 냈어요. 실제 소통에서 강한 타입입니다. 자주 틀리는 표기 몇 개만 익히면 됩니다.",
  },
  intuitive: {
    name: "감으로 쓰는 언어 천재",
    emoji: "✨",
    headline: "단어 뜻은 척척, 띄어쓰기는 감으로",
    description:
      "낱말의 뜻은 정확히 알고 있지만 붙일지 띄울지는 감에 맡기는 편이에요. '두 번으로 바꿔 말이 되면 띄어 쓴다' 같은 요령만 챙기면 완성형입니다.",
  },
  grower: {
    name: "차곡차곡 성장형",
    emoji: "🌱",
    headline: "해설을 읽을수록 오르는 타입",
    description:
      "특정 영역에 치우치지 않고 고르게 맞히고 고르게 틀렸어요. 오늘 본 해설만 다시 훑어봐도 다음 점수가 확 달라질 거예요.",
  },
};

export function isResultTypeKey(v: string): v is ResultTypeKey {
  return (RESULT_TYPE_KEYS as readonly string[]).includes(v);
}
