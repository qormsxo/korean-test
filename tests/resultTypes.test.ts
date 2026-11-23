import { describe, expect, it } from "vitest";
import { allResultCodes, FLAVOR_AGE_KEYS, parseResultCode, RESULT_TYPE_KEYS, RESULT_TYPES, resultCode } from "@/lib/resultTypes";

describe("결과 유형 문구", () => {
  it("모든 유형이 특징 3개와 모든 연령대 또래 버전을 가진다", () => {
    for (const k of RESULT_TYPE_KEYS) {
      expect(RESULT_TYPES[k].traits, k).toHaveLength(3);
      for (const a of FLAVOR_AGE_KEYS) {
        expect(RESULT_TYPES[k].ages[a].title, `${k}/${a}`).toBeTruthy();
        expect(RESULT_TYPES[k].ages[a].line, `${k}/${a}`).toBeTruthy();
      }
    }
  });
});

describe("결과 URL 코드", () => {
  it("연령대가 있으면 붙이고, '밝히지 않음'이면 유형만", () => {
    expect(resultCode("classic", "30s")).toBe("classic-30s");
    expect(resultCode("classic", "undisclosed")).toBe("classic");
  });
  it("해석이 왕복된다", () => {
    for (const code of allResultCodes()) expect(parseResultCode(code), code).not.toBeNull();
    expect(allResultCodes()).toHaveLength(6 * 7);
    expect(parseResultCode("classic-30s")).toEqual({ type: "classic", age: "30s" });
    expect(parseResultCode("grower")).toEqual({ type: "grower", age: null });
  });
  it("모르는 유형·연령대는 거부", () => {
    for (const bad of ["hacker", "classic-99s", "classic-undisclosed", "classic-30s-x", "grower-4211"])
      expect(parseResultCode(bad), bad).toBeNull();
  });
});
