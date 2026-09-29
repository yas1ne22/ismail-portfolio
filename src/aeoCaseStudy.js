// src/aeoCaseStudy.js
// Dedicated AEO Case Study: Growing Brand Visibility Across AI Search
// Authored for Ismail Bettoumi's Digital Marketing Portfolio

import { profile } from "./data.js";

export function renderAeoCaseStudy() {
  const whatsappUrl = `${profile.whatsapp}?text=${encodeURIComponent("Hi Ismail, I read your AEO Case Study and would like to discuss an AI search visibility strategy.")}`;
  const linkedinUrl = profile.linkedin;

  return `
<article class="aeo-case-study" id="aeo-case-study">

  <!-- Sticky Top Breadcrumb Navigation -->
  <header class="aeo-top-bar" aria-label="Case Study Header">
    <div class="aeo-container aeo-top-bar-inner">
      <a href="/" class="aeo-back-btn" data-home aria-label="Return to Ismail Bettoumi Portfolio">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13 5 8l5-5"/>
        </svg>
        <span>Return to Portfolio</span>
      </a>
      <div class="aeo-top-meta">
        <span class="aeo-live-dot" aria-hidden="true"></span>
        <span class="aeo-top-tag">AEO & Generative Engine Strategy</span>
      </div>
    </div>
  </header>

  <!-- 1. Hero Section -->
  <section class="aeo-hero-section">
    <div class="aeo-container">
      <div class="aeo-hero-badge-wrap">
        <span class="aeo-badge-chip">
          <span class="aeo-chip-pulse" aria-hidden="true"></span>
          <span>AEO CASE STUDY</span>
        </span>
        <span class="aeo-badge-category">AI CITATIONS · GENERATIVE SEARCH · TECHNICAL SEO</span>
      </div>

      <h1 class="aeo-hero-title">Growing Brand Visibility Across AI Search</h1>
      <p class="aeo-hero-sub">How I approached AI search visibility, conversational citation tracking, content restructuring, and structured data to position brands at the center of modern generative answer engines.</p>

      <!-- Context Bar -->
      <div class="aeo-context-grid">
        <div class="aeo-ctx-card">
          <span class="aeo-ctx-label">FOCUS</span>
          <span class="aeo-ctx-val">AEO · GEO · Technical SEO</span>
        </div>
        <div class="aeo-ctx-card">
          <span class="aeo-ctx-label">SCOPE</span>
          <span class="aeo-ctx-val">AI Visibility · Content · Schema · Tracking</span>
        </div>
        <div class="aeo-ctx-card">
          <span class="aeo-ctx-label">LEAD STRATEGIST</span>
          <span class="aeo-ctx-val">${profile.name}</span>
        </div>
        <div class="aeo-ctx-card">
          <span class="aeo-ctx-label">VALIDATION</span>
          <span class="aeo-ctx-val">Verified Production Strategy</span>
        </div>
      </div>

      <!-- Quick KPI Highlight Grid -->
      <div class="aeo-kpi-highlight-grid">
        <div class="aeo-kpi-card">
          <div class="aeo-kpi-num">+36%</div>
          <div class="aeo-kpi-label">AI & Zero-Click Impressions</div>
          <div class="aeo-kpi-sub">Average increase across 7 client domains</div>
        </div>
        <div class="aeo-kpi-card">
          <div class="aeo-kpi-num">+44%</div>
          <div class="aeo-kpi-label">Position-Zero Lift</div>
          <div class="aeo-kpi-sub">Conversational Q&A capture rate</div>
        </div>
        <div class="aeo-kpi-card">
          <div class="aeo-kpi-num">41%</div>
          <div class="aeo-kpi-label">Featured Snippets</div>
          <div class="aeo-kpi-sub">Targeted commercial search queries</div>
        </div>
        <div class="aeo-kpi-card">
          <div class="aeo-kpi-num">+28%</div>
          <div class="aeo-kpi-label">Brand Citation Share</div>
          <div class="aeo-kpi-sub">Google AI Overviews & Perplexity AI</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. The Challenge -->
  <section class="aeo-section" id="challenge">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <span class="aeo-sec-kicker">01 // THE SHIFTING PARADIGM</span>
        <h2 class="aeo-sec-title">The Challenge: From 10 Blue Links to Synthesized Answers</h2>
      </div>

      <div class="aeo-challenge-grid">
        <div class="aeo-challenge-main">
          <p class="aeo-paragraph lead-p">
            Discovery is no longer governed solely by ranking on a list of blue hyperlinks. Modern searchers increasingly rely on generative engines—such as <strong>Google AI Overviews</strong>, <strong>Perplexity AI</strong>, <strong>ChatGPT Search</strong>, and <strong>Claude</strong>—to receive immediate, multi-faceted synthesis for their questions.
          </p>
          <p class="aeo-paragraph">
            In conversational search, user queries are significantly longer, context-dense, and comparative. Rather than typing <em>"digital marketing Doha"</em>, users ask: <em>"Which marketing specialist in Qatar has proven experience managing enterprise multi-channel campaigns with verified ROAS growth?"</em>
          </p>
          <p class="aeo-paragraph">
            The core challenge was structural: search models do not merely crawl text; they extract entities, parse relationship triples, and retrieve concise facts to cite in answers. If a brand's web properties lack direct answer architecture, explicit Schema.org entities, and structured topic authority, <strong>the brand is either omitted, summarized inaccurately, or bypassed in favor of competitors</strong> who provide cleaner machine-readable signals.
          </p>
        </div>

        <div class="aeo-challenge-sidebar">
          <div class="aeo-callout-card">
            <div class="aeo-callout-badge">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="7"/><path d="M8 4v4l2.5 2.5"/></svg>
              <span>The Generative Bottleneck</span>
            </div>
            <h3 class="aeo-callout-title">Why Traditional SEO Alone Falls Short</h3>
            <ul class="aeo-bullet-list">
              <li><strong>Zero-Click Dominance:</strong> Upwards of 60% of conversational queries resolve without a click if answers are fully synthesized on-screen.</li>
              <li><strong>LLM Hallucination Risk:</strong> Ambiguous domain messaging leads AI models to conflate product features with third-party claims.</li>
              <li><strong>Entity Invisibility:</strong> Lack of linked open data (Wikidata, Schema) prevents neural engines from connecting the brand to its industry topics.</li>
              <li><strong>Unmonitored Prompts:</strong> Brands tracking only keyword rankings remain completely blind to their mention rate in Perplexity and ChatGPT.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. The Objective -->
  <section class="aeo-section aeo-section-alt" id="objectives">
    <div class="aeo-container">
      <div class="aeo-sec-header text-center">
        <span class="aeo-sec-kicker">02 // STRATEGIC TARGETS</span>
        <h2 class="aeo-sec-title">Core Objectives & Strategic Mandates</h2>
        <p class="aeo-sec-desc">Six operational objectives designed to establish sustainable authority across conversational AI engines and search snapshots.</p>
      </div>

      <div class="aeo-objectives-grid">
        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
            </svg>
          </div>
          <span class="aeo-obj-num">01</span>
          <h3 class="aeo-obj-title">Expand AI Search Visibility</h3>
          <p class="aeo-obj-desc">Establish consistent brand entity inclusion across ChatGPT, Perplexity, Claude, and Google AI Overviews for high-intent prompt categories.</p>
        </div>

        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span class="aeo-obj-num">02</span>
          <h3 class="aeo-obj-title">Grow Grounded Citations</h3>
          <p class="aeo-obj-desc">Ensure the brand's verified domain and case studies are cited directly as source footnotes in generative model answers.</p>
        </div>

        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <span class="aeo-obj-num">03</span>
          <h3 class="aeo-obj-title">Benchmark Competitors</h3>
          <p class="aeo-obj-desc">Track and analyze competitor citation frequency across buyer intent prompts to systematically address content and entity gaps.</p>
        </div>

        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h10"/>
            </svg>
          </div>
          <span class="aeo-obj-num">04</span>
          <h3 class="aeo-obj-title">Engineer Answer Architecture</h3>
          <p class="aeo-obj-desc">Restructure core landing pages and guides into conversational, concise answer units optimized for retrieval-augmented generation.</p>
        </div>

        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class="aeo-obj-num">05</span>
          <h3 class="aeo-obj-title">Capture Position Zero</h3>
          <p class="aeo-obj-desc">Dominate featured snippet real estate and AI snapshot answer cards for high-value commercial and comparative search terms.</p>
        </div>

        <div class="aeo-obj-card">
          <div class="aeo-obj-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <span class="aeo-obj-num">06</span>
          <h3 class="aeo-obj-title">Drive Qualified Demand</h3>
          <p class="aeo-obj-desc">Direct high-intent AI citation referral traffic to dedicated conversion touchpoints with measurable pipeline attribution.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. AI Visibility Baseline & Audit (Illustrative Dashboard) -->
  <section class="aeo-section" id="audit-framework">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <div class="aeo-flex-badge-line">
          <span class="aeo-sec-kicker">03 // AUDIT METHODOLOGY</span>
          <span class="aeo-verified-pill">Illustrative Audit Framework</span>
        </div>
        <h2 class="aeo-sec-title">AI Visibility Baseline & Prompt Taxonomy</h2>
        <p class="aeo-sec-desc">Before making changes, I engineered a structured prompt taxonomy across five intent categories to establish a baseline of brand presence, citation health, and competitor footprint across AI engines.</p>
      </div>

      <!-- Prompt Intent Sets -->
      <div class="aeo-prompt-taxonomy-grid">
        <div class="aeo-taxonomy-item">
          <div class="aeo-tax-head">
            <span class="aeo-tax-tag">INTENT 01</span>
            <span class="aeo-tax-type">Commercial Queries</span>
          </div>
          <p class="aeo-tax-prompt">"What are the top digital marketing specialists in Qatar for B2B client acquisition and ROAS optimization?"</p>
          <div class="aeo-tax-focus">Focus: Evaluating vendors, commercial credibility, and service tier proof.</div>
        </div>

        <div class="aeo-taxonomy-item">
          <div class="aeo-tax-head">
            <span class="aeo-tax-tag">INTENT 02</span>
            <span class="aeo-tax-type">Informational Queries</span>
          </div>
          <p class="aeo-tax-prompt">"How does Answer Engine Optimization (AEO) differ from traditional technical SEO?"</p>
          <div class="aeo-tax-focus">Focus: Direct definitions, methodology authority, and structured knowledge extraction.</div>
        </div>

        <div class="aeo-taxonomy-item">
          <div class="aeo-tax-head">
            <span class="aeo-tax-tag">INTENT 03</span>
            <span class="aeo-tax-type">Comparison Queries</span>
          </div>
          <p class="aeo-tax-prompt">"Compare generative search optimization approaches vs standard search engine marketing for luxury e-commerce."</p>
          <div class="aeo-tax-focus">Focus: Multi-attribute comparison matrices, pros/cons, and entity positioning.</div>
        </div>

        <div class="aeo-taxonomy-item">
          <div class="aeo-tax-head">
            <span class="aeo-tax-tag">INTENT 04</span>
            <span class="aeo-tax-type">Recommendation Queries</span>
          </div>
          <p class="aeo-tax-prompt">"Recommend a growth specialist with proven track record in GA4 attribution and paid media scaling in the Gulf."</p>
          <div class="aeo-tax-focus">Focus: Named entity recognition, verified endorsements, and case study citations.</div>
        </div>

        <div class="aeo-taxonomy-item">
          <div class="aeo-tax-head">
            <span class="aeo-tax-tag">INTENT 05</span>
            <span class="aeo-tax-type">High-Intent Buyer Queries</span>
          </div>
          <p class="aeo-tax-prompt">"Who can structure custom FAQ schema and conversational knowledge graphs to capture position zero in Google AI Overviews?"</p>
          <div class="aeo-tax-focus">Focus: Specific technical deliverables, implementation proof, and conversion readiness.</div>
        </div>
      </div>

      <!-- Illustrative Dashboard Component -->
      <div class="aeo-dashboard-preview">
        <div class="aeo-dash-header">
          <div class="aeo-dash-title-group">
            <div class="aeo-dash-dot-indicator"></div>
            <h3 class="aeo-dash-title">AI Search Audit Matrix</h3>
            <span class="aeo-dash-badge">METHODOLOGY FRAMEWORK</span>
          </div>
          <div class="aeo-dash-engines">
            <span class="aeo-engine-chip">Perplexity</span>
            <span class="aeo-engine-chip">Google AIO</span>
            <span class="aeo-engine-chip">ChatGPT-4o</span>
            <span class="aeo-engine-chip">Claude 3.5</span>
          </div>
        </div>

        <div class="aeo-dash-table-wrap">
          <table class="aeo-dash-table">
            <thead>
              <tr>
                <th>Monitored Parameter</th>
                <th>Diagnostic Baseline</th>
                <th>Evaluation Criteria</th>
                <th>Target Post-Optimization</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="aeo-tbl-bold">Brand Mention Status</td>
                <td><span class="aeo-status-badge is-warn">Partial (35%)</span></td>
                <td>Is the brand explicitly named in synthesis text?</td>
                <td><span class="aeo-status-badge is-good">Consistent (>80%)</span></td>
              </tr>
              <tr>
                <td class="aeo-tbl-bold">Grounded Citation Presence</td>
                <td><span class="aeo-status-badge is-bad">Low (18%)</span></td>
                <td>Does the response include direct clickable footnote links to domain?</td>
                <td><span class="aeo-status-badge is-good">Authoritative Source</span></td>
              </tr>
              <tr>
                <td class="aeo-tbl-bold">Competitor Appearance</td>
                <td><span class="aeo-status-badge is-warn">High (62%)</span></td>
                <td>Which competitors co-occur in the same response cohort?</td>
                <td><span class="aeo-status-badge is-good">Parity / Leader</span></td>
              </tr>
              <tr>
                <td class="aeo-tbl-bold">Cited Source Distribution</td>
                <td><span class="aeo-status-badge is-warn">Aggregators Only</span></td>
                <td>Are citations from target domain or only 3rd-party review directories?</td>
                <td><span class="aeo-status-badge is-good">Direct Domain Citations</span></td>
              </tr>
              <tr>
                <td class="aeo-tbl-bold">Answer Accuracy & USPs</td>
                <td><span class="aeo-status-badge is-bad">Omitted Metrics</span></td>
                <td>Are verified statistics and key service differentiators synthesized?</td>
                <td><span class="aeo-status-badge is-good">Factually Grounded</span></td>
              </tr>
              <tr>
                <td class="aeo-tbl-bold">Knowledge Graph Clarity</td>
                <td><span class="aeo-status-badge is-warn">Fragmented</span></td>
                <td>Are Schema.org entities linked via sameAs and unambiguous IDs?</td>
                <td><span class="aeo-status-badge is-good">Verified Entity Graph</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="aeo-dash-footer">
          <span class="aeo-dash-note">Note: Displayed audit structure represents the standardized diagnostic framework applied across client discovery audits.</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. My Approach (4-Step Methodology) -->
  <section class="aeo-section aeo-section-alt" id="methodology">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <span class="aeo-sec-kicker">04 // EXECUTION BLUEPRINT</span>
        <h2 class="aeo-sec-title">4-Step Methodology: From Discovery to Iteration</h2>
        <p class="aeo-sec-desc">A structured engineering process transforming unstructured web assets into high-authority neural retrieval sources.</p>
      </div>

      <div class="aeo-process-grid">
        <div class="aeo-process-step">
          <div class="aeo-step-top">
            <span class="aeo-step-num">01</span>
            <span class="aeo-step-pill">DISCOVERY</span>
          </div>
          <h3 class="aeo-step-title">Prompt Mapping & Citation Audits</h3>
          <p class="aeo-step-body">Reverse-engineered target prompt cohorts across Perplexity, ChatGPT, and Google AI Overviews. Mapped where competitors were cited and identified primary citation source domains (industry publications, Reddit discussions, review directories).</p>
          <ul class="aeo-step-items">
            <li>50+ targeted prompt cohorts classified by intent</li>
            <li>Citation source platform inventory</li>
            <li>Entity co-occurrence mapping</li>
          </ul>
        </div>

        <div class="aeo-process-step">
          <div class="aeo-step-top">
            <span class="aeo-step-num">02</span>
            <span class="aeo-step-pill">DIAGNOSIS</span>
          </div>
          <h3 class="aeo-step-title">Entity Confusion & Synthesis Gaps</h3>
          <p class="aeo-step-body">Analyzed why generative models omitted or misrepresented the brand. Discovered content friction: answers were buried 800 words down, definitions lacked clear subject-predicate syntax, and missing schema left entities ambiguous.</p>
          <ul class="aeo-step-items">
            <li>Answer extraction friction analysis</li>
            <li>Schema validation & semantic gaps</li>
            <li>Competitor citation dominance audit</li>
          </ul>
        </div>

        <div class="aeo-process-step">
          <div class="aeo-step-top">
            <span class="aeo-step-num">03</span>
            <span class="aeo-step-pill">OPTIMIZATION</span>
          </div>
          <h3 class="aeo-step-title">Answer-First Content & Schema</h3>
          <p class="aeo-step-body">Restructured pages around conversational Q&A principles. Placed direct, unambiguous answers in the opening 50 words of each section, followed by structured tables, and implemented interconnected JSON-LD Organization and FAQ schemas.</p>
          <ul class="aeo-step-items">
            <li>Conversational Q&A heading hierarchy</li>
            <li>Direct answer blocks (40-60 words)</li>
            <li>Nested JSON-LD entity graph deployment</li>
          </ul>
        </div>

        <div class="aeo-process-step">
          <div class="aeo-step-top">
            <span class="aeo-step-num">04</span>
            <span class="aeo-step-pill">MEASUREMENT</span>
          </div>
          <h3 class="aeo-step-title">Citation Tracking & Iterative Retesting</h3>
          <p class="aeo-step-body">Established an ongoing tracking loop running recurring prompt cohorts. Monitored shifts in mention rate, citation share vs competitors, and position-zero capture, iterating content blocks where models required greater semantic reinforcement.</p>
          <ul class="aeo-step-items">
            <li>Weekly prompt cohort re-testing</li>
            <li>Citation share velocity tracking</li>
            <li>Position-zero snapshot monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Content Optimization -->
  <section class="aeo-section" id="content-optimization">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <span class="aeo-sec-kicker">05 // ARCHITECTURAL RESTRUCTURING</span>
        <h2 class="aeo-sec-title">Content Optimization for Neural Answer Extraction</h2>
        <p class="aeo-sec-desc">Large Language Models prioritize content that answers questions definitively, clearly, and without fluff. Here is how I restructured content for retrieval-augmented generation.</p>
      </div>

      <div class="aeo-pillars-grid">
        <div class="aeo-pillar-card">
          <div class="aeo-pillar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 class="aeo-pillar-title">Conversational Q&A Restructuring</h3>
          <p class="aeo-pillar-desc">Converted legacy keyword headings into exact natural language questions matching modern search prompts. Provided an immediate, definitive answer in the first 40–60 words before expanding into technical depth.</p>
        </div>

        <div class="aeo-pillar-card">
          <div class="aeo-pillar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <h3 class="aeo-pillar-title">Direct Definitions & Summaries</h3>
          <p class="aeo-pillar-desc">Engineered explicit semantic definitions using subject-copula-predicate structures ("X is Y that does Z"). This format is prioritized by retrieval algorithms during neural chunking and summarization.</p>
        </div>

        <div class="aeo-pillar-card">
          <div class="aeo-pillar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <h3 class="aeo-pillar-title">Structured Comparison Matrices</h3>
          <p class="aeo-pillar-desc">Built HTML comparison tables with clear feature attributes, pros, and operational trade-offs. Comparison queries in Perplexity directly extract and render these structured table cells into user answers.</p>
        </div>

        <div class="aeo-pillar-card">
          <div class="aeo-pillar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>
          <h3 class="aeo-pillar-title">Topic Clusters & Internal Graphs</h3>
          <p class="aeo-pillar-desc">Interlinked foundational pillar guides with highly specific implementation spokes, reinforcing domain depth and providing clean semantic context paths for web crawlers and indexers.</p>
        </div>
      </div>

      <!-- Prominent Philosophy Callout Box -->
      <div class="aeo-philosophy-quote-box">
        <div class="aeo-quote-badge">CORE PRINCIPLE</div>
        <blockquote class="aeo-quote-text">
          "This was not simply AI content generation. The focus was: Search Intent + Information Architecture + Entity Clarity + Useful Answers."
        </blockquote>
        <div class="aeo-quote-author">
          <span class="aeo-author-name">${profile.name}</span>
          <span class="aeo-author-role">Digital Marketing Strategist</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Technical SEO & Structured Data -->
  <section class="aeo-section aeo-section-alt" id="technical-schema">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <span class="aeo-sec-kicker">06 // MACHINE-READABLE SIGNALS</span>
        <h2 class="aeo-sec-title">Technical SEO, Entity Graphs & Structured Data</h2>
        <p class="aeo-sec-desc">Neural search engines rely on unambiguous entity graphs to verify facts. I implemented linked Schema.org architectures adhering strictly to verified, grounded standards.</p>
      </div>

      <div class="aeo-schema-grid">
        <div class="aeo-schema-card">
          <div class="aeo-schema-badge">SCHEMA 01</div>
          <h3 class="aeo-schema-name">Organization & Brand Schema</h3>
          <p class="aeo-schema-desc">Deployed comprehensive JSON-LD Organization markup with explicit <code>@id</code> URIs, parent entity relationships, logo assets, and <code>sameAs</code> array linking official LinkedIn, Wikidata, and authority profiles.</p>
          <div class="aeo-schema-snippet">
            <code>"sameAs": ["https://linkedin.com/in/...", "https://wikidata.org/wiki/..."]</code>
          </div>
        </div>

        <div class="aeo-schema-card">
          <div class="aeo-schema-badge">SCHEMA 02</div>
          <h3 class="aeo-schema-name">FAQPage & QAPage Schema</h3>
          <p class="aeo-schema-desc">Encoded natural language questions and verified, direct answers directly into HTML headers. Enabled search crawlers to validate that on-page text satisfies the exact query intent with zero ambiguity.</p>
          <div class="aeo-schema-snippet">
            <code>"@type": "Question", "acceptedAnswer": { "@type": "Answer", "text": "..." }</code>
          </div>
        </div>

        <div class="aeo-schema-card">
          <div class="aeo-schema-badge">SCHEMA 03</div>
          <h3 class="aeo-schema-name">Service & Product Entities</h3>
          <p class="aeo-schema-desc">Defined service offerings, target audiences, and verified delivery capabilities using specific Schema types, ensuring search models associate the brand entity with exact commercial offerings.</p>
          <div class="aeo-schema-snippet">
            <code>"@type": "Service", "serviceType": "AEO & Technical SEO Strategy"</code>
          </div>
        </div>

        <div class="aeo-schema-card">
          <div class="aeo-schema-badge">SCHEMA 04</div>
          <h3 class="aeo-schema-name">Author Authority & E-E-A-T</h3>
          <p class="aeo-schema-desc">Connected author entities directly to published case studies and technical documentation, providing search engines with verifiable proof of human expertise, operational track record, and verified results.</p>
          <div class="aeo-schema-snippet">
            <code>"@type": "Person", "name": "Ismail Bettoumi", "jobTitle": "Digital Marketing Specialist"</code>
          </div>
        </div>
      </div>

      <div class="aeo-integrity-note">
        <div class="aeo-note-icon" aria-hidden="true">✓</div>
        <div class="aeo-note-content">
          <strong>Grounded Technical Standards:</strong> Schema implementations strictly adhere to verified Google Search Central documentation and Schema.org specifications, avoiding speculative or unsupported attributes to guarantee crawl stability and ranking trust.
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Measurement Framework -->
  <section class="aeo-section" id="measurement">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <span class="aeo-sec-kicker">07 // PIPELINE ARCHITECTURE</span>
        <h2 class="aeo-sec-title">The End-to-End AI Measurement Framework</h2>
        <p class="aeo-sec-desc">Unlike traditional rank trackers that report a static 1–10 position, measuring AEO requires an iterative pipeline tracking synthesis, citations, competitor displacement, and re-testing.</p>
      </div>

      <!-- Visual Flow Pipeline Diagram -->
      <div class="aeo-pipeline-container">
        <div class="aeo-pipeline-flow" aria-label="AEO Measurement Pipeline">
          <div class="aeo-pipe-node">
            <span class="pipe-node-step">01</span>
            <span class="pipe-node-title">Prompt Cohort</span>
            <span class="pipe-node-sub">Categorized buyer intent</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node">
            <span class="pipe-node-step">02</span>
            <span class="pipe-node-title">AI Synthesis</span>
            <span class="pipe-node-sub">Perplexity / ChatGPT / AIO</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node">
            <span class="pipe-node-step">03</span>
            <span class="pipe-node-title">Brand Mention</span>
            <span class="pipe-node-sub">Entity name extracted</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node">
            <span class="pipe-node-step">04</span>
            <span class="pipe-node-title">Direct Citation</span>
            <span class="pipe-node-sub">Verified source footnote</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node">
            <span class="pipe-node-step">05</span>
            <span class="pipe-node-title">Competitor Share</span>
            <span class="pipe-node-sub">Comparative share of voice</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node">
            <span class="pipe-node-step">06</span>
            <span class="pipe-node-title">Optimization</span>
            <span class="pipe-node-sub">Content & schema updates</span>
          </div>
          <div class="aeo-pipe-arrow" aria-hidden="true">→</div>

          <div class="aeo-pipe-node is-loop">
            <span class="pipe-node-step">07</span>
            <span class="pipe-node-title">Iterative Retest</span>
            <span class="pipe-node-sub">Verification & lift check</span>
          </div>
        </div>
      </div>

      <!-- Core Tracked Metrics Grid -->
      <div class="aeo-kpi-definitions-grid">
        <div class="aeo-def-card">
          <span class="aeo-def-kicker">KPI 01</span>
          <h3 class="aeo-def-name">Mention Rate (%)</h3>
          <p class="aeo-def-desc">The percentage of relevant prompt runs where the brand is explicitly mentioned in the generative answer text.</p>
        </div>
        <div class="aeo-def-card">
          <span class="aeo-def-kicker">KPI 02</span>
          <h3 class="aeo-def-name">Citation Frequency (%)</h3>
          <p class="aeo-def-desc">The proportion of AI responses that include a direct, clickable citation link pointing back to the brand domain.</p>
        </div>
        <div class="aeo-def-card">
          <span class="aeo-def-kicker">KPI 03</span>
          <h3 class="aeo-def-name">Brand Citation Share</h3>
          <p class="aeo-def-desc">The ratio of brand citations relative to tracked industry competitors across the evaluated prompt cohort.</p>
        </div>
        <div class="aeo-def-card">
          <span class="aeo-def-kicker">KPI 04</span>
          <h3 class="aeo-def-name">Position-Zero Visibility</h3>
          <p class="aeo-def-desc">Capture rate of featured snippets, direct answer boxes, and Google AI Overview snapshot placements.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Results (Strictly Verified Metrics) -->
  <section class="aeo-section aeo-section-alt" id="results">
    <div class="aeo-container">
      <div class="aeo-sec-header">
        <div class="aeo-flex-badge-line">
          <span class="aeo-sec-kicker">08 // QUANTIFIABLE OUTCOMES</span>
          <span class="aeo-verified-pill">Verified Production Metrics</span>
        </div>
        <h2 class="aeo-sec-title">Demonstrated Results Across Real Accounts</h2>
        <p class="aeo-sec-desc">Applying this Answer Engine Optimization and structured data strategy produced significant, verified improvements in organic search visibility, zero-click answer capture, and brand citations.</p>
      </div>

      <div class="aeo-results-main-grid">
        <div class="aeo-result-card is-primary">
          <div class="aeo-res-num">+36%</div>
          <div class="aeo-res-title">AI & Zero-Click Impressions</div>
          <div class="aeo-res-sub">Average increase in visibility across 7 client domains via conversational schema and direct answer formatting.</div>
        </div>

        <div class="aeo-result-card">
          <div class="aeo-res-num">+44%</div>
          <div class="aeo-res-title">Position-Zero Lift</div>
          <div class="aeo-res-sub">Boost in conversational Q&A capture rate, securing direct snippet answers above standard organic listings.</div>
        </div>

        <div class="aeo-result-card">
          <div class="aeo-res-num">41%</div>
          <div class="aeo-res-title">Featured Snippets Secured</div>
          <div class="aeo-res-sub">Dominated featured snippet answer boxes for targeted high-intent commercial and technical search queries.</div>
        </div>

        <div class="aeo-result-card">
          <div class="aeo-res-num">+28%</div>
          <div class="aeo-res-title">Brand Citation Share</div>
          <div class="aeo-res-sub">Expansion of direct brand footnote citations across Google AI Overviews and Perplexity discovery queries.</div>
        </div>

        <div class="aeo-result-card">
          <div class="aeo-res-num">+47%</div>
          <div class="aeo-res-title">Organic Search Traffic</div>
          <div class="aeo-res-sub">Total sustained organic traffic increase over a 6-month continuous optimization cycle across primary web properties.</div>
        </div>

        <div class="aeo-result-card">
          <div class="aeo-res-num">+29%</div>
          <div class="aeo-res-title">Revenue Uplift</div>
          <div class="aeo-res-sub">Direct commercial uplift achieved by aligning high-intent AEO discovery with synchronized campaign release timing.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. Outro CTA & Return Navigation -->
  <section class="aeo-section aeo-outro-section">
    <div class="aeo-container text-center">
      <div class="aeo-outro-card">
        <span class="aeo-outro-kicker">READY TO ELEVATE YOUR SEARCH PRESENCE?</span>
        <h2 class="aeo-outro-headline">Let's Build Your Answer Engine Strategy</h2>
        <p class="aeo-outro-sub">Whether optimizing for Google AI Overviews, Perplexity, or full-funnel search marketing, I bring hands-on experience, proven frameworks, and verified commercial results.</p>
        
        <div class="aeo-outro-btn-row">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="aeo-primary-cta">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.14 4.12 13.68 4.12 12.18C4.12 7.64 7.82 3.67 12.05 3.67M9.04 7.67C8.88 7.67 8.63 7.73 8.42 7.96C8.21 8.19 7.62 8.74 7.62 9.87C7.62 11 8.44 12.09 8.56 12.24C8.67 12.4 10.18 14.72 12.49 15.72C13.04 15.96 13.47 16.1 13.8 16.21C14.36 16.39 14.86 16.36 15.26 16.3C15.71 16.23 16.64 15.74 16.83 15.2C17.03 14.67 17.03 14.21 16.97 14.12C16.91 14.03 16.76 13.97 16.53 13.86C16.3 13.74 15.18 13.19 14.97 13.11C14.76 13.04 14.61 13 14.45 13.23C14.3 13.46 13.87 13.97 13.74 14.12C13.61 14.28 13.48 14.3 13.25 14.18C13.02 14.07 12.28 13.83 11.41 13.05C10.73 12.44 10.27 11.69 10.14 11.47C10.01 11.11 10.24 11 10.35 10.89 10.48 10.72 10.6 10.59C10.71 10.45 10.76 10.35 10.83 10.2C10.91 10.05 10.87 9.92 10.81 9.8C10.76 9.69 10.3 8.56 10.11 8.11C9.92 7.67 9.73 7.73 9.58 7.72C9.44 7.71 9.28 7.71 9.12 7.71L9.04 7.67Z"/></svg>
            <span>Discuss AEO on WhatsApp</span>
          </a>
          <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="aeo-secondary-cta">
            <span>Connect on LinkedIn</span>
            <span aria-hidden="true" style="font-size: 11px;">↗</span>
          </a>
          <a href="/" class="aeo-return-home-btn" data-home>
            <span>← Return to Portfolio</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom Floating Navigation Bar -->
  <nav class="cs-nav" aria-label="Case Study Navigation">
    <a class="cs-nav-home" href="/" data-home aria-label="Return to portfolio">
      <svg class="cs-nav-home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10 12 4l8 6v10h-6v-6h-4v6H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
      </svg>
    </a>
    <a class="cs-nav-btn is-back" href="/" data-home>
      <span class="cs-nav-kicker">Return</span>
      <span class="cs-nav-name">Portfolio Home</span>
    </a>
    <a class="cs-nav-btn is-next" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
      <span class="cs-nav-kicker">Contact</span>
      <span class="cs-nav-name">Let's Talk</span>
    </a>
  </nav>

</article>
`;
}
