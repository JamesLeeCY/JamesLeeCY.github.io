---
layout: default
title: Publications
permalink: /en/publications.html
lang: en
ref: publications
---

<div class="page-content">
    <div class="page-header">
        <h1>Publications &amp; Presentations</h1>
        <p class="lead">Journal articles, book chapters and international conference presentations.</p>
    </div>

    <div class="pub-section">
        <h2>📄 Journal Articles</h2>
        {% for item in site.data.publications.journal_articles %}
        <div class="pub-item">
            <div class="pub-title">{{ item.title }}</div>
            <div class="pub-authors">{{ item.authors }} ({{ item.year }})</div>
            <div class="pub-journal">{{ item.journal }}{% if item.volume %}, {{ item.volume }}{% endif %}{% if item.issue %}({{ item.issue }}){% endif %}{% if item.pages %}, {{ item.pages }}{% endif %}</div>
            {% if item.doi %}<div class="pub-doi"><a href="{{ item.doi }}" target="_blank">DOI ↗</a></div>{% endif %}
        </div>
        {% endfor %}
    </div>

    <div class="pub-section">
        <h2>📚 Book Chapters</h2>
        {% for item in site.data.publications.book_chapters %}
        <div class="pub-item">
            <div class="pub-title">{{ item.title }}</div>
            <div class="pub-authors">{{ item.authors }} ({{ item.year }})</div>
            <div class="pub-journal">In {{ item.editor }} (Ed.), {{ item.book }} — {{ item.publisher }}</div>
            {% if item.link and item.link != "" %}<div class="pub-doi"><a href="{{ item.link }}" target="_blank">Link ↗</a></div>{% endif %}
        </div>
        {% endfor %}
    </div>

    <div class="pub-section">
        <h2>🎤 Conferences &amp; Presentations</h2>
        {% for item in site.data.publications.conferences_presentations %}
        <div class="pub-item">
            <div class="pub-title">{{ item.title }}</div>
            <div class="pub-authors">{{ item.authors }} ({{ item.year }})</div>
            <div class="pub-journal">{{ item.event }}, {{ item.location }}</div>
            {% if item.link and item.link != "" %}<div class="pub-doi"><a href="{{ item.link }}" target="_blank">PDF ↗</a></div>{% endif %}
        </div>
        {% endfor %}
    </div>
</div>
