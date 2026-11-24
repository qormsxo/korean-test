// 홈 공유 카드 1200×630
import { ImageResponse } from "next/og";
import { koreanFonts } from "@/lib/ogFont";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — '사흘'은 며칠일까요?`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HOOK = "'사흘'은 며칠일까요?";
const SUB = "20개 질문으로 알아보는 나의 한국어 습관 유형";
const CTA = "나는 사전파일까, 감각파일까?";

export default async function Image() {
  const fonts = await koreanFonts(`${SITE_NAME}${HOOK}${SUB}${CTA}`);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f7f5f0",
          color: "#1d1b18",
          padding: "64px 80px",
          fontFamily: "Noto",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 500, color: "#1f5f4e" }}>{SITE_NAME}</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 900, marginTop: 24, lineHeight: 1.15 }}>{HOOK}</div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 500, color: "#6b665d", marginTop: 28 }}>{SUB}</div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            marginTop: 40,
            padding: "14px 28px",
            borderRadius: 18,
            background: "#1f5f4e",
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          {CTA}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
