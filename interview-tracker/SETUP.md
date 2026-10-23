# 面試追蹤：設定步驟

網址：<https://jamesleecy.github.io/interview-tracker/>（主程式，需登入）、`share.html`（公開分享頁）。
兩頁都有 `noindex`，也沒有放在網站導覽列。

## 1. 建立 Supabase 專案（一次性）

1. 到 <https://supabase.com> 登入，建立新專案（Free plan、區域選 Northeast Asia (Tokyo) 或 Southeast Asia (Singapore)）。
2. 左側 **SQL Editor** → New query，貼上本資料夾的 `schema.sql` 全文 → Run。可重複執行。
3. **Authentication → URL Configuration**
   - Site URL：`https://jamesleecy.github.io/interview-tracker/`
   - Redirect URLs 加上：`https://jamesleecy.github.io/interview-tracker/`
4. **Project Settings → API**：複製 Project URL 與 `anon` `public` key，填進 `config.js`。
   - anon key 放在公開 repo 是正常做法，保護靠的是 RLS。
   - **絕對不要**把 `service_role` key 放進 repo。

## 2. 第一次登入後

1. 打開主程式，輸入 email，點信裡的登入連結。
2. 登入成功後，到 Authentication 的登入設定關掉 "Allow new users to sign up"
   ，避免陌生人註冊。即使有人註冊，也讀不到你的資料。

## 資料與隱私

| 會出現在分享頁 | 永遠不會出現 |
| --- | --- |
| 標記公開的應徵：公司（可匿名）、職缺、狀態、公開說明 | 聯絡人、認識的人、求職網站帳號、最新消息、職缺網址、地點、薪資／條件、備註 |
| 這些應徵的關卡：名稱、日期、類型、形式、結果、公開版心得 | 面試官、私人心得、可改進處、自評 |
| 所有準備紀錄的次數與時數彙總；標記公開的練習與其公開說明 | 練習的私人筆記、題目／夥伴、弱點標籤 |

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html` `app.js` | 主程式（時間軸、看板、詳情、準備紀錄、統計） |
| `share.html` `share.js` | 公開分享頁 |
| `common.js` | 共用常數、日期工具、Supabase client |
| `app.css` | 樣式（沿用作品集配色，預設深色） |
| `config.js` | Supabase URL 與 anon key |
| `schema.sql` | 資料表、RLS、公開 view |

密碼不存在這個系統：表單只有「求職網站帳號」，密碼請放密碼管理工具。
