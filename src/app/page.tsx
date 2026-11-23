import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pt-14 pb-8">
      <p className="text-sm font-medium text-accent">한국어 능력 테스트</p>
      <h1 className="mt-3 text-[2rem] leading-tight font-black tracking-tight">
        &lsquo;사흘&rsquo;은
        <br />
        며칠일까요?
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
        뉴스와 안내문에서 실제로 헷갈렸던 말들로 만든 20문항. 문항마다 정답과 해설을 바로 보여 드려요.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-2 text-sm">
        {[
          ["어휘력", "8문항"],
          ["표기", "7문항"],
          ["문해력", "3문항"],
          ["띄어쓰기", "2문항"],
        ].map(([d, n]) => (
          <li key={d} className="rounded-xl border border-line bg-surface px-4 py-3">
            <span className="font-bold">{d}</span> <span className="text-muted">{n}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/start"
        className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink active:scale-[0.99]"
      >
        테스트 시작하기
      </Link>
      <p className="mt-3 text-center text-xs text-muted">약 5분 · 로그인 없음</p>

      <div className="mt-auto">
        <AdSlot placement="home" />
      </div>
    </main>
  );
}
