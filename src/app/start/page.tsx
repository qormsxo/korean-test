import type { Metadata } from "next";
import { AgePicker } from "./AgePicker";
import { CURRENT_SET } from "@/lib/sets";

export const metadata: Metadata = { title: "연령대 선택 — 내 한국어 실력 유형 테스트" };

export default function StartPage() {
  return (
    <main className="flex flex-1 flex-col pt-14 pb-8">
      <h1 className="text-2xl font-black">연령대를 알려 주세요</h1>
      <p className="mt-3 leading-relaxed text-muted">
        유형은 고른 답으로만 정해지고, 연령대에 따라 &lsquo;또래 버전&rsquo; 별명이 붙어요.
      </p>
      <AgePicker setId={CURRENT_SET.id} />
    </main>
  );
}
