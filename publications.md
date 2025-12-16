---
layout: page
title: Publications and Presentations
permalink: /publications.html
---

## 期刊文章 (Journal Articles)

{% for item in site.data.publications.journal_articles %}
* [cite_start]**{{ item.title }}** [cite: 47]
  * [cite_start]{{ item.authors }} [cite: 46] ({{ item.year }}) [cite_start][cite: 46]
  * [cite_start]*{{ item.journal }}* [cite: 48]
  * [cite_start][DOI: {{ item.doi }}]({{ item.doi }}) [cite: 48]
{% endfor %}

## 會議發表 (Conference)

* Lee, C. Y., Yu, C. P., Gutchess, A., Goh, J. O. S. (2024). The Role of Environmental Preferences for Forest and Urban in Nature-Based Interventions. [cite_start]Annual Meeting for Psychonomics Society, NYC, NY, USA. [cite: 61, 62, 63, 64]
