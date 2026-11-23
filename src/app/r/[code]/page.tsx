import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { getCurrentSetQuestions } from "@/lib/quiz";
import { isResultTypeKey, RESULT_TYPE_KEYS, RESULT_TYPES } from "@/lib/resultTypes";
import { MyReview } from "./MyReview";
import { RetakeLink } from "./RetakeLink";
import { ShareButtons } from "./ShareButtons";

// 결과는 유형만 보여 준다(점수는 화면·공유 카드에 내지 않음). URL: /r/{유형}
type Props = { params: Promise<{ code: string }> };

// 유형 6개를 모두 빌드 때 미리 만든다. params를 Suspense 없이 읽어야
// <title>·og 태그가 <head>에 들어가 카카오톡 등 공유 미리보기가 정상으로 나온다.
export function generateStaticParams() {
  return RESULT_TYPE_KEYS.map((code) => ({ code }));
}

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  if (!isResultTypeKey(code)) return { title: "내 한국어 실력 유형 테스트" };
  const t = RESULT_TYPES[code];
  const title = `나의 한국어 유형은 '${t.name}' | 내 한국어 실력 유형 테스트`;
  return { title, description: t.headline, openGraph: { title, description: t.headline } };
}

export default async function ResultPage({ params }: Props) {
  const { code } = await params;
  if (!isResultTypeKey(code)) notFound();
  const t = RESULT_TYPES[code];

  return (
    <main className="flex flex-1 flex-col pt-10 pb-10">
      <p className="text-sm font-medium text-accent">나의 한국어 유형</p>
      <div className="mt-4 rounded-3xl border border-line bg-surface px-6 py-8 text-center">
        <p className="text-5xl" aria-hidden>
          {t.emoji}
        </p>
        <h1 className="mt-3 text-[1.7rem] leading-tight font-black">{t.name}</h1>
        <p className="mt-2 font-medium text-muted">{t.headline}</p>
      </div>

      <p className="mt-5 leading-relaxed">{t.description}</p>

      <ShareButtons code={code} title={`나의 한국어 유형은 '${t.name}'`} />

      <AdSlot placement="result" />

      <MyReview code={code} questions={getCurrentSetQuestions()} />

      <RetakeLink code={code} />
    </main>
  );
}
