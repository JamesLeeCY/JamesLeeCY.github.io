// Supabase 連線設定。
// 這兩個值放在公開 repo 是安全的：anon key 本來就設計給瀏覽器用，
// 真正的保護來自 schema.sql 裡的 Row Level Security。
// 請勿把 service_role key 放在這裡。
export const SUPABASE_URL = 'https://kbrqlrsuklttabfjrymx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticnFscnN1a2x0dGFiZmpyeW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NzUxMTYsImV4cCI6MjEwODI1MTExNn0.1gxz7tQwotMqC_RqcujRfZUkSeH_0hX7PAFz5i-GYZk';
