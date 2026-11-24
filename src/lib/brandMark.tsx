// 파비콘·앱 아이콘 공용 마크: 초록 바탕에 흰 '가'.
import { ImageResponse } from "next/og";
import { koreanFonts } from "./ogFont";

export async function brandMark(px: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f5f4e",
          color: "#ffffff",
          borderRadius: px * 0.22,
          fontFamily: "Noto",
          fontWeight: 900,
          fontSize: px * 0.62,
        }}
      >
        가
      </div>
    ),
    { width: px, height: px, fonts: await koreanFonts("가") },
  );
}
