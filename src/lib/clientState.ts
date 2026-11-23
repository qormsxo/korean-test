"use client";
// 진행 상태(새로고침해도 이어 풀기). sessionStorage가 막혀 있어도 화면은 동작하도록 모두 try/catch.
import type { OptionKey } from "./bank";
import type { AgeGroupKey } from "./ageGroups";

export type RunState = {
  sessionId: string;
  setId: string;
  ageGroup: AgeGroupKey;
  index: number; // 현재 문항 위치(0부터)
  answers: Record<string, OptionKey>;
  revealed: boolean; // 현재 문항 정답 공개 여부
  questionShownAt: number;
  shareCode?: string; // 끝까지 푼 경우
};

const KEY = "kt:run";

export function loadRun(): RunState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RunState) : null;
  } catch {
    return null;
  }
}

export function saveRun(s: RunState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 저장 불가 환경: 메모리 상태로만 진행 */
  }
}

/** 이벤트 핸들러에서 쓰는 현재 시각(ms). */
export function nowMs(): number {
  return Date.now();
}

export function newSessionId(): string {
  return crypto.randomUUID();
}

const ANON_KEY = "kt:anon";

/**
 * 브라우저 단위 익명 ID(localStorage). 같은 브라우저의 재응시를 하나로 묶어
 * '첫 시도만' 집계할 수 있게 한다. 개인 정보가 아닌 무작위 값이며,
 * 저장이 막힌 환경(시크릿 창 등)에서는 null → 세션만 기록된다.
 */
export function getAnonId(): string | null {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** 로그 전송. 실패해도 풀이를 막지 않는다. */
export function sendEvent(body: Record<string, unknown>) {
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* noop */
  }
}
