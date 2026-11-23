// 공유 카드 1200×630. 연령대는 넣지 않는다.
import { ImageResponse } from "next/og";
import { DOMAINS } from "@/lib/bank";
import { RESULT_TYPES } from "@/lib/resultTypes";
import { domainTotals } from "@/lib/setMeta";
import { decodeShareCode } from "@/lib/shareCode";

export const alt = "한국어 능력 테스트 결과 카드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 카드에 쓰인 글자만 담은 Noto Sans KR 서브셋을 Google Fonts에서 받는다(TTF). */
async function loadFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const r = decodeShareCode(code, domainTotals());
  const t = r ? RESULT_TYPES[r.type] : null;

  const lines = t && r
    ? [t.name, t.headline, `${r.total} / ${r.max}`, ...DOMAINS.map((d) => `${d} ${r.domains[d].correct}/${r.domains[d].total}`)]
    : ["한국어 능력 테스트"];
  const text = `${lines.join("")}한국어 능력 테스트나도 해 보기0123456789/`;
  const [bold, regular] = await Promise.all([loadFont(text, 900), loadFont(text, 500)]);
  const fonts = [
    ...(bold ? [{ name: "Noto", data: bold, weight: 900 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Noto", data: regular, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f5f0",
          color: "#1d1b18",
          padding: "64px 72px",
          fontFamily: "Noto",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: "#1f5f4e" }}>한국어 능력 테스트</div>
        {t && r ? (
          <div style={{ display: "flex", flex: 1, marginTop: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", paddingRight: 48 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: t.name.length > 9 ? 58 : 76,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  wordBreak: "keep-all",
                }}
              >
                {t.name}
              </div>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 500, color: "#6b665d", marginTop: 18 }}>
                {t.headline}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 36 }}>
                <span style={{ fontSize: 110, fontWeight: 900, color: "#1f5f4e" }}>{r.total}</span>
                <span style={{ fontSize: 48, fontWeight: 500, color: "#6b665d", marginLeft: 12 }}>/ {r.max}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 360, gap: 26 }}>
              {DOMAINS.map((d) => {
                const s = r.domains[d];
                return (
                  <div key={d} style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 500 }}>
                      <span>{d}</span>
                      <span style={{ color: "#6b665d" }}>
                        {s.correct}/{s.total}
                      </span>
                    </div>
                    <div style={{ display: "flex", height: 16, borderRadius: 8, background: "#e4dfd4", marginTop: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          width: `${(s.correct / s.total) * 100}%`,
                          height: 16,
                          borderRadius: 8,
                          background: "#1f5f4e",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, alignItems: "center", fontSize: 80, fontWeight: 900 }}>
            한국어 능력 테스트
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 26, fontWeight: 500, color: "#6b665d" }}>
          나도 해 보기
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
