import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { DOMAINS } from "@/lib/bank";
import { getCurrentSetQuestions } from "@/lib/quiz";
import { RESULT_TYPES } from "@/lib/resultTypes";
import { domainTotals } from "@/lib/setMeta";
import { decodeShareCode } from "@/lib/shareCode";
import { MyReview } from "./MyReview";
import { RetakeLink } from "./RetakeLink";
import { ShareButtons } from "./ShareButtons";

type Props = { params: Promise<{ code: string }> };

// 샘플 하나를 빌드 때 미리 렌더링해 두면 params를 렌더 중에 바로 읽을 수 있다.
// (Suspense로 감싸면 <title>·og 태그가 <body>로 스트리밍되어 카카오톡 등 공유 미리보기가 깨진다.)
// 나머지 코드는 첫 요청 때 렌더링되어 저장된다.
export function generateStaticParams() {
  return [{ code: "guardian-8732" }];
}

// 위 이유로 Suspense 없이 params를 읽는 '막는(blocking)' 라우트임을 명시한다.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const r = decodeShareCode(code, domainTotals());
  if (!r) return { title: "한국어 능력 테스트" };
  const t = RESULT_TYPES[r.type];
  const title = `나는 '${t.name}' — ${r.total}/${r.max}점 | 한국어 능력 테스트`;
  return { title, description: t.headline, openGraph: { title, description: t.headline } };
}

export default async function ResultPage({ params }: Props) {
  const { code } = await params;
  const r = decodeShareCode(code, domainTotals());
  if (!r) notFound();
  const t = RESULT_TYPES[r.type];

  return (
    <main className="flex flex-1 flex-col pt-10 pb-10">
      <p className="text-sm font-medium text-accent">나의 한국어 유형</p>
      <div className="mt-4 rounded-3xl border border-line bg-surface p-6 text-center">
        <p className="text-5xl" aria-hidden>
          {t.emoji}
        </p>
        <h1 className="mt-3 text-[1.7rem] leading-tight font-black">{t.name}</h1>
        <p className="mt-2 font-medium text-muted">{t.headline}</p>
        <p className="mt-5 text-4xl font-black text-accent">
          {r.total}
          <span className="text-xl text-muted"> / {r.max}</span>
        </p>
      </div>

      <p className="mt-5 leading-relaxed">{t.description}</p>

      <section className="mt-8" aria-labelledby="domains">
        <h2 id="domains" className="mb-3 text-lg font-bold">
          영역별 점수
        </h2>
        <ul className="space-y-3">
          {DOMAINS.map((d) => {
            const s = r.domains[d];
            return (
              <li key={d}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-bold">{d}</span>
                  <span className="text-muted">
                    {s.correct} / {s.total}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(s.correct / s.total) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <ShareButtons code={code} title={`나는 '${t.name}' — ${r.total}/${r.max}점`} />

      <AdSlot placement="result" />

      <MyReview code={code} questions={getCurrentSetQuestions()} />

      <RetakeLink code={code} />
    </main>
  );
}
