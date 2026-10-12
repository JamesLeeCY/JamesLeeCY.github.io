---
layout: default
title: Research
permalink: /en/research.html
lang: en
ref: research
---

<div class="page-content">
    <div class="page-header">
        <h1>Research</h1>
        <p class="lead">Ten years of neuroscience came down to one kind of problem: <strong>few samples, many dimensions, heavy noise and small effects</strong>. This page covers three research lines and the methods each one left me with. Results from carrying them over to manufacturing, finance and language data are on the <a href="{{ '/en/projects.html' | relative_url }}">Projects</a> page.</p>
    </div>

    <div class="research-item">
        <h3>🌿 Nature Exposure and Cognitive Aging</h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University &amp; Academia Sinica</span>
            <span class="research-badge">2021 – Present</span>
            <span class="research-badge">PhD Research</span>
        </div>
        <p><strong>Project:</strong> Neural mechanisms of forest environmental information and their use in mitigating cognitive aging</p>
        <ul>
            <li>Built virtual reality (VR) experiments in <strong>Python</strong> to measure how nature exposure benefits cognition in older adults.</li>
            <li>As a visiting scholar at Brandeis University, evaluated the cognitive effects of short-term nature exposure through video.</li>
            <li>Resampled raw video to the scanner's sampling period (TR = 0.752 s, 900 time points) and decomposed it into low-level visual, temporal, semantic and object-level feature series, aligned with the fMRI time series as testable regressors.</li>
            <li>Signal processing: motion energy from adjacent-frame differences, Shannon entropy for spatial and temporal unpredictability, sliding windows to track semantic change, and power spectral density (PSD) to compare the temporal-frequency structure of the two stimulus types.</li>
            <li>Presented at the Psychonomic Society Annual Meeting, New York (2024).</li>
        </ul>
        <p class="research-transfer"><strong>Transferable methods:</strong> signal processing and multimodal feature engineering (sampling alignment, differencing, entropy and spectral analysis) that turn unstructured signals into modelable time series. The same approach drives virtual metrology on <a href="https://github.com/JamesLeeCY/semiconductor-quality-ml" target="_blank" rel="noopener">CMP process sensor sequences</a> and the <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">topic-entropy time series for chat groups</a>, where entropy predicts topic shifts in the next window.</p>
        <ul class="tag-list">
            <li>Python</li><li>VR Experimental Design</li><li>Signal Processing</li><li>OpenCV</li><li>YOLOv8</li><li>Multimodal Time-Series</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/fmri-video-feature-analysis" target="_blank" rel="noopener">Related code ↗</a>
        </p>
    </div>

    <div class="research-item">
        <h3>🌐 Culture, Value, and Decision Making</h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University</span>
            <span class="research-badge">2019 – 2021</span>
            <span class="research-badge">Research Assistant</span>
        </div>
        <p><strong>Project:</strong> Cultural influences on learning and decision making (a Taiwan–U.S. cross-national study)</p>
        <ul>
            <li>Designed a cross-national experiment workflow in <strong>Python</strong> that runs in sync at both sites.</li>
            <li>Built a database with <strong>Shell</strong> and <strong>SQL</strong> to make cross-server data sharing and version control possible.</li>
            <li>Validated and calibrated cross-site multiband fMRI signals: the same participants repeated visual and motor tasks on the same model of 3T scanner in Taiwan and the U.S., and ANOVA separated participant, task and site effects. Without first correcting systematic differences between scanner sites, no later group comparison holds up.</li>
            <li>Publications: <em>Biological Psychology</em> (2021); a chapter in <em>Clinical Cultural Neuroscience</em> (Oxford University Press, 2019); Cognitive Neuroscience Society Annual Meeting, Virtual (2020).</li>
        </ul>
        <p class="research-transfer"><strong>Transferable methods:</strong> cross-site data integration with batch-effect correction, plus data pipelines and QC workflows: the same problem as integrating data across fabs, tools or sources. Studying how people decide under probability and value carries straight into the <a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">multi-agent investment research system</a>, where every judgment is a probability evaluated with Brier scores and calibration curves, not just right or wrong.</p>
        <ul class="tag-list">
            <li>Python</li><li>Shell</li><li>SQL</li><li>fMRI Signal Calibration</li><li>Cross-Site Data Integration</li><li>Data QC Pipelines</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://doi.org/10.1016/j.biopsycho.2021.108209" target="_blank" rel="noopener">DOI ↗</a>
        </p>
    </div>

    <div class="research-item">
        <h3>🧩 ADHD and Neuroimaging</h3>
        <div class="research-meta">
            <span class="research-badge">National Taiwan University</span>
            <span class="research-badge">2015 – 2018</span>
            <span class="research-badge">Master's Research</span>
        </div>
        <p><strong>Project:</strong> Differential neural processing of value during decision making in adults with ADHD and healthy controls</p>
        <ul>
            <li>Led the team through recruitment of participants with ADHD and MRI scan scheduling.</li>
            <li>Developed automated pipelines in <strong>MATLAB</strong> and <strong>R</strong> to process and analyze behavioral and fMRI data.</li>
            <li>Publication: <em>Journal of Psychiatry and Neuroscience</em> (2023).</li>
        </ul>
        <p class="research-transfer"><strong>Transferable methods:</strong> statistical modeling and multiple-comparison correction with small, high-dimensional, imbalanced samples, and end-to-end automated analysis pipelines. These became habits in every later project: every rate in the <a href="https://github.com/JamesLeeCY/paper-rag-copilot" target="_blank" rel="noopener">RAG system</a> carries a confidence interval, the <a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">quant backtests</a> use a Deflated Sharpe that accounts for the number of trials, and <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">conversation forecasting</a> uses a block bootstrap to estimate the uncertainty of its gains.</p>
        <ul class="tag-list">
            <li>MATLAB</li><li>R</li><li>Statistical Modeling</li><li>Experimental Design</li><li>Pipeline Development</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://doi.org/10.1503/jpn.220123" target="_blank" rel="noopener">DOI ↗</a>
        </p>
    </div>

    <div class="divider"></div>

    <p class="text-muted" style="text-align:center">
        The full list is on the <a href="{{ '/en/publications.html' | relative_url }}">Publications</a> page; results from applying these methods to industry data are on the <a href="{{ '/en/projects.html' | relative_url }}">Projects</a> page.
    </p>
</div>
