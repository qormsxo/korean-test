import type { MetadataRoute } from "next";
import { RESULT_TYPE_KEYS } from "@/lib/resultTypes";
import { SITE_URL } from "@/lib/site";

// 홈과 기본 유형 6개 페이지만 싣는다(연령대 버전은 canonical 이 기본 유형을 가리킴, 풀이 화면은 색인 제외).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...RESULT_TYPE_KEYS.map((t) => ({
      url: `${SITE_URL}/r/${t}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
