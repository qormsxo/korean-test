// 사이트 공통 정보(검색엔진·공유 미리보기용).
export const SITE_NAME = "내 한국어 실력 유형 테스트";
export const SITE_SHORT_NAME = "한국어 유형 테스트";

export const SITE_TITLE = `${SITE_NAME} | 맞춤법·어휘력·문해력 유형 검사`;
export const SITE_DESCRIPTION =
  "'사흘'은 며칠일까? '심심한 사과'는 무슨 뜻일까? 20개 질문으로 알아보는 나의 한국어 습관 유형. 맞춤법·어휘력·띄어쓰기·문해력을 무료로 테스트하고 6가지 유형 중 내 유형을 확인해 보세요.";

export const SITE_KEYWORDS = [
  "한국어 테스트",
  "한국어 실력 테스트",
  "맞춤법 테스트",
  "문해력 테스트",
  "어휘력 테스트",
  "띄어쓰기 테스트",
  "국어 유형 테스트",
  "심리 유형 테스트",
  "사흘 뜻",
  "심심한 사과 뜻",
];

/**
 * 절대 URL 기준. 배포 시 NEXT_PUBLIC_SITE_URL(실제 도메인)을 넣는 것을 권장하고,
 * 없으면 Vercel 프로덕션 도메인 → 로컬 순으로 쓴다.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
