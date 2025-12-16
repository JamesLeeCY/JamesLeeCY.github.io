---
layout: page
title: Research Projects
permalink: /research.html
---

## 🔬 核心研究主題 (Core Research Themes)

我的研究主要圍繞三個關鍵領域：**自然環境對認知健康的影響**、**決策制定的神經機制**，以及**跨文化神經科學**。

### 1. 自然基干預與認知老化 (Nature-Based Interventions and Aging)

[cite_start]**專案：** 森林環境資訊的神經機制：應用於減輕認知老化 [cite: 29]
* [cite_start]**機構：** Academia Sinica & National Taiwan University (PhD's researcher, 2021-present) [cite: 27, 28]
* [cite_start]**貢獻：** 使用 **Python** 進行虛擬實境 (VR) 實驗設計 [cite: 30]，探索自然暴露對年長者認知功能的效益。
* [cite_start]**相關研究：** 評估短期影片自然暴露對認知功能的影響 [cite: 24]（Brandeis University 訪問學者期間）。

### 2. 文化、價值與決策制定 (Culture, Value, and Decision Making)

[cite_start]**專案：** 文化對學習和決策制定的影響 [cite: 33]
* [cite_start]**機構：** National Taiwan University (Research assistant, Data scientist, 2019-2021) [cite: 32, 34]
* [cite_start]**貢獻：** 使用 **Python** 進行實驗設計以執行跨國研究 [cite: 35][cite_start]；通過 Shell 和 SQL 建立了資料庫，實現了跨伺服器數據共享 [cite: 37]。

### 3. ADHD 與神經影像 (ADHD and Neuroimaging)

[cite_start]**專案：** 注意力不足/過動症成人與健康對照組在決策制定中價值神經處理的差異 [cite: 39]
* [cite_start]**機構：** National Taiwan University (Master's researcher, 2015-2018) [cite: 38]
* [cite_start]**貢獻：** 領導團隊招募 ADHD 患者進行 MRI 掃描 [cite: 41][cite_start]；開發了一個自動化系統，使用 **MATLAB** 和 **R** 處理和分析行為和 fMRI 數據 [cite: 43]。

---

## 6. 🎨 樣式表：`assets/css/style.css`

為了讓網站看起來專業，您至少需要一個基礎樣式表（您可以自行擴展）。

```css
/* assets/css/style.css */

/* 基本設定 */
:root {
    --primary-color: #004d40; /* 深綠色，呼應神經科學與自然主題 */
    --secondary-color: #a7ffeb;
    --text-color: #333;
    --background-color: #f7f7f7;
    --max-width: 1000px;
}

body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
}

/* 佈局容器 */
.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 20px;
}

/* 頁首樣式 */
.site-header {
    background-color: var(--primary-color);
    padding: 15px 0;
    color: white;
}

.site-title {
    color: white;
    text-decoration: none;
    font-size: 1.8em;
    font-weight: bold;
}

.site-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 20px;
}

.site-nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.site-nav a:hover {
    color: var(--secondary-color);
}

/* 技能標籤樣式 (在 _includes/skills.html 會用到) */
.tag-list, .method-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.tag-list li, .method-list li {
    background-color: var(--primary-color);
    color: white;
    padding: 5px 12px;
    border-radius: 5px;
    font-size: 0.9em;
}
