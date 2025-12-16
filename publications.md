---
layout: page
title: Publications and Presentations
permalink: /publications.html
---

## 期刊文章 (Journal Articles)

{% for item in site.data.publications.journal_articles %}
* **{{ item.title }}**
  * {{ item.authors }} ({{ item.year }})
  * *{{ item.journal }}*{% if item.volume %}, {{ item.volume }}{% endif %}{% if item.issue %}({{ item.issue }}){% endif %}{% if item.pages %}, {{ item.pages }}{% endif %}
  * [DOI: {{ item.doi }}]({{ item.doi }})
{% endfor %}

## 書籍章節 (Book Chapters)

{% for item in site.data.publications.book_chapters %}
* **{{ item.title }}**
  * {{ item.authors }} ({{ item.year }})
  * In {{ item.editor }} (Ed.), *{{ item.book }}*
  * {{ item.publisher }}
  {% if item.link %}* [Link]({{ item.link }}){% endif %}
{% endfor %}

## 會議發表 (Conferences & Presentations)

{% for item in site.data.publications.conferences_presentations %}
* **{{ item.title }}**
  * {{ item.authors }} ({{ item.year }})
  * {{ item.event }}, {{ item.location }}
  {% if item.link %}* [PDF]({{ item.link }}){% endif %}
{% endfor %}
