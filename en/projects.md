---
layout: default
title: Projects
permalink: /en/projects.html
lang: en
ref: projects
---

<div class="page-content">
    <div class="page-header">
        <h1>Projects</h1>
        <p class="lead">Methods for high-dimensional, noisy data, carried over from neuroscience to <strong>manufacturing, finance and language</strong>, with hands-on work from data pipelines and model evaluation to production operations. Public projects come with full code and analysis reports, and every project was built with the help of <strong>Claude Code</strong>.</p>
    </div>

    <div class="research-item">
        <h3>Citation-Grounded RAG System <span class="text-muted">/ Dissertation RAG Copilot</span></h3>
        <div class="research-meta">
            <span class="research-badge">RAG</span>
            <span class="research-badge">LLM Evaluation</span>
            <span class="research-badge">NLP</span>
        </div>
        <p>A RAG assistant with strict citation grounding for an academic literature corpus, with built-in measurement of the hallucination rate. <strong>Retrieval is the easy half</strong>: being able to measure the hallucination rate is what makes the system trustworthy.</p>
        <ul>
            <li>Prompt and context engineering: the generator uses an XML prompt that enforces citations, so every claim must carry a passage ID and a verbatim quote, or the model can only return a fixed refusal; the judge sees only the claim and the passages, not the generator's reasoning, to avoid self-endorsement. The judge prompt was revised version by version against errors measured on a validation set (v1 → v2 false-accept rate 27% → 4%). Later experiments were decided by the same standard: a generator prompt v2 improved trap questions but increased format errors on the 7B model, and judge prompts v4/v5 that added a classification step raised the false-accept rate, so neither was adopted. For 7–14B models, deterministic rule checks proved more reliable than ever-longer prompts.</li>
            <li>Hybrid retrieval (dense embeddings ⊕ BM25, fused with RRF): academic text is full of exact terms such as <code>ISFC</code> and <code>TFCE</code> that pure semantic vectors blur.</li>
            <li>Chunking ablation: section-aware chunking reached <strong>Hit@5 100% / MRR 0.952</strong> on a 26-question hand-built golden set, against 88% / 0.794 for fixed-length chunks.</li>
            <li>Verification layered from cheap to expensive: a verbatim quote must appear in the retrieved passage or the claim is marked fabricated; an LLM judge then rules on the claim; a separate rule check catches "planned work written up as results" and sends it to human review.</li>
            <li>The judge is validated too: models and prompts were compared on a known-answer set with deliberately planted errors, and phi4 was chosen (false-accept rate 5%, 95% CI 2–15%); a generator grading its own output was the weakest option.</li>
            <li>A claim-by-claim audit of system errors found that some misjudgments came from context rather than the model (passages missing section headings, quotes spanning passages); fixing them raised strict citation precision from 84% to <strong>97%</strong> (30/31). Every rate is reported with a Wilson confidence interval, noting that most differences at this sample size are not significant. No false claim has been shown to the user as "supported" so far.</li>
            <li>Runs fully offline (local Ollama) and also supports journal-PDF corpora.</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>RAG</li><li>Prompt Engineering</li><li>Context Engineering</li><li>Hybrid Search</li><li>ChromaDB</li><li>LLM-as-Judge</li><li>Hallucination Evaluation</li><li>Confidence Intervals</li><li>Ollama</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/paper-rag-copilot" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>Video Feature Extraction and Temporal Alignment <span class="text-muted">/ fMRI Video Feature Analysis</span></h3>
        <div class="research-meta">
            <span class="research-badge">Computer Vision</span>
            <span class="research-badge">Feature Engineering</span>
            <span class="research-badge">Time-Series</span>
        </div>
        <p>A quantitative comparison of low-level visual, temporal, semantic and object-level information in "nature" and "urban" naturalistic videos, extracting entropy and energy measures for every TR (0.752 s).</p>
        <ul>
            <li>Built a multi-level feature pipeline with OpenCV, HOG features and YOLOv8.</li>
            <li>Turned raw video into regressor time series that hold up to statistical testing, for use in fMRI analysis.</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>OpenCV</li><li>YOLOv8</li><li>HOG</li><li>Multimodal Time-Series</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/fmri-video-feature-analysis" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>Chinese Conversation Risk Triage <span class="text-muted">/ LINE Group Health Triage</span></h3>
        <div class="research-meta">
            <span class="research-badge">NLP</span>
            <span class="research-badge">Text Classification</span>
            <span class="research-badge">Digital Health</span>
        </div>
        <p>A health-triage system for LINE work groups that analyzes conversations, scores risk and produces a prioritized PDF report, turning unstructured Chinese chat logs into <strong>ranked, actionable risk signals</strong>.</p>
        <ul>
            <li>Six indicators: age of unanswered questions, customer response delay P90 (both in business hours), oldest unresolved issue (extracted by an LLM), share of negative sentiment, message volume, and a <strong>semantic-entropy time series</strong> that tracks topic complexity.</li>
            <li>Non-compensatory tripwires: escalation signals such as refunds, complaints or asking for a manager trigger directly and cannot be averaged away by other healthy indicators.</li>
            <li>Data sources: LINE chat exports, real-time LINE Messaging API webhooks, and Telegram group exports.</li>
            <li>Synthetic evaluation: 100 manager groups (2,667 messages) generated with programmatically planted ground truth (risks and decoys); a local LLM only rewrites them into colloquial Taiwanese Mandarin, so scoring is against the answer key rather than another AI's opinion. The rule system is strong on timing and phi4 on semantics; combined, risk-level accuracy is 80% (rules 48%, phi4 65%). The rule system was then tuned on a tuning set and the held-out set scored only once: <strong>94%</strong> risk-level accuracy on 50 held-out groups with zero false alarms on decoys. Thresholds were calibrated on synthetic data; the next step is re-validation on a fresh batch of groups.</li>
            <li>Stock-community mode (about 1.09 million Telegram messages): 165 hand-labeled messages validate the LLM's bullish/bearish labels, with LLM–human agreement of Cohen's κ up to 0.42 (random sample) / 0.55 (enriched sample); a ticker-entropy time series predicts topic shifts in the next window, AUC 0.62 → 0.71 (95% CI excludes 0). Along the way I caught a sample-size confound that explained most of an earlier AUC of 0.82.</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>Chinese NLP</li><li>Semantic Entropy</li><li>LLM Labeling</li><li>Synthetic Benchmark</li><li>Walk-Forward Validation</li><li>FastAPI</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/line-chat-triage" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="research-item">
        <h3>Conference Registration and Payment System <span class="text-muted">/ PACLIC 40 Registration</span></h3>
        <div class="research-meta">
            <span class="research-badge">Full-Stack Web</span>
            <span class="research-badge">Payment Integration</span>
            <span class="research-badge">Production Operations</span>
        </div>
        <p>The online registration and payment system for the 40th PACLIC (Pacific Asia Conference on Language, Information and Computation, held at National Taiwan University in December 2026), live since October 1, 2026. Built on an existing conference registration system with a team; I was responsible for backend features and production operations.</p>
        <ul>
            <li>Flow: Google sign-in → registration form → student-ID upload for students → card payment through NewebPay; organizers review student IDs and export attendee lists as CSV.</li>
            <li>Table-based pricing: the early-bird/regular gap in the new fee schedule differs across tiers, so no single discount formula fits; early-bird eligibility is set by payment completion time, and registration and payment close automatically at the deadline.</li>
            <li>Deliberate design: amounts are computed only on the backend from the registration contents, and any amount sent from the frontend is ignored; student-ID review is decoupled from payment so review never blocks it.</li>
            <li>Privacy: student IDs are deleted automatically after the conference according to the retention period.</li>
            <li>Deployment and operations: Docker Compose + Nginx, GitHub Actions CI, a production deploy that requires manual confirmation, daily encrypted database backups synced to the cloud, and restore drills.</li>
        </ul>
        <ul class="tag-list">
            <li>TypeScript</li><li>JavaScript</li><li>NestJS</li><li>Next.js</li><li>React</li><li>PostgreSQL</li><li>TypeORM</li><li>Zod</li><li>Docker</li><li>GitHub Actions</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://registration.linguistics.ntu.edu.tw" target="_blank" rel="noopener">Live site ↗</a>
        </p>
    </div>

    <div class="research-item">
        <h3>Semiconductor Quality and Yield Prediction <span class="text-muted">/ Semiconductor Quality ML</span></h3>
        <div class="research-meta">
            <span class="research-badge">Manufacturing</span>
            <span class="research-badge">Anomaly Detection</span>
            <span class="research-badge">Graph Neural Networks</span>
        </div>
        <p>Anomaly detection and yield prediction across three public manufacturing datasets: static snapshots (SECOM), process time series (PHM 2016 CMP) and production-route graphs (Bosch). The core argument: <strong>method choice should follow the structure of the data, not the trend</strong>.</p>
        <ul>
            <li>MSE 6.24 / MAE 1.82 on the official PHM CMP competition test set.</li>
            <li>Production-line graph analysis on Bosch located station L3_S32 with a failure rate <strong>7.8×</strong> the overall rate: graph structure helps attribution but not prediction.</li>
            <li>A time-ordered deployment simulation on SECOM compared four retraining strategies before go-live and quantified whether the data could support the decision (only 41 failures across 8 windows), avoiding retraining costs whose benefit cannot be verified.</li>
            <li>Diagnostics gate model selection: for example, the CMP virtual-metrology R² of 0.993 drops to 0.897 within the main MRR cluster, and a 1D-CNN that was best on validation was worst on test with a 49% spread across seeds, keeping gains that come from data distribution or overfitting out of deployment.</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>XGBoost</li><li>GNN</li><li>Concept Drift</li><li>Virtual Metrology</li><li>Imbalanced Classification</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/semiconductor-quality-ml" target="_blank" rel="noopener">GitHub</a>
            <a href="https://jamesleecy.github.io/semiconductor-quality-ml/" target="_blank" rel="noopener">Full analysis report</a>
        </p>
    </div>

    <div class="research-item">
        <h3>Precision-Weighted Multi-Agent Investment Research <span class="text-muted">/ Precision-Weighted Multi-Agent</span></h3>
        <div class="research-meta">
            <span class="research-badge">Multi-Agent LLM</span>
            <span class="research-badge">Quantitative Research</span>
            <span class="research-badge">Forward Validation</span>
        </div>
        <p>Borrows precision weighting from the <strong>predictive-processing framework</strong> in neuroscience: expert agents for financial statements, news, macro and fund flows, supply chain (knowledge graph) and technicals each produce a judgment with a confidence value, and an arbiter weights them dynamically by each agent's track record (the inverse of a Brier-score EMA). LLM reasoning can run on Claude or a local qwen3:8b.</p>
        <ul>
            <li>Survivorship-bias-free universe: 271 stocks, the top 100 by trading value each year including delisted names, for 8,475 walk-forward predictions over 2019–2026; financial statements carry a publication lag to rule out look-ahead.</li>
            <li><strong>Key finding:</strong> precision weighting only works if each source's accuracy can be estimated reliably; measured per-period IC has a standard deviation four times its mean, so estimation error is as large as the signal, and the system now centers on the consistently performing financial-statement agent. Benchmarked against 0050 on risk-adjusted returns, the stock-selection strategy's Sharpe has not yet beaten the market.</li>
            <li>Working signal: within-sector selection by the financial-statement agent (IC +0.029, t 2.16) is positive in both sub-periods and across all 21 sampling start points, and a sector-neutral long portfolio earns +0.26% per period after costs; the out-of-sample effect is smaller and is being confirmed by forward validation with frozen rules.</li>
            <li>Monthly revenue surprise (SUE): chosen from the Taiwan-market literature and aligned to filing deadlines, it is the first signal significant in both 2019–2022 and 2023–2026 (within-sector IC +0.032 / +0.059, t 2.0 / 2.9) and still works with entry delayed 1–10 days; mixed half-and-half with a 0050 timing position, its Sharpe beats 0050 in both periods. It is frozen as the second forward specification (fv2) and recorded automatically every month from October 13, 2026; adding earnings surprise or holding longer did not help.</li>
            <li>Overfitting control: rules were frozen on October 9, 2026 with the evaluation plan registered in advance; any change to the code fingerprint blocks predictions, and records are append-only. The formal forward record accumulates from November 2026. Windows Task Scheduler runs prediction and settlement unattended every month and rebuilds the research dashboard when new results arrive.</li>
        </ul>
        <ul class="tag-list">
            <li>Python</li><li>Multi-Agent</li><li>LLM</li><li>Walk-Forward Backtesting</li><li>Information Coefficient</li><li>Survivorship Bias</li><li>Deflated Sharpe</li><li>Brier Score</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://github.com/JamesLeeCY/precision-weighted-investment-agent" target="_blank" rel="noopener">GitHub</a>
            <a href="https://jamesleecy.github.io/precision-weighted-investment-agent/site/research-dashboard.html" target="_blank" rel="noopener">Research dashboard</a>
        </p>
    </div>

    <div class="pub-section" style="margin-top:40px">
        <h2>🎮 Side Projects</h2>
    </div>

    <div class="research-item">
        <h3>Taiwan Gold Volley <span class="text-muted">/ Browser Volleyball Game</span></h3>
        <div class="research-meta">
            <span class="research-badge">Web Game</span>
            <span class="research-badge">Real-Time Networking</span>
            <span class="research-badge">CI/CD</span>
        </div>
        <p>A client-only 2D volleyball game starring 16 Taiwanese animals, playable against the computer, two players on one device, or online, with an animal guide built on TaiCOL conservation data. It supports keyboard, touch and gamepad, and installs as a PWA for offline play.</p>
        <ul>
            <li>Deterministic physics engine with rollback netcode: both peers run the same engine, exchange only 1 byte of input per frame and reconcile with a state hash every 30 frames, connected peer to peer over WebRTC (PeerJS) with no backend.</li>
            <li>Automated quality gates: unit tests cover determinism, physics, rollback and key bindings, and Playwright end-to-end tests run on Chromium and WebKit; every push to main is built and deployed to GitHub Pages only after all tests pass.</li>
        </ul>
        <ul class="tag-list">
            <li>TypeScript</li><li>Vite</li><li>WebRTC</li><li>Rollback Netcode</li><li>PWA</li><li>Playwright</li><li>GitHub Actions</li><li>Claude Code</li>
        </ul>
        <p class="pub-doi" style="margin-top:14px">
            <a href="https://jamesleecy.github.io/beach-volley-duel/" target="_blank" rel="noopener">Play online</a>
            <a href="https://github.com/JamesLeeCY/beach-volley-duel" target="_blank" rel="noopener">GitHub</a>
        </p>
    </div>

    <div class="divider"></div>

    <p class="text-muted" style="text-align:center">
        More code and work in progress: <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">github.com/{{ site.github_username }}</a>
    </p>
</div>
