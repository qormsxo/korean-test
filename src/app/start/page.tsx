import type { Metadata } from "next";
import { AgePicker } from "./AgePicker";
import { CURRENT_SET } from "@/lib/sets";

export const metadata: Metadata = { title: "연령대 선택 — 한국어 능력 테스트" };

export default function StartPage() {
  return (
    <main className="flex flex-1 flex-col pt-14 pb-8">
      <h1 className="text-2xl font-black">연령대를 알려 주세요</h1>
      <p className="mt-3 leading-relaxed text-muted">
        결과 유형은 점수로만 정해지고, 연령대는 영향을 주지 않아요. 나중에 &lsquo;또래 정답률&rsquo;을 보여 드리는 데만
        쓰입니다.
      </p>
      <AgePicker setId={CURRENT_SET.id} />
    </main>
  );
}
