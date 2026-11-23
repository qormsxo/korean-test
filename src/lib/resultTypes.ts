// 결과 유형(보고서 10장 이름 + 기본 유형 1개)과 화면 문구.
// - 유형 '판정'은 답으로만 한다(scoring.ts). 연령대는 판정에 쓰지 않는다.
// - 연령대는 같은 유형에 '또래 버전' 별명과 한 줄을 덧입히는 데만 쓴다(재미용).
// - A01 caution: '모르면 무식하다'는 식의 표현은 쓰지 않는다.
import type { AgeGroupKey } from "./ageGroups";

export const RESULT_TYPE_KEYS = ["guardian", "classic", "strict", "practical", "intuitive", "grower"] as const;
export type ResultTypeKey = (typeof RESULT_TYPE_KEYS)[number];

/** 또래 버전이 있는 연령대('밝히지 않음' 제외) */
export const FLAVOR_AGE_KEYS = ["10s", "20s", "30s", "40s", "50s", "60plus"] as const satisfies readonly AgeGroupKey[];
export type FlavorAgeKey = (typeof FLAVOR_AGE_KEYS)[number];

export type AgeFlavor = { title: string; line: string };

export type ResultTypeInfo = {
  name: string;
  emoji: string;
  headline: string;
  description: string;
  traits: string[]; // '이런 적 있다면 찐' 체크리스트
  ages: Record<FlavorAgeKey, AgeFlavor>;
};

export const RESULT_TYPES: Record<ResultTypeKey, ResultTypeInfo> = {
  guardian: {
    name: "국어사전 수호자",
    emoji: "📖",
    headline: "단톡방 맞춤법 경찰, 출동 대기 중",
    description:
      "남의 오타를 보면 손가락이 먼저 움찔하는 타입. 그래도 대놓고 지적하진 않고 속으로만 고쳐 읽는 배려심까지 갖췄어요. 주변에서 '이거 맞아?'를 제일 많이 듣는 사람, 바로 당신입니다.",
    traits: ["'됬다'를 보면 하루 종일 신경 쓰인다", "사과문은 내용보다 맞춤법이 먼저 보인다", "맞춤법 검사기보다 내 눈을 더 믿는다"],
    ages: {
      "10s": { title: "교과서 밖 국어 1타", line: "국어 선생님이 몰래 조교로 쓰고 싶어 하는 학생" },
      "20s": { title: "자소서 첨삭 요정", line: "친구들 자소서가 결국 당신 손을 거쳐 갑니다" },
      "30s": { title: "회의록 최종 검수자", line: "결재 올리기 전 마지막 관문, 그게 바로 당신" },
      "40s": { title: "가정통신문 감수위원", line: "아이 숙제 봐 주다 교재 오타까지 찾아낸 적 있죠?" },
      "50s": { title: "가족 단톡방 교정 담당", line: "명절 공지는 당신이 다시 써서 올려야 마음이 놓여요" },
      "60plus": { title: "신문 정독 내공 고수", line: "사설 속 오자 하나도 놓치지 않는 진짜 고수" },
    },
  },
  classic: {
    name: "옛 규범에 머문 클래식파",
    emoji: "🎻",
    headline: "내 머릿속 국어사전은 아직 업데이트 전",
    description:
      "배운 대로 정확하게 쓰는데, 그사이 사전이 몰래 업데이트됐어요. '짜장면'이 표준어가 된 걸 오늘 알았다면 당신은 의리파 클래식. 틀린 게 아니라 기준이 바뀐 거예요.",
    traits: ["메뉴판의 '짜장면'이 아직 살짝 어색하다", "'너무 좋다'는 왠지 틀린 말 같다", "한번 외운 건 끝까지 믿는 의리파다"],
    ages: {
      "10s": { title: "선생님보다 더 클래식", line: "또래 중에 제일 정통파, 기준이 살짝 레트로해요" },
      "20s": { title: "뉴트로 감성 국어러", line: "옷만 레트로가 아니라 맞춤법도 레트로" },
      "30s": { title: "그 시절 교과서 수석", line: "그때 그 교과서 기준으로는 분명 만점이었어요" },
      "40s": { title: "교과서 정독 모범생", line: "배운 걸 너무 정확히 기억하는 게 문제일 줄이야" },
      "50s": { title: "원조 표준어 지킴이", line: "'자장면'만 표준어이던 시절을 기억하는 정통파" },
      "60plus": { title: "표준어 변천사 산증인", line: "규범이 바뀌는 걸 여러 번 지켜본 살아 있는 역사" },
    },
  },
  strict: {
    name: "엄격한 맞춤법 꼰대",
    emoji: "🧐",
    headline: "글자는 완벽, 속뜻은 로딩 중",
    description:
      "받침 하나, 띄어쓰기 하나 허투루 넘기지 않아요. 그런데 공지문의 진짜 의도는 가끔 놓쳐요. 맞춤법은 다 맞았는데 왜 나만 못 알아들었지? 맥락만 챙기면 무적입니다.",
    traits: ["오타 지적은 빠른데 농담은 늦게 알아듣는다", "'일절'과 '일체'는 자다가도 구분한다", "문자 하나 보내기 전 세 번 검토한다"],
    ages: {
      "10s": { title: "조별과제 맞춤법 반장", line: "발표 자료 오타 검사는 무조건 당신 담당" },
      "20s": { title: "카톡 맞춤법 감별사", line: "상대의 맞춤법으로 호감도가 오르내리는 편" },
      "30s": { title: "보고서 빨간펜 선배", line: "후배 보고서에 빨간 줄 긋는 손이 제일 빨라요" },
      "40s": { title: "단톡방 공지 재작성러", line: "남이 쓴 공지를 조용히 고쳐 다시 올려 본 적 있죠?" },
      "50s": { title: "현수막 오타 신고왕", line: "길거리 현수막 오타에 발걸음이 멈춰요" },
      "60plus": { title: "원고지 시대의 정확함", line: "원고지 칸 맞추던 그 꼼꼼함 그대로" },
    },
  },
  practical: {
    name: "문맥으로 살아남는 실전파",
    emoji: "🧭",
    headline: "철자는 몰라도 눈치는 만렙",
    description:
      "맞춤법은 가끔 흔들리지만 무슨 말인지는 누구보다 빨리 알아채요. 공지문, 계약서, 단톡방 분위기까지 행간을 읽는 생존형 독해러. 실전에선 당신이 제일 강해요.",
    traits: ["공지에서 중요한 한 줄을 귀신같이 찾는다", "말귀는 빠른데 받아쓰기는 자신 없다", "'잠깐 통화 가능?'의 온도를 바로 읽는다"],
    ages: {
      "10s": { title: "반 단톡방 통역사", line: "선생님 공지 요약은 늘 당신 몫이에요" },
      "20s": { title: "알바 공지 해독가", line: "사장님의 애매한 공지도 정확히 알아들어요" },
      "30s": { title: "메일 행간 독해 전문가", line: "'검토 부탁드립니다'의 진짜 온도를 아는 사람" },
      "40s": { title: "안내문 핵심 요약러", line: "세 장짜리 안내문에서 준비물 한 줄을 바로 찾아요" },
      "50s": { title: "계약서 함정 탐지기", line: "작은 글씨 속 숨은 조건을 놓치지 않아요" },
      "60plus": { title: "인생 경험 독해왕", line: "글자보다 사람 마음을 먼저 읽는 내공" },
    },
  },
  intuitive: {
    name: "감으로 쓰는 언어 천재",
    emoji: "✨",
    headline: "단어는 척척, 띄어쓰기는 바이브",
    description:
      "어려운 단어 뜻은 다 알면서 띄어쓰기는 그날 기분 따라 달라져요. 말은 청산유수인데 받아쓰기 점수는 미스터리한 감성파. '두 번'으로 바꿔 보는 요령 하나면 완성형이에요.",
    traits: ["'한번'과 '한 번'은 그때그때 다르다", "어휘력 칭찬은 자주 듣는다", "띄어쓰기는 맞춤법 검사기에게 맡긴다"],
    ages: {
      "10s": { title: "단어 퀴즈 우승자", line: "단어 퀴즈는 1등, 받아쓰기 점수는 비밀" },
      "20s": { title: "감성 캡션 장인", line: "인스타 캡션 감성 100, 띄어쓰기 50" },
      "30s": { title: "말발 좋은 기획자", line: "회의에선 명언 제조기, 문서에선 띄어쓰기 실종" },
      "40s": { title: "통화로는 무적", line: "말로 하면 누구도 당신을 못 이겨요" },
      "50s": { title: "모임의 이야기꾼", line: "분위기 메이커, 단 문자는 짧고 굵게" },
      "60plus": { title: "구수한 말솜씨 장인", line: "말맛은 최고, 띄어쓰기는 여유롭게" },
    },
  },
  grower: {
    name: "차곡차곡 성장형",
    emoji: "🌱",
    headline: "오늘 해설 보고 내일 고수 되는 타입",
    description:
      "고르게 맞히고 고르게 헷갈렸어요. 대신 해설을 읽으면 '아!' 하고 바로 흡수하는 스펀지형. 다시 풀면 결과가 달라질 확률 1위입니다.",
    traits: ["오늘만 '아 이거였어?'를 다섯 번 말했다", "틀린 문제 해설은 끝까지 읽는다", "벌써 '다시 풀기' 버튼에 손이 간다"],
    ages: {
      "10s": { title: "성장 잠재력 S급", line: "지금 배우면 평생 가요. 흡수력은 지금이 최고" },
      "20s": { title: "갓생 국어 루키", line: "오늘부터 국어도 갓생 루틴에 추가" },
      "30s": { title: "출근길 자기계발러", line: "출근길 5분이면 충분해요" },
      "40s": { title: "다시 배우는 즐거움파", line: "아이와 같이 풀면 둘 다 레벨업" },
      "50s": { title: "배움에 늦음 없음파", line: "궁금한 건 바로 찾아보는 열정파" },
      "60plus": { title: "평생 학습 모범생", line: "새로 바뀐 규범도 척척 받아들이는 유연함" },
    },
  },
};

export function isResultTypeKey(v: string): v is ResultTypeKey {
  return (RESULT_TYPE_KEYS as readonly string[]).includes(v);
}

export function isFlavorAgeKey(v: string): v is FlavorAgeKey {
  return (FLAVOR_AGE_KEYS as readonly string[]).includes(v);
}

// 결과 URL 코드: /r/{유형} 또는 /r/{유형}-{연령대}  예) /r/classic-30s
export function resultCode(type: ResultTypeKey, age: AgeGroupKey): string {
  return isFlavorAgeKey(age) ? `${type}-${age}` : type;
}

export function parseResultCode(code: string): { type: ResultTypeKey; age: FlavorAgeKey | null } | null {
  const [type, age, ...rest] = code.split("-");
  if (rest.length || !isResultTypeKey(type)) return null;
  if (age === undefined) return { type, age: null };
  return isFlavorAgeKey(age) ? { type, age } : null;
}

export function allResultCodes(): string[] {
  return RESULT_TYPE_KEYS.flatMap((t) => [t, ...FLAVOR_AGE_KEYS.map((a) => `${t}-${a}`)]);
}
