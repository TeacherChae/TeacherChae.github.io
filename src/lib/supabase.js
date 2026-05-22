// Supabase 클라이언트 (single instance).
// 환경변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)는 .env.local 에 둔다.
// 키가 없으면 supabase=null 이 되고, 각 컴포넌트는 "준비 중" 상태를 보여준다.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 키가 둘 다 채워져 있을 때만 연결됨.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
