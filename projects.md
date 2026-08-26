---
layout: default
title: Projects
permalink: /projects.html
---

<div class="page-content">
    <div class="page-header">
        <h1>Projects</h1>
        <p class="lead">將處理高維度、高雜訊資料的方法，從神經科學遷移到<strong>製造、金融與語言</strong>領域。每個專案都附完整程式碼與分析報告——包含那些「看起來成立、實際不成立」的結果。</p>
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
            <li>Python</li><li>XGBoost</li><li>GNN</li><li>Concept Drift</li><li>Virtual Metrology</li><li>Imbalanced Classification</li>
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
            <span class="research-badge">Calibration</span>
            <span class="research-badge">Quantitative Finance</span>
        </div>
        <p>借用神經科學<strong>預測處理框架</strong>中的 precision weighting 概念：多個專家 Agent（財報、新聞事件）各自產出帶信心值的判斷，仲裁層依各 Agent 的歷史準確度（Brier score EMA 的倒數）動態加權合成。系統從均等權重隨證據累積收斂到以可靠來源為主導。</p>
        <ul>
            <li>走時序回測：FinMind 真實資料，5 檔被動元件標的、2024-01 至 2026-05、135 個預測事件。</li>
            <li>以 Brier score、方向準確率、ECE（期望校準誤差）三項評估，而非只看準確率。</li>
            <li><strong>誠實結論：</strong>精度加權只在來源可靠度實質分化時勝出（synthetic 驗證 17/20 seeds）。真實回測中各 Agent 可靠度相近，它並未贏過簡單平均（0.2530 vs 0.2529）。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>LLM</li><li>Multi-Agent</li><li>Brier Score</li><li>ECE</li><li>Walk-Forward Backtesting</li>
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
            <li>Embedding 檢索與上下文組裝，回答一律附可驗證的原文引用。</li>
            <li>幻覺評估流程量化「模型宣稱有出處、但出處不支持該宣稱」的比例。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>RAG</li><li>Embeddings</li><li>Semantic Search</li><li>Hallucination Evaluation</li>
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
            <li>Python</li><li>OpenCV</li><li>YOLOv8</li><li>HOG</li><li>Multimodal Time-Series</li>
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
        <p>針對 LINE 群組對話的健康度分流系統：自動分析對話、計算風險指標、產出 PDF 報告。把非結構化的中文對話紀錄，變成<strong>可排序、可行動的風險訊號</strong>。</p>
        <ul>
            <li>端到端 NLP 管線：資料前處理、特徵萃取、監督式分類模型。</li>
            <li>風險分數排序與自動化報告產出。</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>Chinese NLP</li><li>Text Classification</li><li>Risk Scoring</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="divider"></div>

    <p class="text-muted" style="text-align:center">
        更多程式碼與進行中的專案：<a href="https://github.com/JamesLeeCY" target="_blank" rel="noopener">github.com/JamesLeeCY</a>
    </p>
</div>
