"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdSlot } from "@/components/AdSlot";
import { Explanation } from "@/components/Explanation";
import type { OptionKey } from "@/lib/bank";
import { loadRun, nowMs, saveRun, sendEvent, type RunState } from "@/lib/clientState";
import type { QuizQuestion } from "@/lib/quiz";
import { decideResultType, scoreAnswers } from "@/lib/scoring";
import { encodeShareCode } from "@/lib/shareCode";

const MID_AD_AFTER = 10; // 10번 문항 해설 아래에 광고

type Props = { questions: QuizQuestion[]; setId: string; normChangedIds: string[] };

export function Quiz({ questions, setId, normChangedIds }: Props) {
  const router = useRouter();
  const [run, setRun] = useState<RunState | null>(null);

  useEffect(() => {
    const r = loadRun();
    if (!r || r.setId !== setId) return router.replace("/start");
    if (r.shareCode) return router.replace(`/r/${r.shareCode}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage는 마운트 후에만 읽을 수 있다
    setRun(r);
  }, [router, setId]);

  if (!run) return <main className="flex-1" aria-busy="true" />;

  const q = questions[run.index];
  const chosen = run.answers[q.id];
  const isLast = run.index === questions.length - 1;

  function update(next: RunState) {
    saveRun(next);
    setRun(next);
  }

  function choose(key: OptionKey) {
    if (!run || run.revealed) return;
    update({ ...run, answers: { ...run.answers, [q.id]: key }, revealed: true });
    sendEvent({
      type: "answer",
      sessionId: run.sessionId,
      setId,
      questionId: q.id,
      position: run.index,
      chosen: key,
      elapsedMs: nowMs() - run.questionShownAt,
    });
  }

  function next() {
    if (!run) return;
    if (isLast) {
      const summary = scoreAnswers(questions, run.answers);
      const code = encodeShareCode(decideResultType(summary, normChangedIds), summary);
      update({ ...run, shareCode: code });
      sendEvent({ type: "finish", sessionId: run.sessionId, setId, answers: run.answers });
      router.push(`/r/${code}`);
      return;
    }
    update({ ...run, index: run.index + 1, revealed: false, questionShownAt: nowMs() });
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="flex flex-1 flex-col pt-5 pb-10">
      <header className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">
            {run.index + 1}
            <span className="text-muted"> / {questions.length}</span>
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent">{q.domain}</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={run.index + (run.revealed ? 1 : 0)}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${((run.index + (run.revealed ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {q.context && (
        <p className="rounded-2xl border border-line bg-surface px-4 py-3.5 text-[1.02rem] leading-relaxed">{q.context}</p>
      )}
      <h1 className="mt-5 text-xl leading-snug font-bold">{q.question}</h1>

      <ol className="mt-5 space-y-2.5" aria-label="선택지">
        {q.options.map((o) => {
          const isAnswer = o.key === q.answer;
          const isChosen = o.key === chosen;
          let tone = "border-line bg-surface active:bg-accent-soft";
          if (run.revealed) {
            if (isAnswer) tone = "border-ok bg-ok-soft";
            else if (isChosen) tone = "border-bad bg-bad-soft";
            else tone = "border-line bg-surface opacity-60";
          }
          return (
            <li key={o.key}>
              <button
                type="button"
                disabled={run.revealed}
                onClick={() => choose(o.key)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[1.02rem] transition-colors ${tone}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-sm font-bold">
                  {o.key}
                </span>
                <span className="flex-1">{o.text}</span>
                {run.revealed && isAnswer && <span className="text-sm font-bold text-ok">정답</span>}
                {run.revealed && isChosen && !isAnswer && <span className="text-sm font-bold text-bad">내 선택</span>}
              </button>
            </li>
          );
        })}
      </ol>

      {run.revealed && (
        <section className="mt-6" aria-live="polite">
          <p className={`mb-4 text-lg font-black ${chosen === q.answer ? "text-ok" : "text-bad"}`}>
            {chosen === q.answer ? "정답이에요!" : `아쉬워요. 정답은 ${q.answer}예요.`}
          </p>
          <Explanation q={q} />
          <button
            type="button"
            onClick={next}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink active:scale-[0.99]"
          >
            {isLast ? "결과 보기" : "다음 문제"}
          </button>
          {run.index + 1 === MID_AD_AFTER && <AdSlot placement="quiz" />}
        </section>
      )}
    </main>
  );
}
