"use client";
import { useRouter } from "next/navigation";
import { AGE_GROUPS, type AgeGroupKey } from "@/lib/ageGroups";
import { getAnonId, newSessionId, nowMs, saveRun, sendEvent } from "@/lib/clientState";

export function AgePicker({ setId }: { setId: string }) {
  const router = useRouter();

  function pick(ageGroup: AgeGroupKey) {
    const sessionId = newSessionId();
    saveRun({ sessionId, setId, ageGroup, index: 0, answers: {}, revealed: false, questionShownAt: nowMs() });
    sendEvent({ type: "start", sessionId, setId, ageGroup, anonId: getAnonId() });
    router.push("/quiz");
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-2">
      {AGE_GROUPS.map((a) => (
        <button
          key={a.key}
          type="button"
          onClick={() => pick(a.key)}
          className={`h-14 rounded-2xl border border-line bg-surface text-[1.05rem] font-bold active:bg-accent-soft ${
            a.key === "undisclosed" ? "col-span-2 font-medium text-muted" : ""
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
