import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { RESULT_TYPE_KEYS, RESULT_TYPES } from "@/lib/resultTypes";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// 검색엔진용 구조화 데이터: 사이트 + 퀴즈
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "ko-KR", description: SITE_DESCRIPTION },
    {
      "@type": "Quiz",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "ko-KR",
      description: SITE_DESCRIPTION,
      educationalLevel: "일반",
      about: ["한국어 맞춤법", "어휘력", "띄어쓰기", "문해력"].map((name) => ({ "@type": "Thing", name })),
      isAccessibleForFree: true,
    },
  ],
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pt-14 pb-8">
      <script
        type="application/ld+json"
        // JSON-LD 는 문자열로 넣어야 한다. '<' 는 이스케이프해 스크립트 탈출을 막는다.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <h1>
        <span className="block text-sm font-medium text-accent">{SITE_NAME}</span>
        <span className="mt-3 block text-[2rem] leading-tight font-black tracking-tight">
          &lsquo;사흘&rsquo;은
          <br />
          며칠일까요?
        </span>
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
        20개 질문에 답하면 나의 한국어 습관을 6가지 유형 중 하나로 알려 드려요. 나는 사전파일까, 감각파일까?
      </p>

      <Link
        href="/start"
        className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink active:scale-[0.99]"
      >
        테스트 시작하기
      </Link>

      <section className="mt-10" aria-labelledby="types">
        <h2 id="types" className="text-lg font-bold">
          어떤 유형이 있을까요?
        </h2>
        <ul className="mt-3 space-y-2">
          {RESULT_TYPE_KEYS.map((k) => {
            const t = RESULT_TYPES[k];
            return (
              <li key={k}>
                <Link
                  href={`/r/${k}`}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:bg-accent-soft"
                >
                  <span className="text-2xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">{t.name}</span>
                    <span className="block text-sm text-muted">{t.headline}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="about">
        <h2 id="about" className="text-lg font-bold">
          무엇을 알아보나요?
        </h2>
        <p className="mt-2 leading-relaxed text-muted">
          뉴스와 공지에서 실제로 화제가 됐던 말들로 <strong className="font-bold text-ink">맞춤법</strong>,{" "}
          <strong className="font-bold text-ink">어휘력</strong>, <strong className="font-bold text-ink">띄어쓰기</strong>,{" "}
          <strong className="font-bold text-ink">문해력</strong> 습관을 살펴봐요. &lsquo;심심한 사과&rsquo;,
          &lsquo;우천 시&rsquo;, &lsquo;짜장면&rsquo;처럼 한 번쯤 헷갈렸던 표현이 나와요. 로그인 없이 무료로 할 수 있어요.
        </p>
      </section>

      <div className="mt-auto pt-6">
        <AdSlot placement="home" />
      </div>
    </main>
  );
}
