import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pt-14 pb-8">
      <p className="text-sm font-medium text-accent">내 한국어 실력 유형 테스트</p>
      <h1 className="mt-3 text-[2rem] leading-tight font-black tracking-tight">
        &lsquo;사흘&rsquo;은
        <br />
        며칠일까요?
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
        20개 질문에 답하면 나의 한국어 습관을 6가지 유형 중 하나로 알려 드려요. 나는 사전파일까, 감각파일까?
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

      <div className="mt-auto">
        <AdSlot placement="home" />
      </div>
    </main>
  );
}
