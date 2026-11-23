// 풀이 로그 수집. 정답 여부·점수·유형은 클라이언트 값을 믿지 않고 서버에서 다시 계산한다.
import { createHash } from "node:crypto";
import { isAgeGroupKey } from "@/lib/ageGroups";
import { getRawQuestion, OPTION_KEYS, type OptionKey } from "@/lib/bank";
import { decideResultType, scoreAnswers } from "@/lib/scoring";
import { BANK_HASH, scoringItems } from "@/lib/setMeta";
import { CURRENT_SET } from "@/lib/sets";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const setIds = new Set<string>(CURRENT_SET.questionIds);
const isOption = (v: unknown): v is OptionKey => typeof v === "string" && (OPTION_KEYS as string[]).includes(v);
const bad = (msg: string) => Response.json({ error: msg }, { status: 400 });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }
  const { type, sessionId } = body;
  if (typeof sessionId !== "string" || !UUID.test(sessionId)) return bad("sessionId");
  if (body.setId !== CURRENT_SET.id) return bad("setId");

  const db = getSupabaseAdmin();
  const log = async (table: string, op: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await op;
    if (error) console.error(`[events] ${table}:`, error.message);
  };

  if (type === "start") {
    if (!isAgeGroupKey(body.ageGroup)) return bad("ageGroup");
    const ua = req.headers.get("user-agent") ?? "";
    const anonId = typeof body.anonId === "string" && UUID.test(body.anonId) ? body.anonId : null;
    const row = {
      id: sessionId,
      anon_id: anonId,
      set_id: CURRENT_SET.id,
      bank_hash: BANK_HASH,
      age_group: body.ageGroup,
      user_agent_hash: createHash("sha256").update(ua).digest("hex").slice(0, 16),
    };
    if (!db) return devLog("start", row);
    await log("quiz_sessions", db.from("quiz_sessions").upsert(row, { onConflict: "id", ignoreDuplicates: true }));
    return new Response(null, { status: 204 });
  }

  if (type === "answer") {
    const { questionId, position, chosen, elapsedMs } = body;
    if (typeof questionId !== "string" || !setIds.has(questionId)) return bad("questionId");
    if (!isOption(chosen)) return bad("chosen");
    if (!Number.isInteger(position) || (position as number) < 0 || (position as number) >= setIds.size) return bad("position");
    const row = {
      session_id: sessionId,
      question_id: questionId,
      position,
      chosen,
      is_correct: getRawQuestion(questionId).answer === chosen,
      elapsed_ms: Number.isFinite(elapsedMs) ? Math.min(Math.max(0, Math.round(elapsedMs as number)), 3_600_000) : null,
    };
    if (!db) return devLog("answer", row);
    await log(
      "quiz_answers",
      db.from("quiz_answers").upsert(row, { onConflict: "session_id,question_id", ignoreDuplicates: true }),
    );
    return new Response(null, { status: 204 });
  }

  if (type === "finish") {
    const raw = body.answers;
    if (!raw || typeof raw !== "object") return bad("answers");
    const answers: Record<string, OptionKey> = {};
    for (const [id, v] of Object.entries(raw)) if (setIds.has(id) && isOption(v)) answers[id] = v;
    const summary = scoreAnswers(scoringItems(), answers);
    const resultType = decideResultType(summary, CURRENT_SET.normChangedIds);
    const patch = {
      finished_at: new Date().toISOString(),
      total_score: summary.total,
      domain_scores: Object.fromEntries(Object.entries(summary.domains).map(([d, s]) => [d, s.correct])),
      result_type: resultType,
    };
    if (!db) return devLog("finish", patch);
    await log("quiz_sessions", db.from("quiz_sessions").update(patch).eq("id", sessionId).is("finished_at", null));
    return new Response(null, { status: 204 });
  }

  if (type === "share") {
    const channel = typeof body.channel === "string" ? body.channel.slice(0, 20) : "unknown";
    if (!db) return devLog("share", { sessionId, channel });
    await log("quiz_shares", db.from("quiz_shares").insert({ session_id: sessionId, channel }));
    return new Response(null, { status: 204 });
  }

  return bad("type");
}

function devLog(kind: string, row: unknown) {
  if (process.env.NODE_ENV !== "production") console.info(`[events:${kind}] (Supabase 미설정)`, row);
  return new Response(null, { status: 204 });
}
