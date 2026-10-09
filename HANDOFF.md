# Handoff — JamesLeeCY.github.io

狀態更新於 **2026-10-10**。接手時先讀這份。README 是給訪客看的簡介；這份記錄架構、
目前定位、以及待辦事項。

---

## 1. 定位

網站已從「學術 CV」轉為**產業求職作品集**：站名為「Chun-Yi Lee — Data Scientist」，
目標是台灣的資料科學、ML、AI 工程職缺（預計 2027 年 3 月畢業）。內容調整時以
「方法可轉用到產業」為主軸，研究成果只寫有出處支持的敘述。

## 2. 架構

Jekyll + GitHub Pages，推送 `main` 即部署，無 Gemfile／無建置腳本。

```
_config.yml            站名、描述、email、導覽列（site.navbar，6 頁）
_layouts/default.html  全站外框（Google Fonts: Inter + Lora）
_includes/
  header.html          依 site.navbar 產生導覽列，當前頁標 active
  footer.html          Email + LinkedIn
  skills.html          依 _data/skills.yml 產生技能區
_data/
  skills.yml           技能分組；style: tag（實心）/ method（外框）
  publications.yml     journal_articles / book_chapters / conferences_presentations
assets/css/style.css   全站樣式
assets/profile.jpg     大頭照
index.html             首頁：簡介、學歷、核心能力
projects.md            五個公開專案（連到各 GitHub repo）
research.md            研究主題 + 可轉用方法
publications.md        由 publications.yml 渲染
awards_leadership.md   獎項與領導
contact.md             聯絡方式
```

**改內容的原則：** 技能、發表優先改 `_data/*.yml`，不要寫死在頁面裡。

## 3. 近期完成

- 站名與首頁改為產業定位；修正學士學位與聯絡 email
- 新增 Projects 頁，連結五個公開 repo
- 技能擴充為產業導向分組，`skills.html` 改為資料驅動
- Research 頁改以可轉用方法為主軸；移除無出處支持的影像資料敘述
- 更換大頭照、移除未使用的全身照
- README 改寫為產業定位（2026-10-06）
- 依各 repo 最新狀態更新 Projects（2026-10-06）：RAG Copilot 補上混合檢索、
  切塊消融（Hit@5 100% vs 88%）、引文驗證與評審團；LINE Triage 改正為
  六項指標 + tripwire 的設計（原寫「監督式分類」不符），補上 webhook / Telegram
  匯入與進行中的股票社群模式。投資 Agent、半導體、fMRI 影像三個專案內容未變。
- 第二次同步 Projects（2026-10-10，對照各 repo 10/06–10/09 的 commit 與 README）：
  - 投資 Agent：改寫結論。舊卡片的 Brier 0.2530 vs 0.2529 已過時；現在主軸是
    271 檔無選股偏誤股票池、Sharpe 全低於 0050、精度加權從未奏效、只有財報 Agent
    產業內選股站得住（IC +0.029）、規則已凍結做前瞻驗證（正式紀錄 2026-11 起）。
  - RAG Copilot：預設評審改為 phi4；嚴格引用精確率 84% → 97%；加上信賴區間與
    「計畫寫成結果」規則檢查。
  - LINE Triage：股票社群模式從「進行中」改為實際結果（entropy 預測話題轉移
    AUC 0.62 → 0.71）；新增合成主管群組評估（初步 10 組）。

## 4. 待辦事項

1. **補發表連結**：`_data/publications.yml` 中書籍章節與兩筆會議發表的 `link` 仍為空
   （頁面會自動隱藏空連結，不會壞，但缺內容）。
2. **首頁寫死的路徑與 email**：`index.html` 的 `/projects.html`、`/publications.html`
   未用 `relative_url`，email 未用 `site.email`。改 email 時需同時改兩處，
   或改為引用 `site.email`。
3. **Projects 與 repo 同步**：五個專案（semiconductor-quality-ml、
   precision-weighted-investment-agent、paper-rag-copilot、fmri-video-feature-analysis、
   line-chat-triage）若有新成果或指標，記得回頭更新 `projects.md`。
   - LINE Triage 的合成評估目前只有 10 組（卡片已註明「初步」），跑滿 100 組並經
     Claude 驗證後更新數字。
   - 投資 Agent 前瞻驗證 2026-11 起有正式紀錄，累積幾期後可補上 live IC。
   - RAG Copilot 的語料是未發表論文，網站只寫方法與彙總指標，不寫論文內容。
   - 私有 repo（fmri-db、brain-forest-exposure-study3、ntsec-forest-fmri、
     WQ_open_machine_taiwan 等）不放上網站。
