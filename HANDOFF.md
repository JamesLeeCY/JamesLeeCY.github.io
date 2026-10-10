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
_config.yml            站名、描述、聯絡資訊（email / github_username / linkedin_url）、導覽列
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
- 技能區塊補上新專案用到的技術（2026-10-10）：混合檢索、LLM-as-Judge、本地 LLM、
  知識圖譜、向量資料庫、FastAPI、信賴區間、標註一致性等；新增「量化研究」分組
  （walk-forward、IC、無選股偏誤股票池、Deflated Sharpe、前瞻驗證）。只列 repo
  README 裡確實用到的技術。
- 技能區塊新增「LLM 評估」分組（2026-10-10），從「AI 與 LLM」拆出：檢索指標、引用精確率、
  幻覺評估、LLM-as-Judge、LLM 標註與人工驗證。
- Research 頁對齊最新專案（2026-10-10）：三段「方法遷移」改為連到實際專案；
  CNS 2020 地點改為 Virtual，與 Publications 一致。
- Projects 新增第六張卡 PACLIC 40 報名與金流系統（2026-10-10）：repo 私有
  （ioltw/paclic-backend、ioltw/paclic-frontend），卡片只連正式站，不連 repo、
  不寫報名人數或主辦方人員等營運資訊。每張卡加上 Claude Code 標籤，頁首註明
  所有專案皆以 Claude Code 協助開發。
- 技能：移除 Clustering；新增 TypeScript 與「Web 開發」分組（對應 PACLIC）；
  kappa 改稱「LLM–Human Label Agreement」（只有一位人工標註者，不是標註者間一致性），
  LINE 卡片補上 κ 最高 0.42（隨機，Qwen3 v1）/ 0.55（加強，Qwen3 v2），兩個數字來自不同提示詞版本。
- 技能 Model Calibration 拿掉 ECE（網站已無對應）；投資 Agent 卡片補上每月排程自動執行
  前瞻驗證並重建研究儀表板，對應 Scheduled Pipelines。
- 技能對應補強（2026-10-10）：
  - Prompt & Context Engineering：RAG 卡片補上強制引用的 XML prompt、隔離的評審 context、
    評審 prompt 逐版改進；同時在 paper-rag-copilot README 新增
    「Prompt & context engineering」一節（commit 10dc3da）。
  - Signal Processing：Research 頁補上影片依 TR 重新取樣、影格差分、entropy、PSD，
    以及跨站點 fMRI 訊號校準的實驗設計（依據：fmri-video-feature-analysis README、
    CNS 2020 摘要）。
  至此技能區塊每一項都能在 Projects 或 Research 頁找到對應。
- 同步專案（2026-10-10 下午）：五個公開 repo 自上次同步後無新 commit。PACLIC 補上
  「金額只在後端計算」「學生證審核與付款脫鉤」兩項設計，備份改寫為每日加密並同步雲端
  （依 ioltw/paclic-backend 新 README 與 commit）。報名人數等營運數字不放。
- 呈現方式調整（2026-10-10，使用者要求「誠實報告不代表是好報告」）：Projects 卡片順序改為
  RAG、影像特徵、LINE、PACLIC、半導體、投資 Agent（README 與 GitHub 個人頁同順序）；
  拿掉「看起來成立、實際不成立」「誠實結論」等以負面結果為主軸的寫法，改以「做了什麼、
  發現什麼」開頭，但保留中性事實（例如選股策略 Sharpe 尚未超越 0050、樣本外效果較小），
  不寫成誤導的正面結果。
- 定位補強（2026-10-10）：首頁簡介補上 RAG 與上線的全端系統；Contact 頁改以求職為主；
  README 改為六個專案（含 PACLIC）。GitHub 個人頁（JamesLeeCY/JamesLeeCY）同步更新
  代表作品與技術列表。

## 4. 待辦事項

0. ~~工作經歷與履歷~~（2026-10-10 完成）：首頁新增「工作經歷」區塊（WorldQuant BRAIN、
   台大博士研究含 Brandeis 訪問、優照護 R&D 專案經理 2021.03–08、台大碩士研究），內容取自
   使用者的 Finance 版 CV 與 GitHub 個人頁。履歷放在 `assets/CV_ChunYiLee.pdf`：由
   Google Doc「CV_DataScientist_Finance」匯出的 PDF 移除手機號碼（聯絡行以 Calibri 重排，
   已確認原始資料無殘留），首頁加下載連結。BTBA 改為 Fundraising Co-Lead、2024–2025。
   - CV 更新時：從 Google Doc（無法用 connector 編輯，只能讀取／匯出）匯出 PDF，移除電話後覆蓋 `assets/CV_ChunYiLee.pdf`。
   - 2026-10-10 更新：使用者在 Google Doc 貼上新的投資專案段落（271 檔、8,475 筆、IC +0.029），
     標題改為「Data Scientist」；網站 PDF 已重新匯出。
   - 注意：Google Doc 目前匯出時，經歷標題右側的地點與日期不再靠右（黏在標題後面）。
     網站版 PDF 已在匯出後把這三段移回靠右（右緣 x=557）。下次匯出前最好先在 Google Doc
     修好對齊（加右對齊定位點），否則要重做這一步。
1. ~~補發表連結~~（2026-10-10 完成）：書籍章節連到 OUP 書籍頁（第 6 章，無章節 DOI）；
   兩筆會議連到官方摘要集 PDF 的對應頁（CNS 2020 p.86 海報 C92、Psychonomics 2024
   p.313 海報 3067）。同時把書名副標更正為 OUP 官方的
   *An Integrative Approach to Cross-Cultural Neuropsychology*。
   - Psychonomics 2024 作者順序已依摘要集改為 Lee, Goh, Yu, Gutchess；
     CNS 2020 地點改為 Virtual（原定 Boston，因疫情改線上）。
2. ~~寫死的路徑與聯絡資訊~~（2026-10-10 完成）：email、GitHub 帳號、LinkedIn 集中在
   `_config.yml`（`email`、`github_username`、`linkedin_url`），全站以 `site.*` 引用；
   站內連結一律用 `relative_url`。改聯絡方式只需改 `_config.yml`。
3. **Projects 與 repo 同步**：六個專案（semiconductor-quality-ml、
   precision-weighted-investment-agent、paper-rag-copilot、fmri-video-feature-analysis、
   line-chat-triage，以及私有的 PACLIC 40）若有新成果或指標，記得回頭更新 `projects.md`。
   - LINE Triage 的合成評估目前只有 10 組（卡片已註明「初步」），跑滿 100 組並經
     Claude 驗證後更新數字。
   - 投資 Agent 前瞻驗證 2026-11 起有正式紀錄，累積幾期後可補上 live IC。
   - RAG Copilot 的語料是未發表論文，網站只寫方法與彙總指標，不寫論文內容。
   - 私有 repo（fmri-db、brain-forest-exposure-study3、ntsec-forest-fmri、
     WQ_open_machine_taiwan 等）不放上網站。例外：PACLIC 40 經使用者同意列出，只連正式站。
