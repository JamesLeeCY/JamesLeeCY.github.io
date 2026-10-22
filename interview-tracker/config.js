// Supabase 連線設定。
// 這兩個值放在公開 repo 是安全的：publishable key 本來就設計給瀏覽器用，
// 真正的保護來自 schema.sql 裡的 Row Level Security。
// 請勿把 secret key（sb_secret_）或 service_role key 放在這裡。
export const SUPABASE_URL = 'https://kbrqlrsuklttabfjrymx.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_wmM-3MC1pydB7zqTkJO-sg_wX6jqvl1';
