"use client";
// 직접 푼 사람에게는 '다시 풀기', 공유 링크로 들어온 사람에게는 '나도 테스트하기'.
// 어느 쪽이든 /start 에서 새 세션으로 시작한다(재응시 제한 없음).
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadRun } from "@/lib/clientState";

export function RetakeLink({ code }: { code: string }) {
  const [mine, setMine] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage는 마운트 후에만 읽을 수 있다
    setMine(loadRun()?.shareCode === code);
  }, [code]);

  return (
    <Link
      href="/start"
      className="mt-8 flex h-14 items-center justify-center rounded-2xl border-2 border-accent text-lg font-bold text-accent"
    >
      {mine ? "다시 풀기" : "나도 테스트하기"}
    </Link>
  );
}
