"use client";
// 직접 푼 사람에게만 문항별 다시 보기를 보여 준다(공유 링크로 들어온 사람에게는 안 보임).
import { useEffect, useState } from "react";
import { Explanation } from "@/components/Explanation";
import { loadRun, type RunState } from "@/lib/clientState";
import type { QuizQuestion } from "@/lib/quiz";

export function MyReview({ code, questions }: { code: string; questions: QuizQuestion[] }) {
  const [run, setRun] = useState<RunState | null>(null);
  const [onlyWrong, setOnlyWrong] = useState(true);

  useEffect(() => {
    const r = loadRun();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage는 마운트 후에만 읽을 수 있다
    if (r?.shareCode === code) setRun(r);
  }, [code]);

  if (!run) return null;
  const list = questions.filter((q) => !onlyWrong || run.answers[q.id] !== q.answer);

  return (
    <section className="mt-4" aria-labelledby="review">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="review" className="text-lg font-bold">
          문항 다시 보기
        </h2>
        <button type="button" onClick={() => setOnlyWrong((v) => !v)} className="text-sm font-bold text-accent">
          {onlyWrong ? "전체 보기" : "틀린 문항만"}
        </button>
      </div>
      {list.length === 0 && <p className="text-muted">틀린 문항이 없어요. 완벽해요!</p>}
      <ul className="space-y-2">
        {list.map((q) => {
          const mine = run.answers[q.id];
          const ok = mine === q.answer;
          return (
            <li key={q.id}>
              <details className="rounded-2xl border border-line bg-surface px-4 py-3">
                <summary className="cursor-pointer list-none">
                  <span className={`mr-2 text-sm font-bold ${ok ? "text-ok" : "text-bad"}`}>{ok ? "O" : "X"}</span>
                  <span className="font-bold">{q.target}</span>
                  <span className="ml-2 text-sm text-muted">{q.domain}</span>
                </summary>
                <div className="mt-3 border-t border-line pt-3">
                  {q.context && <p className="mb-2 text-sm text-muted">{q.context}</p>}
                  <p className="mb-3 font-medium">{q.question}</p>
                  <p className="mb-3 text-sm">
                    정답 <b>{q.answer}. {q.options.find((o) => o.key === q.answer)?.text}</b>
                    {!ok && mine && (
                      <>
                        <br />내 선택 {mine}. {q.options.find((o) => o.key === mine)?.text}
                      </>
                    )}
                  </p>
                  <Explanation q={q} />
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
