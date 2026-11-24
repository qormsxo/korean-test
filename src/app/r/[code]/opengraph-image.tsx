// 공유 카드 1200×630. 유형(+또래 버전 별명)만 보여 준다. 점수는 넣지 않는다.
import { ImageResponse } from "next/og";
import { AGE_GROUPS } from "@/lib/ageGroups";
import { koreanFonts } from "@/lib/ogFont";
import { allResultCodes, parseResultCode, RESULT_TYPES } from "@/lib/resultTypes";

export const alt = "내 한국어 실력 유형 테스트 결과 카드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allResultCodes().map((code) => ({ code }));
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const r = parseResultCode(code);
  const t = r ? RESULT_TYPES[r.type] : null;
  const flavor =
    r?.age && t ? `${AGE_GROUPS.find((a) => a.key === r.age)?.label} 버전 · ${t.ages[r.age].title}` : null;

  const text = `${t ? t.name + t.headline : ""}${flavor ?? ""}내 한국어 실력 유형 테스트나의 한국어 유형은나도 해 보기`;
  const fonts = await koreanFonts(text);

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
              {flavor && (
                <div
                  style={{
                    display: "flex",
                    alignSelf: "flex-start",
                    marginTop: 28,
                    padding: "12px 24px",
                    borderRadius: 16,
                    background: "#e3efe9",
                    color: "#1f5f4e",
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  {flavor}
                </div>
              )}
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
