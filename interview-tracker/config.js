// Supabase 連線設定。
// 這兩個值放在公開 repo 是安全的：anon key 本來就設計給瀏覽器用，
// 真正的保護來自 schema.sql 裡的 Row Level Security。
// 請勿把 service_role key 放在這裡。
export const SUPABASE_URL = 'YOUR_SUPABASE_URL';            // 例：https://abcdefgh.supabase.co
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // Project Settings → API → anon public
