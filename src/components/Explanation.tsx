// 정답 공개 후 해설. 기본으로는 정답 이유(why_correct)와 주의 문구만 짧게 보여 주고,
// 헷갈리는 이유(why_wrong)·요령·규정 원문은 '자세히'를 눌러야 펼쳐진다.
import { MODERATE_CERTAINTY_BADGE } from "@/lib/notes";
import type { QuizQuestion } from "@/lib/quiz";

export function Explanation({ q }: { q: QuizQuestion }) {
  const cautions = q.notes.filter((n) => n.kind === "caution");
  const extras = q.notes.filter((n) => n.kind !== "caution");

  return (
    <div className="space-y-3 text-[0.98rem] leading-relaxed">
      <p>{q.whyCorrect}</p>

      {q.moderateCertainty && (
        <p className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-3 py-1 text-xs font-bold text-warn">
          <span aria-hidden>⚠</span> {MODERATE_CERTAINTY_BADGE}
        </p>
      )}
      {cautions.map((n, i) => (
        <p key={i} className="rounded-xl bg-warn-soft px-4 py-3 text-[0.94rem]">
          {n.text}
        </p>
      ))}

      <details className="group">
        <summary className="cursor-pointer list-none text-sm font-bold text-muted">
          <span className="group-open:hidden">자세히 ▾</span>
          <span className="hidden group-open:inline">접기 ▴</span>
        </summary>
        <div className="mt-2 space-y-3 text-[0.94rem]">
          <p>{q.whyWrong}</p>
          {extras.map((n, i) =>
            n.kind === "rule" ? (
              <blockquote key={i} className="rounded-xl border-l-4 border-accent bg-accent-soft px-4 py-3">
                <p>{n.text}</p>
                <p className="mt-1 text-xs text-muted">— {n.source}</p>
              </blockquote>
            ) : (
              <p key={i} className="rounded-xl bg-accent-soft px-4 py-3">
                {n.text}
              </p>
            ),
          )}
        </div>
      </details>
    </div>
  );
}
