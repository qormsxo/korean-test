import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AGE_GROUPS } from "@/lib/ageGroups";
import { getCurrentSetQuestions } from "@/lib/quiz";
import { allResultCodes, parseResultCode, RESULT_TYPES } from "@/lib/resultTypes";
import { MyReview } from "./MyReview";
import { RetakeLink } from "./RetakeLink";
import { ShareButtons } from "./ShareButtons";

// 결과는 유형만 보여 준다(점수는 화면·공유 카드에 내지 않음).
// URL: /r/{유형} 또는 /r/{유형}-{연령대}(또래 버전 별명)
type Props = { params: Promise<{ code: string }> };

// 유형 × 연령대 조합(42개)을 모두 빌드 때 만든다. params를 Suspense 없이 읽어야
// <title>·og 태그가 <head>에 들어가 카카오톡 등 공유 미리보기가 정상으로 나온다.
export function generateStaticParams() {
  return allResultCodes().map((code) => ({ code }));
}

export const instant = false;

const ageLabel = (key: string) => AGE_GROUPS.find((a) => a.key === key)?.label ?? "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const r = parseResultCode(code);
  if (!r) return {};
  const t = RESULT_TYPES[r.type];
  const flavor = r.age ? ` (${ageLabel(r.age)} ${t.ages[r.age].title})` : "";
  const title = `${t.name}${flavor} — 한국어 유형 결과`;
  const description = `${t.headline}. ${t.description}`;
  return {
    title,
    description,
    // 연령대 버전(/r/classic-30s)은 기본 유형 페이지(/r/classic)를 대표 주소로 삼아 중복 색인을 막는다.
    alternates: { canonical: `/r/${r.type}` },
    openGraph: { title: `나의 한국어 유형은 '${t.name}'${flavor}`, description: t.headline, url: `/r/${code}` },
    twitter: { card: "summary_large_image", title: `나의 한국어 유형은 '${t.name}'${flavor}`, description: t.headline },
  };
}

export default async function ResultPage({ params }: Props) {
  const { code } = await params;
  const r = parseResultCode(code);
  if (!r) notFound();
  const t = RESULT_TYPES[r.type];
  const flavor = r.age ? t.ages[r.age] : null;

  return (
    <main className="flex flex-1 flex-col pt-10 pb-10">
      <p className="text-sm font-medium text-accent">나의 한국어 유형</p>
      <div className="mt-4 rounded-3xl border border-line bg-surface px-6 py-8 text-center">
        <p className="text-5xl" aria-hidden>
          {t.emoji}
        </p>
        <h1 className="mt-3 text-[1.7rem] leading-tight font-black">{t.name}</h1>
        <p className="mt-2 font-medium text-muted">{t.headline}</p>
        {flavor && r.age && (
          <div className="mt-5 rounded-2xl bg-accent-soft px-4 py-3">
            <p className="text-xs font-bold text-accent">{ageLabel(r.age)} 버전</p>
            <p className="mt-0.5 text-lg font-black">{flavor.title}</p>
            <p className="mt-0.5 text-sm text-muted">{flavor.line}</p>
          </div>
        )}
      </div>

      <p className="mt-5 leading-relaxed">{t.description}</p>

      <section className="mt-6" aria-labelledby="traits">
        <h2 id="traits" className="mb-2 text-lg font-bold">
          이런 적 있다면 찐이에요
        </h2>
        <ul className="space-y-2">
          {t.traits.map((trait) => (
            <li key={trait} className="flex gap-2 rounded-xl border border-line bg-surface px-4 py-3">
              <span aria-hidden className="text-accent">
                ✓
              </span>
              <span>{trait}</span>
            </li>
          ))}
        </ul>
      </section>

      <ShareButtons
        code={code}
        title={`나의 한국어 유형은 '${t.name}'${flavor ? ` — ${flavor.title}` : ""}`}
      />

      <AdSlot placement="result" />

      <MyReview code={code} questions={getCurrentSetQuestions()} />

      <RetakeLink code={code} />
    </main>
  );
}
