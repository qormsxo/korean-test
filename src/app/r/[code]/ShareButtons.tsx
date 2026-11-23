"use client";
import { useState } from "react";
import { loadRun, sendEvent } from "@/lib/clientState";

export function ShareButtons({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => `${window.location.origin}/r/${code}`;
  const track = (channel: string) => {
    const run = loadRun();
    if (run?.shareCode === code) sendEvent({ type: "share", sessionId: run.sessionId, setId: run.setId, channel });
  };

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title}\n너도 해 봐!`, url: url() });
        track("native");
      } catch {
        /* 사용자가 취소 */
      }
    } else copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track("copy");
    } catch {
      // 클립보드 권한이 없는 인앱 브라우저 등: 직접 복사하도록 띄우고, 공유 시도로 기록한다.
      window.prompt("링크를 복사하세요", url());
      track("copy");
    }
  }

  function shareX() {
    const u = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`;
    window.open(u, "_blank", "noopener,noreferrer");
    track("x");
  }

  async function saveImage() {
    try {
      const res = await fetch(`/r/${code}/opengraph-image`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `korean-test-${code}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      track("image");
    } catch {
      /* noop */
    }
  }

  const btn = "flex h-12 items-center justify-center rounded-xl border border-line bg-surface text-sm font-bold";
  return (
    <section className="mt-8" aria-labelledby="share">
      <h2 id="share" className="mb-3 text-lg font-bold">
        결과 공유하기
      </h2>
      <button
        type="button"
        onClick={nativeShare}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink"
      >
        친구에게 공유하기
      </button>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button type="button" onClick={copy} className={btn}>
          {copied ? "복사됨!" : "링크 복사"}
        </button>
        <button type="button" onClick={shareX} className={btn}>
          X에 올리기
        </button>
        <button type="button" onClick={saveImage} className={btn}>
          카드 저장
        </button>
      </div>
    </section>
  );
}
