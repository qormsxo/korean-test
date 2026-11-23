"use client";
// 광고 자리. NEXT_PUBLIC_ADSENSE_CLIENT 와 슬롯 ID 가 없으면 자리 표시만 보인다.
// 높이를 미리 잡아 두어 광고가 늦게 떠도 화면이 밀리지 않게 한다.
import { useEffect, useRef } from "react";

const SLOT_IDS: Record<AdPlacement, string | undefined> = {
  home: process.env.NEXT_PUBLIC_AD_SLOT_HOME,
  quiz: process.env.NEXT_PUBLIC_AD_SLOT_QUIZ,
  result: process.env.NEXT_PUBLIC_AD_SLOT_RESULT,
};
const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export type AdPlacement = "home" | "quiz" | "result";

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const slot = SLOT_IDS[placement];
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
    } catch {
      /* 광고 차단 등 */
    }
  }, [slot]);

  return (
    <aside aria-label="광고" className="my-6 min-h-[100px] w-full">
      {client && slot ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight: 100 }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-[100px] items-center justify-center rounded-xl border border-dashed border-line text-xs text-muted">
          광고 영역 · {placement}
        </div>
      )}
    </aside>
  );
}
