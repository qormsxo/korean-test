// OG 이미지·아이콘용 Noto Sans KR. 쓰인 글자만 담은 서브셋(TTF)을 Google Fonts에서 받는다.
// 'use cache': 같은 글자·굵기 조합은 한 번만 받아 두고 재사용한다(아이콘·OG 이미지를 정적으로 생성).
export async function loadKoreanFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  "use cache";
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

export async function koreanFonts(text: string) {
  const [bold, regular] = await Promise.all([loadKoreanFont(text, 900), loadKoreanFont(text, 500)]);
  return [
    ...(bold ? [{ name: "Noto", data: bold, weight: 900 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Noto", data: regular, weight: 500 as const, style: "normal" as const }] : []),
  ];
}
