// 서버 전용 Supabase 클라이언트(service role / secret key). 환경 변수가 없으면 null → 로그를 건너뛴다.
// 한 프로젝트를 여러 서비스가 스키마로 나눠 쓰므로 이 서비스는 korean_test 스키마에만 접근한다.
// (대시보드 Settings → API(Data API) → Exposed schemas 에 korean_test 가 있어야 한다)
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA ?? "korean_test";

// 생성된 DB 타입 없이 쓰므로 스키마 타입은 느슨하게 둔다(행 형태는 route.ts 에서 검증한 값만 넣는다).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminClient = SupabaseClient<any, any, any>;
let client: AdminClient | null | undefined;

export function getSupabaseAdmin(): AdminClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client =
    url && key
      ? createClient(url, key, { db: { schema: DB_SCHEMA }, auth: { persistSession: false, autoRefreshToken: false } })
      : null;
  return client;
}
