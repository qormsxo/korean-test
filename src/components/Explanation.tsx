// 정답 공개 후 해설. why_correct → why_wrong → 주의/팁/규정 → 근거 순서.
import { MODERATE_CERTAINTY_BADGE } from "@/lib/notes";
import type { QuizQuestion } from "@/lib/quiz";

export function Explanation({ q }: { q: QuizQuestion }) {
  return (
    <div className="space-y-4 text-[0.98rem] leading-relaxed">
      {q.moderateCertainty && (
        <p className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-3 py-1 text-xs font-bold text-warn">
          <span aria-hidden>⚠</span> {MODERATE_CERTAINTY_BADGE}
        </p>
      )}
      <section>
        <h3 className="mb-1 text-sm font-bold text-ok">왜 정답일까?</h3>
        <p>{q.whyCorrect}</p>
      </section>
      <section>
        <h3 className="mb-1 text-sm font-bold text-bad">왜 헷갈릴까?</h3>
        <p>{q.whyWrong}</p>
      </section>
      {q.notes.map((n, i) =>
        n.kind === "rule" ? (
          <blockquote key={i} className="rounded-xl border-l-4 border-accent bg-accent-soft px-4 py-3">
            <p className="mb-1 text-xs font-bold text-accent">{n.title}</p>
            <p>{n.text}</p>
            <p className="mt-1 text-xs text-muted">— {n.source}</p>
          </blockquote>
        ) : (
          <div key={i} className={`rounded-xl px-4 py-3 ${n.kind === "caution" ? "bg-warn-soft" : "bg-accent-soft"}`}>
            <p className={`mb-1 text-xs font-bold ${n.kind === "caution" ? "text-warn" : "text-accent"}`}>
              {n.kind === "caution" ? "알아두세요" : "기억하는 요령"}
            </p>
            <p>{n.text}</p>
          </div>
        ),
      )}
      {q.basis && <p className="text-xs text-muted">근거: {q.basis}</p>}
    </div>
  );
}
