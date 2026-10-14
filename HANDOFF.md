# Handoff — JamesLeeCY.github.io

狀態更新於 **2026-10-13**。接手時先讀這份。README 是給訪客看的簡介；這份記錄架構、
目前定位、以及待辦事項。

---

## 1. 定位

網站已從「學術 CV」轉為**產業求職作品集**：站名為「Chun-Yi Lee — Data Scientist」，
目標是台灣的資料科學、ML、AI 工程職缺（預計 2027 年 3 月畢業）。內容調整時以
「方法可轉用到產業」為主軸，研究成果只寫有出處支持的敘述。

## 2. 架構

Jekyll + GitHub Pages，推送 `main` 即部署，無 Gemfile／無建置腳本。
本機預覽可用 Docker：`docker run --rm -v "<repo>:/srv/jekyll" -p 4000:4000 jekyll/jekyll:3.8 jekyll serve --destination /tmp/_site --force_polling`
（輸出放容器內 /tmp，不會在 repo 產生 _site）。

**中英雙語（2026-10-13）**：中文版在根目錄（網址不變），英文版在 `/en/`。每頁 front matter 必須有
`lang: zh|en` 與 `ref`（home / projects / research / publications / awards / contact），header 的語言
切換鈕依 `ref` 找另一語言的同一頁；layout 依 lang 設定 `<html lang>`、og:locale、描述與 hreflang。
**改內容時兩個語言要一起改**：中文頁可保留部分英文術語，英文頁必須是純英文（不得有中文字）。

```
_config.yml            站名、描述（description 中文 / description_en 英文）、聯絡資訊
_layouts/default.html  全站外框；依 page.lang 輸出 html lang、og:locale、hreflang
_includes/
  header.html          依 _data/i18n.yml 的 nav 產生導覽列 + 語言切換鈕（.lang-switch）
  footer.html          Email + LinkedIn
  skills.html          依 _data/skills.yml 產生技能區（title_zh / title_en）
_data/
  i18n.yml             各語言的導覽列與介面字串
  skills.yml           技能分組；style: tag（實心）/ method（外框）
  publications.yml     journal_articles / book_chapters / conferences_presentations（英文，兩語共用）
assets/css/style.css   全站樣式；900px 以下 header 改兩行，切換鈕固定右上
assets/profile.jpg     大頭照
index.html … contact.md   中文版六頁（根目錄）
en/index.html … en/contact.md  英文版六頁
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

- WorldQuant 經歷更新（2026-10-13，使用者提供）：65 個訊號通過品質、穩健性與相關性檢查（樣本內 Sharpe 中位數 1.98），7,600+ 次模擬，新增多訊號組合方法一條；網站中英首頁已改。CV（Google Doc 10h 與網站 PDF）已同步；Cake、LinkedIn 仍是舊數字（38 個、1.63、3,000+）。

- TAAB 2024 年會規模更新（2026-10-14，使用者提供）：首度移師紐約，現場約 150–200 人，含線上與工作團隊約 200–250 人，近 30 位講者。網站中英獎項頁與 CV 已改；Cake 履歷與 LinkedIn 仍寫 100+。（使用者提供的資料稱林清詠為「圖靈獎團隊」，查無出處，未採用。）

## 4. 待辦事項

0. ~~工作經歷與履歷~~（2026-10-10 完成）：首頁新增「工作經歷」區塊（WorldQuant BRAIN、
   台大博士研究含 Brandeis 訪問、優照護 R&D 專案經理 2021.03–08、台大碩士研究），內容取自
   使用者的 Finance 版 CV 與 GitHub 個人頁。履歷放在 `assets/CV_ChunYiLee.pdf`：由
   Google Doc「CV_DataScientist_Finance」匯出的 PDF 移除手機號碼（聯絡行以 Calibri 重排，
   已確認原始資料無殘留），首頁加下載連結。BTBA 改為 Fundraising Co-Lead、2024–2025。
   - **履歷來源（2026-10-12 起）**：Google Doc「CV_DataScientist_2026-10i」
     （https://docs.google.com/document/d/12SOknEm8-DLjKky6NJiQcytYZqOcgKJ1PrXvpF9YvQU/edit，2026-10-14 起；WorldQuant 65 個訊號、Sharpe 1.98、7,600+ 次模擬；TAAB 現場 150–200 人、約 30 位講者），投資專案含 SUE、LINE 含 100 組合成評估，
     WorldQuant 自 2026.08 起；Brandeis 訪問學者獨立成經歷；Leadership 加 TAAB 2024 年會
     （籌備委員、keynote 主持，講者 Dr. Ching-Yung Lin，Graphen CEO、前 IBM Chief Scientist）。
     由 docx 上傳轉換建立，A4、日期用右對齊定位點。經歷含 UCarer（優照護）R&D PM 2021.03–08、
     台大研究助理 2019.03–2021.08、消防替代役（內政部消防署訓練中心，南投）2018.04–2019.03。
     舊的「CV_DataScientist_Finance」不再使用；「CV_DataScientist_2026-10」「-10b」「-10c」「-10d」「-10e」「-10f」「-10g」已移到垃圾桶。TAAB 主持與籌備資訊來源為 TAAB 臉書（使用者確認）。
   - 投資 Agent 卡片補上月營收驚奇 SUE（2026-10-12，依 repo README 與研究儀表板）。研究儀表板是私人
     claude.ai artifact，組織設定不允許公開分享；改為在 investment repo 開 GitHub Pages（main / 根目錄，
     加 `.nojekyll`），公開網址 https://jamesleecy.github.io/precision-weighted-investment-agent/site/research-dashboard.html ，
     已連到投資 Agent 卡片與 GitHub 個人頁。repo 推送新版 `site/research-dashboard.html` 就會自動更新；架構圖已由 repo commit 1435d6d 修正，公開版正常顯示。
   - 分享預覽與網站圖示（2026-10-12）：`_layouts/default.html` 加 Open Graph / Twitter card / canonical
     與 favicon；預覽圖 `assets/og-image.jpg`（1200×630，含大頭照與重點經歷，經歷有變時要重做），
     圖示為「CL」字母組合：`favicon.ico`（根目錄）、`assets/favicon-32.png`、`assets/apple-touch-icon.png`。
   - GitHub 個人頁（JamesLeeCY/JamesLeeCY）背景段落已同步：WorldQuant、UCarer、Brandeis、BTBA、TAAB（2026-10-12）。
   - 首頁工作經歷與 CV 一致：WorldQuant、台大博士研究、優照護、台大研究助理、消防替代役、台大碩士研究。
   - Cake 履歷（cake.me，2026-10-12 更新，使用者自行登入後以內建瀏覽器編輯）：簡介改為 Data Scientist
     定位；工作經歷六筆與 CV 一致；博士學歷的社團活動改為 BTBA Fundraising Co-Lead 2024–2025、
     TAAB Organizing Committee & Keynote Moderator 2024；技能新增 LLM、RAG、LLM Evaluation、
     Multi-Agent Systems、Prompt Engineering、NLP、Statistical Modeling、Time Series Analysis、
     Quantitative Research、Backtesting、Docker、TypeScript；資格認證新增 WorldQuant Summer
     Experience Program — Certificate of Completion（2026 年 8 月，永久有效）；精選履歷已換成 2026-10g PDF。
     待使用者處理：精選作品的個人網站縮圖仍是舊版（刪除後重新加入即可重抓）。
     作品集（2026-10-12）：個人網站、fMRI、LINE 三件已更新內文／摘要／標籤並發布；RAG、PACLIC、半導體、
     投資 Agent 四件（內容取自 projects.md）由使用者上傳封面後已發布，Cake 上共 7 件作品。封面由
     scratchpad 的 make_covers.py 產生（上傳完成後 `cake_covers/` 已移到資源回收筒）。
     Cake 履歷（resume-builder/james820102，公開連結 cake.me/s--1lkSRFo-CAEnQKd85yC5sA--/james820102）2026-10-12 改為 CV 2026-10g 內容：
     拿掉電話、加上中研院合聘職稱，保留兩篇期刊論文。舊草稿「My Cake Resume (3)」已由使用者刪除，Cake 上只剩這一份履歷。
     編輯器是 Flutter canvas：點擊後先按一次 shift 喚醒鍵盤，ctrl+a 只選一段，跨段落用 shift+click 選取。
     Cake 建立新作品會跳 Cloudflare 驗證，需使用者手動通過；封面必填且只能上傳檔案。
     編輯注意：公司欄自動完成不可按 Escape（會選第一個建議），要點空白處關閉；技能欄打字後要等建議清單載入（約 2 秒）再按 Enter。
   - LinkedIn：文字已備妥，待使用者貼上，並到 Post Inspector 重新抓取網站預覽。簡介可寫中研院 Scientific Researcher（與台大合聘，使用者 2026-10-12 確認；期間未提供，故不寫年份）。
   - CV 更新時：從上述 Google Doc 匯出 PDF（Drive connector 只能讀取／匯出，不能編輯），
     移除聯絡行的電話（以 Calibri 9pt 重排、保留 GitHub 連結），覆蓋 `assets/CV_ChunYiLee.pdf`。
     腳本：scratchpad `cvdocx/build.py`（產生 docx）與 `cvdocx/redact.py <drive 匯出 json> <out.pdf>`（去電話並自我檢查）。
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
   - LINE Triage 合成評估已有 100 組結果（2026-10-12 同步）；待 repo 以全新 seed 驗證、跑完 Claude 驗證（C）後再更新。
   - RAG 生成端 prompt v2 已評估（維持 v1），已寫入卡片。
   - 投資 Agent 前瞻驗證：財報 Agent（fv1）2026-11 起、SUE（fv2）2026-10-13 起有正式紀錄，累積幾期後可補上 live IC。
   - RAG Copilot 的語料是未發表論文，網站只寫方法與彙總指標，不寫論文內容。
   - 私有 repo（fmri-db、brain-forest-exposure-study3、ntsec-forest-fmri、
     WQ_open_machine_taiwan 等）不放上網站。例外：PACLIC 40 經使用者同意列出，只連正式站。
