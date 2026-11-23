// 공유 카드 1200×630. 유형만 보여 준다(점수·연령대는 넣지 않음).
import { ImageResponse } from "next/og";
import { isResultTypeKey, RESULT_TYPE_KEYS, RESULT_TYPES } from "@/lib/resultTypes";

export const alt = "내 한국어 실력 유형 테스트 결과 카드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return RESULT_TYPE_KEYS.map((code) => ({ code }));
}

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
  const t = isResultTypeKey(code) ? RESULT_TYPES[code] : null;

  const text = `${t ? t.name + t.headline : ""}내 한국어 실력 유형 테스트나의 한국어 유형은나도 해 보기`;
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
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: "#1f5f4e" }}>내 한국어 실력 유형 테스트</div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {t ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 36, fontWeight: 500, color: "#6b665d" }}>나의 한국어 유형은</div>
              <div
                style={{
                  display: "flex",
                  fontSize: t.name.length > 9 ? 84 : 100,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginTop: 16,
                  color: "#1f5f4e",
                  wordBreak: "keep-all",
                }}
              >
                {t.name}
              </div>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 500, marginTop: 24 }}>{t.headline}</div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 72, fontWeight: 900 }}>내 한국어 실력 유형 테스트</div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 26, fontWeight: 500, color: "#6b665d" }}>
          나도 해 보기
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
