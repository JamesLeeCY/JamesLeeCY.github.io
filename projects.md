---
layout: default
title: Projects
permalink: /projects.html
---

<div class="page-content">
    <div class="page-header">
        <h1>Projects</h1>
        <p class="lead">將處理高維度、高雜訊資料的方法，從神經科學遷移到<strong>製造、金融與語言</strong>領域。公開專案都附完整程式碼與分析報告——包含那些「看起來成立、實際不成立」的結果。所有專案皆以 <strong>Claude Code</strong> 協助開發。</p>
    </div>

    <div class="research-item">
        <h3>半導體品質與良率預測 <span class="text-muted">/ Semiconductor Quality ML</span></h3>
        <div class="research-meta">
            <span class="research-badge">Manufacturing</span>
            <span class="research-badge">Anomaly Detection</span>
            <span class="research-badge">Graph Neural Networks</span>
        </div>
        <p>橫跨三個公開製造資料集的異常偵測與良率預測：靜態快照（SECOM）、製程時序（PHM 2016 CMP）、生產路徑圖（Bosch）。核心主張是<strong>方法選擇應該跟隨資料結構，而不是跟隨潮流</strong>。</p>
        <ul>
            <li>PHM CMP 官方競賽測試集達到 MSE 6.24 / MAE 1.82。</li>
            <li>Bosch 產線圖分析定位出站點 L3_S32 的失效率為整體的 <strong>7.8 倍</strong>——圖結構有助歸因，但無助預測。</li>
            <li>SECOM 走時序部署模擬顯示：<strong>沒有任何重訓策略勝過不重訓</strong>，並說明原因（8 個窗格僅 41 筆失效，無法區分四種策略）。偵測到飄移，不等於有能力修正它。</li>
            <li>六處「表面數字說一回事、追加一個診斷說另一回事」的案例，包含這個專案自己的主要宣稱。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>XGBoost</li><li>GNN</li><li>Concept Drift</li><li>Virtual Metrology</li><li>Imbalanced Classification</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/semiconductor-quality-ml" target="_blank" rel="noopener">GitHub</a>
            <a href="https://jamesleecy.github.io/semiconductor-quality-ml/" target="_blank" rel="noopener">完整分析報告</a>
        </p>
    </div>

    <div class="research-item">
        <h3>多代理人精度加權投資研究系統 <span class="text-muted">/ Precision-Weighted Multi-Agent</span></h3>
        <div class="research-meta">
            <span class="research-badge">Multi-Agent LLM</span>
            <span class="research-badge">Quantitative Research</span>
            <span class="research-badge">Forward Validation</span>
        </div>
        <p>借用神經科學<strong>預測處理框架</strong>中的 precision weighting 概念：財報、新聞、總經／籌碼、供應鏈（知識圖譜）、技術面等專家 Agent 各自產出帶信心值的判斷，仲裁層依各 Agent 的歷史準確度（Brier score EMA 的倒數）動態加權合成。LLM 判讀可接 Claude 或本地 qwen3:8b。</p>
        <ul>
            <li>無選股偏誤股票池：271 檔、每年依當時成交值取前 100 檔並含下市股，2019–2026 共 8,475 筆 walk-forward 預測；財報設公告遞延，杜絕 look-ahead。</li>
            <li><strong>誠實結論：</strong>方向準確率低於「永遠猜上漲」，所有策略的 Sharpe 都低於 0050。精度加權在真實資料上從未奏效——每期 IC 的標準差是平均的 4 倍，估計「誰比較可靠」的誤差和訊號本身一樣大。</li>
            <li>唯一站得住的訊號：財報 Agent 的產業內選股（IC +0.029，t 2.16），產業中性做多扣成本後每期 +0.26%。但樣本外 IR 只剩樣本內的 1/6–1/3，扣掉嘗試次數的 Deflated Sharpe 不顯著。</li>
            <li>過度擬合控制：規則於 2026-10-09 凍結並事先登錄評估方式，程式碼指紋一改就拒絕預測，紀錄只能新增；正式前瞻紀錄自 2026-11 起累積。每月由 Windows 工作排程器無人值守執行預測與結算，有新結果時自動重建研究儀表板。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>Multi-Agent</li><li>LLM</li><li>Walk-Forward Backtesting</li><li>Information Coefficient</li><li>Survivorship Bias</li><li>Deflated Sharpe</li><li>Brier Score</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>引用溯源的 RAG 系統 <span class="text-muted">/ Dissertation RAG Copilot</span></h3>
        <div class="research-meta">
            <span class="research-badge">RAG</span>
            <span class="research-badge">LLM Evaluation</span>
            <span class="research-badge">NLP</span>
        </div>
        <p>針對學術文獻庫的嚴格引用溯源 RAG 助理，內建可量化的幻覺率評估。<strong>檢索是簡單的那一半</strong>——能量化幻覺率，才是這個系統可以被信任的原因。</p>
        <ul>
            <li>混合檢索（dense embeddings ⊕ BM25，RRF 融合）：學術文字充滿 <code>ISFC</code>、<code>TFCE</code> 這類精確術語，純語意向量會把它們模糊掉。</li>
            <li>切塊消融實驗：依章節結構切塊在 26 題人工 golden set 上達 <strong>Hit@5 100% / MRR 0.952</strong>，固定長度基準為 88% / 0.794。</li>
            <li>驗證層由便宜到昂貴：逐字引文必須出現在被檢索的段落中，否則判為捏造；再交由 LLM 評審判定；另有規則檢查專抓「把研究計畫寫成研究結果」，送人工複核。</li>
            <li>評審本身也要被驗證：用刻意植入錯誤的已知答案集比較模型與 prompt，選出 phi4（誤放率 5%，95% CI 2–15%）；生成模型評自己的輸出反而最弱。</li>
            <li>逐則稽核系統錯誤後修正跨段引文與段落標題，嚴格引用精確率 84% → <strong>97%</strong>（30/31）；所有比率都附 Wilson 信賴區間，並註明小樣本下差異多半不顯著。至今沒有任何錯誤宣稱以「有出處支持」的狀態呈現給使用者。</li>
            <li>可完全離線運行（本地 Ollama），也支援期刊 PDF 語料。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>RAG</li><li>Hybrid Search</li><li>ChromaDB</li><li>LLM-as-Judge</li><li>Hallucination Evaluation</li><li>Confidence Intervals</li><li>Ollama</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/paper-rag-copilot" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>影像特徵萃取與時序對齊 <span class="text-muted">/ fMRI Video Feature Analysis</span></h3>
        <div class="research-meta">
            <span class="research-badge">Computer Vision</span>
            <span class="research-badge">Feature Engineering</span>
            <span class="research-badge">Time-Series</span>
        </div>
        <p>量化比較「自然」與「都市」自然情境影片中的低階視覺、動態、語義與物件層級資訊，以每個 TR（0.752 秒）為單位萃取熵值與能量指標。</p>
        <ul>
            <li>以 OpenCV、HOG 特徵與 YOLOv8 建立多層次特徵管線。</li>
            <li>把原始影片轉成能通過統計檢驗的迴歸變項序列，供 fMRI 分析使用。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>OpenCV</li><li>YOLOv8</li><li>HOG</li><li>Multimodal Time-Series</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/fmri-video-feature-analysis" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>中文對話風險分流系統 <span class="text-muted">/ LINE Group Health Triage</span></h3>
        <div class="research-meta">
            <span class="research-badge">NLP</span>
            <span class="research-badge">Text Classification</span>
            <span class="research-badge">Digital Health</span>
        </div>
        <p>針對 LINE 工作群組對話的健康度分流系統：自動分析對話、計算風險指標、產出 PDF 優先處理報告。把非結構化的中文對話紀錄，變成<strong>可排序、可行動的風險訊號</strong>。</p>
        <ul>
            <li>六項指標：未回應提問年齡、客戶回應延遲 P90（皆以業務時間計算）、最老未解議題（LLM 抽取）、負面情緒比例、訊息量，以及追蹤對話主題複雜度的<strong>語義熵時間序列</strong>。</li>
            <li>非補償性 tripwire：退款、投訴、找主管等升級訊號直接觸發，不會被其他良好指標平均掉。</li>
            <li>資料來源支援 LINE 匯出檔、LINE Messaging API webhook 即時接收，以及 Telegram 群組匯出。</li>
            <li>合成評估：由程式埋入標準答案（風險與誘餌）生成主管群組對話，本地 LLM 只負責改寫成台灣口語，對答案計分而非對另一個 AI 的意見計分。初步 10 組：規則系統誘餌零誤報、但漏掉換句話說的揚言；phi4 語意較好、時間推理不可靠；兩者組合後風險等級 9/10 正確（正擴充至 100 組）。</li>
            <li>股票社群模式（約 109 萬則 Telegram 訊息）：人工標註 165 則驗證 LLM 多空標註，LLM 標註與人工的一致性 Cohen’s κ 最高 0.42（隨機樣本）/ 0.55（加強樣本）；以標的 entropy 時間序列預測下一時間窗的話題轉移，AUC 0.62 → 0.71（95% CI 不含 0）。過程中抓出樣本數混淆——先前 AUC 0.82 的高分多半來自它。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>Chinese NLP</li><li>Semantic Entropy</li><li>LLM Labeling</li><li>Synthetic Benchmark</li><li>Walk-Forward Validation</li><li>FastAPI</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>國際會議線上報名與金流系統 <span class="text-muted">/ PACLIC 40 Registration</span></h3>
        <div class="research-meta">
            <span class="research-badge">Full-Stack Web</span>
            <span class="research-badge">Payment Integration</span>
            <span class="research-badge">Production Operations</span>
        </div>
        <p>第 40 屆 PACLIC（Pacific Asia Conference on Language, Information and Computation，2026/12 於台大舉辦）的線上報名與繳費系統，2026-10-01 正式上線。以既有會議報名系統為基礎，與團隊協作開發，我負責後端功能與上線維運。</p>
        <ul>
            <li>流程：Google 登入 → 報名表 → 學生上傳學生證 → 藍新金流（NewebPay）刷卡；主辦方後台審核學生證、匯出 CSV 名單。</li>
            <li>計價改為查表式：新費率的早鳥／一般價差在不同級距不一致，用單一折扣公式算不出來；早鳥資格以付款完成時間判定，截止後自動關閉報名與付款。</li>
            <li>個資保護：學生證於會後依保存期限自動刪除。</li>
            <li>部署與維運：Docker Compose + Nginx、GitHub Actions CI、需手動確認的正式部署流程、資料庫排程備份與還原演練。</li>
        </ul>
        <ul class="tag-list">
            <li>TypeScript</li><li>JavaScript</li><li>NestJS</li><li>Next.js</li><li>React</li><li>PostgreSQL</li><li>TypeORM</li><li>Zod</li><li>Docker</li><li>GitHub Actions</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://registration.linguistics.ntu.edu.tw" target="_blank" rel="noopener">正式站 ↗</a>
        </p>
    </div>

    <div class="divider"></div>

    <p class="text-muted" style="text-align:center">
        更多程式碼與進行中的專案：<a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">github.com/{{ site.github_username }}</a>
    </p>
</div>
