---
layout: default
title: Research
permalink: /research.html
---

<div class="page-content">
    <div class="page-header">
        <h1>Research</h1>
        <p class="lead">十年神經科學訓練，處理的其實是同一類問題：<strong>樣本少、維度高、雜訊大、效果量小</strong>。這一頁是三條研究主線，以及每一條留下哪些可以帶走的方法。實際遷移到製造、金融與語言資料上的成果，在 <a href="{{ '/projects.html' | relative_url }}">Projects</a>。</p>
    </div>

    <div class="research-item">
        <h3>🌿 自然環境與認知老化 <span class="text-muted">/ Nature Exposure and Cognitive Aging</span></h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University &amp; Academia Sinica</span>
            <span class="research-badge">2021 – Present</span>
            <span class="research-badge">PhD Research</span>
        </div>
        <p><strong>專案：</strong>森林環境資訊的神經機制：應用於減輕認知老化</p>
        <ul>
            <li>以 <strong>Python</strong> 建立虛擬實境 (VR) 實驗環境，量測自然暴露對年長者認知功能的效益。</li>
            <li>Brandeis University 訪問學者期間，評估短期影片自然暴露的認知效果。</li>
            <li>把原始影片依掃描器取樣週期（TR = 0.752 秒，900 個時間點）重新取樣，拆成低階視覺、動態、語義與物件層級的特徵序列，與 fMRI 時序對齊成可檢定的迴歸變項。</li>
            <li>訊號處理：以相鄰影格差分計算動態能量、以 Shannon entropy 量化空間與時間上的不可預測性、以滑動視窗追蹤語義變化，並用功率頻譜密度（PSD）比較兩類刺激的時間頻率結構。</li>
            <li>發表：Psychonomics Society Annual Meeting, NYC (2024)。</li>
        </ul>
        <p class="research-transfer"><strong>方法遷移：</strong>訊號處理與多模態特徵工程——取樣對齊、差分、entropy、頻譜分析，把非結構化訊號轉成可建模的時序變項——同一套作法用在 <a href="https://github.com/JamesLeeCY/semiconductor-quality-ml" target="_blank" rel="noopener">CMP 製程感測序列</a>的虛擬量測，以及 <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">聊天群組的話題 entropy 時間序列</a>（以 entropy 預測下一時間窗的話題轉移）。</p>
        <ul class="tag-list">
            <li>Python</li><li>VR Experimental Design</li><li>Signal Processing</li><li>OpenCV</li><li>YOLOv8</li><li>Multimodal Time-Series</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/fmri-video-feature-analysis" target="_blank" rel="noopener">相關程式碼 ↗</a>
        </p>
    </div>

    <div class="research-item">
        <h3>🌐 文化、價值與決策制定 <span class="text-muted">/ Culture, Value, and Decision Making</span></h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University</span>
            <span class="research-badge">2019 – 2021</span>
            <span class="research-badge">Research Assistant</span>
        </div>
        <p><strong>專案：</strong>文化對學習與決策制定的影響（台美跨國研究）</p>
        <ul>
            <li>以 <strong>Python</strong> 設計可在兩地同步執行的跨國實驗流程。</li>
            <li>用 <strong>Shell</strong> 與 <strong>SQL</strong> 建立資料庫，讓跨伺服器的資料共享與版本控制可行。</li>
            <li>跨站點 multiband fMRI 訊號的驗證與校準：同一批受試者在台、美兩地以相同型號的 3T 掃描器重複視覺與動作任務，再以 ANOVA 拆解受試者、任務與站點效應——不同掃描站點之間的系統性差異若不先校正，後續所有組間比較都不成立。</li>
            <li>發表：<em>Biological Psychology</em> (2021)；<em>Clinical Cultural Neuroscience</em> 書籍章節 (Oxford University Press, 2019)；Cognitive Neuroscience Society Annual Meeting, Virtual (2020)。</li>
        </ul>
        <p class="research-transfer"><strong>方法遷移：</strong>跨站點資料整合與批次效應校正、資料管線與 QC 流程——對應到跨廠、跨機台、跨資料源整合時的同一個問題。研究「人在機率與價值下如何決策」的訓練，則直接帶進 <a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">多代理人投資研究系統</a>：每個判斷都是機率，用 Brier score 與校準曲線評估，而不只看對錯。</p>
        <ul class="tag-list">
            <li>Python</li><li>Shell</li><li>SQL</li><li>fMRI Signal Calibration</li><li>Cross-Site Data Integration</li><li>Data QC Pipelines</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://doi.org/10.1016/j.biopsycho.2021.108209" target="_blank" rel="noopener">DOI ↗</a>
        </p>
    </div>

    <div class="research-item">
        <h3>🧩 ADHD 與神經影像 <span class="text-muted">/ ADHD and Neuroimaging</span></h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University</span>
            <span class="research-badge">2015 – 2018</span>
            <span class="research-badge">Master's Research</span>
        </div>
        <p><strong>專案：</strong>注意力不足／過動症成人與健康對照組在決策制定中價值神經處理的差異</p>
        <ul>
            <li>領導團隊完成 ADHD 受試者招募與 MRI 掃描排程。</li>
            <li>以 <strong>MATLAB</strong> 與 <strong>R</strong> 開發自動化管線，處理並分析行為與 fMRI 資料。</li>
            <li>發表：<em>Journal of Psychiatry and Neuroscience</em> (2023)。</li>
        </ul>
        <p class="research-transfer"><strong>方法遷移：</strong>小樣本、高維度、組別不平衡下的統計建模與多重比較校正；端到端自動化分析管線——這是後來所有專案的底層習慣：<a href="https://github.com/JamesLeeCY/paper-rag-copilot" target="_blank" rel="noopener">RAG 系統</a>的每個比率都附信賴區間，<a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">量化回測</a>用 Deflated Sharpe 扣掉嘗試次數，<a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">對話預測</a>以區塊 bootstrap 估計增益的不確定性。</p>
        <ul class="tag-list">
            <li>MATLAB</li><li>R</li><li>Statistical Modeling</li><li>Experimental Design</li><li>Pipeline Development</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://doi.org/10.1503/jpn.220123" target="_blank" rel="noopener">DOI ↗</a>
        </p>
    </div>

    <div class="divider"></div>

    <p class="text-muted" style="text-align:center">
        完整發表清單見 <a href="{{ '/publications.html' | relative_url }}">Publications</a>；把這些方法用在產業資料上的成果見 <a href="{{ '/projects.html' | relative_url }}">Projects</a>。
    </p>
</div>
