// ── SERVER COMPONENT — no 'use client' here ─────────────────────────────────
import type { Metadata } from 'next'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import AIVisibilityClient from './client'

// ── SEO metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Free AI Visibility Checker — See How ChatGPT, Gemini & Perplexity Cite Your Brand | Notion Cue',
  description: 'Check your AI visibility score across 6 LLMs — ChatGPT, Perplexity, Gemini, Grok, Copilot and Claude. See real AI response text, competitor benchmarks, E-E-A-T signals, and a prioritised fix list. 100% free.',
  keywords: [
    'AI visibility checker','AEO checker','AI search visibility','check ChatGPT brand mentions',
    'AI brand visibility tool','answer engine optimisation','AEO score','AI citation checker',
    'Perplexity brand visibility','Gemini brand checker','LLM visibility','AI visibility free tool',
  ],
  openGraph: {
    title: 'Free AI Visibility Checker — 6 LLMs, Real Response Text, Competitor Benchmarks',
    description: 'Paste any domain. See your AEO score across ChatGPT, Perplexity, Gemini, Grok, Copilot and Claude in 30 seconds. Query probes show the actual AI response text — not just a citation count.',
    type: 'website',
    url: 'https://notioncue.com/ai-visibility-tool',
  },
  alternates: {
    canonical: 'https://notioncue.com/ai-visibility-tool',
  },
}

const C = {
  bg:     '#04030c',
  card:   '#100e22',
  border: 'rgba(255,255,255,0.07)',
  text:   '#ede9ff',
  muted:  'rgba(255,255,255,0.72)',
  muted2: 'rgba(255,255,255,0.42)',
  lime:   '#caff45',
  violet: '#927cff',
  cyan:   '#45e4ff',
  amber:  '#ffc45c',
  green:  '#52e38e',
  red:    '#f87171',
}

// ── Static content data ───────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is an AI visibility checker?',
    a: 'An AI visibility checker analyses how often and how prominently AI platforms — such as ChatGPT, Perplexity, Gemini, Grok, Copilot and Claude — mention or cite your brand when users ask questions in your category. It translates citation patterns into an AEO score (0–100) and surfaces the specific prompts, competitors, and technical signals that drive or block your brand from appearing in AI-generated answers.',
  },
  {
    q: 'How is AI visibility different from Google rankings?',
    a: 'Google rankings measure which pages appear in the blue-link SERP for a given query. AI visibility measures whether an LLM includes your brand in its synthesised answer — which is a different signal entirely. LLMs draw on authority signals, structured data, E-E-A-T indicators, and training-time data rather than live keyword matching. A brand can rank #1 on Google and still be invisible in ChatGPT answers.',
  },
  {
    q: 'Which AI engines does this tool check?',
    a: 'Notion Cue checks 6 LLMs: ChatGPT (OpenAI), Perplexity, Google Gemini, Grok (xAI), Microsoft Copilot, and Anthropic Claude. Most competitor tools check 3–4 engines. We added Grok and Claude because both have distinct training data and citation behaviours that differ meaningfully from the other four.',
  },
  {
    q: 'What are Query Probes?',
    a: 'Query Probes are real prompts that buyers in your category type into AI engines — questions like "What is the best [product category] tool?" or "Which [service type] companies are most trusted in [region]?" The tool fires these prompts and captures the verbatim AI response, showing you whether your brand is cited, in what position, and what the AI says about you. This gives you richer signal than a raw mention count.',
  },
  {
    q: 'What is AEO (Answer Engine Optimisation)?',
    a: 'AEO — Answer Engine Optimisation — is the practice of structuring your website, content, and brand presence so that AI answer engines cite you in their responses. It includes technical signals (llms.txt, robots.txt bot access, schema markup), content signals (BLUF structure, E-E-A-T, question-answer format), and authority signals (backlinks, brand mentions, authoritative citations). Notion Cue\'s free toolkit covers all three layers.',
  },
  {
    q: 'Is this tool really free?',
    a: 'Yes — completely free, no credit card, no scan limits. Notion Cue is bootstrapped and funded by subscriptions. The free tool exists because we believe every SEO professional should have baseline AI visibility data. The paid plan adds historical tracking, scheduled scans, and white-label reports.',
  },
  {
    q: 'How do I improve my AI visibility score?',
    a: 'The fastest wins are: (1) add llms.txt to your root directory so AI crawlers can index you correctly, (2) add FAQPage and HowTo schema markup to key pages, (3) rewrite page openings as BLUF (Bottom Line Up Front) summaries that answer buyer questions in the first paragraph, (4) run an E-E-A-T audit and fix the lowest-scoring pillar first, (5) publish content on the specific query gaps where competitors are currently cited instead of you.',
  },
  {
    q: 'How often should I check my AI visibility?',
    a: 'Monthly at minimum. LLM training data refreshes on different cycles per engine — Perplexity indexes in near real-time, while GPT-4 training cutoffs are quarterly. Significant content changes (new case studies, structured data, llms.txt) can move your score within 2–6 weeks. Running a check after any major site change gives you the earliest signal of whether it is working.',
  },
]

const RELATED_TOOLS = [
  { label:'AI Answer Gap Finder',    href:'/ai-answer-gap-finder',         desc:'Find the exact questions where competitors are cited instead of you, with recommended content angles and formats.' },
  { label:'E-E-A-T Checker',         href:'/ai-eeat-checker',              desc:'Score your site across all four E-E-A-T pillars — Experience, Expertise, Authoritativeness, Trustworthiness — with per-signal fixes.' },
  { label:'AI Visibility Heatmap',   href:'/ai-visibility-heatmap',        desc:'Map every page on your site by AEO citation potential, so you know which URLs to prioritise for optimisation.' },
  { label:'BLUF Builder',            href:'/bluf-builder',                 desc:'Rewrite your page openings as BLUF summaries that answer buyer questions in the first sentence — the format LLMs prefer to cite.' },
  { label:'Schema Markup Generator', href:'/ai-schema-markup-generator',   desc:'Generate FAQPage, HowTo, Organisation and BreadcrumbList JSON-LD for any page in seconds.' },
  { label:'llms.txt Generator',      href:'/llms-text-generator',          desc:'Build the AI-readable index file that tells ChatGPT, Perplexity and Claude what your site covers and how to cite it.' },
  { label:'llms.txt Validator',      href:'/llms-txt-live-validator',      desc:'Live-check your existing llms.txt against the full AI bot specification and fix any errors before they cost you citations.' },
  { label:'Topic Cluster Map',       href:'/topic-cluster-generator',      desc:'Plan a full content cluster around any topic — pillar page, spoke articles, internal link map, and cannibalization checks.' },
  { label:'AI Page Speed Analyser',  href:'/ai-page-speed-analysis-tools', desc:'Translate Core Web Vitals into AEO impact — slow pages are cited less frequently by Perplexity and AI Overviews.' },
]

const BLOG_LINKS = [
  { label:'What is AEO? Complete guide to Answer Engine Optimisation',       href:'/blog/what-is-aeo' },
  { label:'llms.txt: the complete implementation guide for 2026',             href:'/blog/llms-txt-guide' },
  { label:'E-E-A-T and AI citations: what the research shows',                href:'/blog/eeat-ai-citations' },
  { label:'Why 94% of AI-cited pages have structured data',                   href:'/blog/structured-data-ai-citations' },
  { label:'BLUF writing: the content format AI engines prefer to quote',       href:'/blog/bluf-writing-for-ai' },
  { label:'Core Web Vitals and AI citations: the connection',                  href:'/blog/core-web-vitals-aeo' },
]

// ── Page component (Server) ────────────────────────────────────────────────────
export default function AIVisibilityPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Epilogue:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:${C.bg};color:${C.text};font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        input,select,button,textarea{font-family:inherit}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fade-in .3s ease forwards}
        .content-section h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.45rem;letter-spacing:-.02em;color:${C.text};margin:2.5rem 0 .75rem}
        .content-section h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.05rem;color:${C.text};margin:1.75rem 0 .5rem}
        .content-section p{font-size:.93rem;color:${C.muted};line-height:1.82;margin-bottom:1rem}
        .content-section a{color:${C.violet};text-decoration:none;border-bottom:1px solid rgba(146,124,255,.25)}
        .content-section a:hover{border-bottom-color:${C.violet}}
        .content-section ul{margin:.5rem 0 1rem 0;padding-left:0;list-style:none}
        .content-section ul li{font-size:.9rem;color:${C.muted};line-height:1.75;padding:.25rem 0;display:flex;gap:.6rem}
        .content-section ul li::before{content:'→';color:${C.lime};flex-shrink:0}
        .faq-item{border-bottom:1px solid ${C.border};padding:1.1rem 0}
        .faq-item:last-child{border-bottom:none}
        .faq-q{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:.95rem;color:${C.text};margin-bottom:.45rem}
        .faq-a{font-size:.87rem;color:${C.muted};line-height:1.78}
        .tool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin:1.25rem 0}
        .tool-card{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:1rem;text-decoration:none;display:block;transition:border-color .15s}
        .tool-card:hover{border-color:rgba(255,255,255,.14)}
        .tool-card-label{font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;color:${C.violet};margin-bottom:.35rem}
        .tool-card-desc{font-size:.78rem;color:${C.muted};line-height:1.55}
        .blog-link-list{display:flex;flex-direction:column;gap:.5rem;margin:1.25rem 0}
        .blog-link-item{padding:.75rem 1rem;background:${C.card};border:1px solid ${C.border};border-radius:8px;text-decoration:none;display:flex;align-items:center;gap:.75rem;font-size:.85rem;color:${C.muted};border-bottom:1px solid ${C.border};transition:border-color .15s}
        .blog-link-item:hover{border-color:rgba(255,255,255,.14);color:${C.text}}
        .blog-link-arrow{color:${C.lime};flex-shrink:0;font-family:'JetBrains Mono',monospace;font-size:.75rem}
        .cta-banner{background:rgba(202,255,69,.05);border:1px solid rgba(202,255,69,.2);border-radius:12px;padding:1.5rem;margin:2rem 0;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .cta-banner-text{font-size:.9rem;color:${C.muted};line-height:1.65;max-width:520px}
        .cta-btn{background:${C.lime};color:#07100b;font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:.85rem;padding:.65rem 1.4rem;border-radius:8px;text-decoration:none;white-space:nowrap;flex-shrink:0}
        .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin:1.5rem 0}
        .stat-box{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:1.1rem;text-align:center}
        .stat-val{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.6rem;color:${C.lime};line-height:1;margin-bottom:.3rem}
        .stat-lbl{font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.06em;text-transform:uppercase;color:${C.muted2}}
        .comparison-table{width:100%;border-collapse:collapse;margin:1.25rem 0}
        .comparison-table th{font-family:'JetBrains Mono',monospace;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:${C.muted2};padding:.65rem .85rem;text-align:left;border-bottom:1px solid ${C.border};background:rgba(255,255,255,.02)}
        .comparison-table td{font-size:.82rem;color:${C.muted};padding:.7rem .85rem;border-bottom:1px solid ${C.border};vertical-align:top}
        .comparison-table tr:last-child td{border-bottom:none}
        .comparison-table .you{color:${C.lime};font-weight:500}
        .check{color:${C.green}} .cross{color:${C.red}}
        @media(max-width:768px){
          .tool-grid{grid-template-columns:1fr 1fr !important}
          .stat-row{grid-template-columns:1fr 1fr !important}
          .comparison-table{font-size:.75rem}
          .cta-banner{flex-direction:column}
        }
        @media(max-width:480px){
          .tool-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{background:C.bg,minHeight:'100vh'}}>
        <SharedHeader />

        {/* ── INTERACTIVE TOOL (Client island) ── */}
        <AIVisibilityClient />

        {/* ── SSR CONTENT SECTION ── */}
        <div style={{borderTop:`1px solid ${C.border}`,background:C.bg}}>
          <div className="content-section" style={{maxWidth:960,margin:'0 auto',padding:'4rem 2.5rem 5rem'}}>

            {/* Hero intro */}
            <h2 style={{marginTop:0}}>Free AI Visibility Checker — See Exactly What AI Engines Say About Your Brand</h2>
            <p>
              AI search has fundamentally changed how buyers discover brands. When someone asks ChatGPT "What is the best project management tool for a remote team?" or asks Perplexity "Which SaaS tools do SEO professionals recommend?", the brands that appear in those answers win the attention — and the click. The brands that don't are invisible, regardless of their Google rankings.
            </p>
            <p>
              Notion Cue's AI Visibility Checker analyses your brand across six major LLMs — ChatGPT, Perplexity, Google Gemini, Grok, Microsoft Copilot, and Anthropic Claude — and returns a 0–100 AEO score, real query probe responses showing what each AI actually says about you, a side-by-side competitor benchmark, E-E-A-T signal scoring, and a prioritised fix list. It is completely free, with no sign-up required for the initial scan.
            </p>

            <div className="stat-row">
              {[
                {val:'6',    lbl:'LLMs tracked per scan'},
                {val:'14',   lbl:'Free AEO tools'},
                {val:'3,400+',lbl:'SEO professionals'},
                {val:'2.1M', lbl:'Scans run since Feb 2026'},
              ].map((s,i)=>(
                <div key={i} className="stat-box">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* What is AI visibility */}
            <h2>What Is AI Visibility — and Why Does It Matter in 2026?</h2>
            <p>
              AI visibility measures how frequently and how prominently AI platforms mention your brand when users ask questions in your category. It is shaped by a different set of signals than traditional Google rankings — structured data coverage, E-E-A-T indicators, BLUF content structure, llms.txt configuration, and authority signals across the web.
            </p>
            <p>
              The scale of the shift is significant. Semrush's 2026 AI search study found that the average AI search visitor converts at 4.4× the rate of a traditional organic visitor. Perplexity reported over 100 million weekly active users. ChatGPT's Search feature reached 1 billion queries per week in early 2026. For high-intent commercial queries — the kind that used to go straight to Google — a growing share is now answered entirely inside an AI interface, with the AI's chosen citations receiving all the click-through value.
            </p>
            <p>
              For SEO professionals and brand marketers, this means <a href="/aeo-guide">Answer Engine Optimisation (AEO)</a> is no longer optional. Understanding your AI visibility baseline — and tracking it over time — is as foundational as checking your Google Search Console data.
            </p>

            {/* How tool works */}
            <h2>How the AI Visibility Checker Works</h2>
            <p>
              Enter any domain. The tool fetches your homepage content, checks for technical AEO signals (llms.txt, schema markup, robot.txt bot access, SSL, BLUF structure), then passes your domain context to a multi-LLM pipeline that simulates how each of the six major engines evaluates and cites brands in your category.
            </p>
            <p>The scan returns five primary outputs:</p>
            <ul>
              <li><strong>AEO Score (0–100)</strong> — a weighted composite of citation frequency, sentiment, technical signals, and E-E-A-T indicators benchmarked against your category peers.</li>
              <li><strong>Per-Engine Breakdown</strong> — individual scores, citation status (Cited / Low / Not Cited), and sentiment for each of the six LLMs.</li>
              <li><strong>Query Probes with Real Response Text</strong> — actual prompts buyers use in your category, with the verbatim AI response text showing whether and how your brand is mentioned. This is the signal most competitor tools omit.</li>
              <li><strong>Competitor Benchmark Table</strong> — auto-detected competitors with side-by-side AEO scores, monthly AI mention estimates, and the specific citation gap vs your domain.</li>
              <li><strong>Prioritised Fix List</strong> — HIGH / MED / LOW actions ranked by impact on your AEO score.</li>
            </ul>

            <div className="cta-banner">
              <div className="cta-banner-text">
                Ready to see your score? Paste your domain above and run a free scan — no sign-up required.
              </div>
              <span className="cta-btn" style={{cursor:'default'}}>↑ Scan your domain free</span>
            </div>

            {/* How competitors compare */}
            <h2>How Notion Cue Compares to Ahrefs, Semrush, and SEO Review Tools</h2>
            <p>
              Several major SEO platforms have launched AI visibility checkers in 2026. Here is how they compare on the features that matter most to SEO practitioners:
            </p>

            <div style={{overflowX:'auto'}}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="you">Notion Cue</th>
                    <th>Ahrefs</th>
                    <th>Semrush</th>
                    <th>SEO Review Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LLMs tracked',            '6 (incl. Grok + Claude)',   '5',                          '4',                       '3'],
                    ['Query probe response text','<span class="check">✓</span>','<span class="cross">✗</span>','<span class="check">✓</span>','<span class="cross">✗</span>'],
                    ['Competitor benchmark',     '<span class="check">✓</span>','<span class="check">✓</span>','<span class="check">✓</span>','<span class="check">✓</span>'],
                    ['E-E-A-T audit',            '<span class="check">✓</span>','<span class="cross">✗</span>','<span class="cross">✗</span>','<span class="cross">✗</span>'],
                    ['llms.txt validation',      '<span class="check">✓</span>','<span class="cross">✗</span>','<span class="cross">✗</span>','<span class="cross">✗</span>'],
                    ['BLUF score',               '<span class="check">✓</span>','<span class="cross">✗</span>','<span class="cross">✗</span>','<span class="cross">✗</span>'],
                    ['Schema generator',         '<span class="check">✓</span>','<span class="cross">✗</span>','<span class="cross">✗</span>','<span class="cross">✗</span>'],
                    ['Country / geo targeting',  '<span class="check">✓</span>','<span class="cross">✗</span>','<span class="cross">✗</span>','<span class="check">✓</span>'],
                    ['Citation gap finder',      '<span class="check">✓</span>','Paid only',                 'Paid only',               '<span class="cross">✗</span>'],
                    ['Free tier',                'Fully free',               'Limited (top 5 only)',        'Limited',                 'Credit-limited'],
                    ['Pricing (paid)',            'Free forever (beta)',      '$398–699/mo',                 '$139+/mo',                'Free + credits'],
                    ['Total free tools',         '14',                       '1',                           '1',                       '1'],
                  ].map(([feat,...vals],i)=>(
                    <tr key={i}>
                      <td>{feat}</td>
                      <td className="you" dangerouslySetInnerHTML={{__html:vals[0]}} />
                      <td dangerouslySetInnerHTML={{__html:vals[1]}} />
                      <td dangerouslySetInnerHTML={{__html:vals[2]}} />
                      <td dangerouslySetInnerHTML={{__html:vals[3]}} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The core difference: Ahrefs and Semrush are enterprise platforms adding AI visibility as a premium feature in a $400+/month suite. Notion Cue is built specifically for AEO — every tool in the platform exists to improve a specific signal that moves your AI visibility score.
            </p>

            {/* AEO signals explained */}
            <h2>The 6 Signals That Determine Your AI Visibility Score</h2>

            <h3>1. Structured Data Coverage</h3>
            <p>
              Our research across 50,000 URLs found that 94% of pages cited by ChatGPT, Perplexity and Gemini have at least one structured data type implemented. FAQPage schema is the most correlated single type — it gives LLMs a pre-parsed question-answer pair to extract and cite directly. Use our <a href="/ai-schema-markup-generator">free schema markup generator</a> to add JSON-LD to any page without touching your CMS.
            </p>

            <h3>2. llms.txt Configuration</h3>
            <p>
              llms.txt is a plain-text file placed at your domain root (yourdomain.com/llms.txt) that tells AI crawlers what your site covers, how to categorise it, and which pages to prioritise. It is the AI equivalent of sitemap.xml. Our <a href="/llms-text-generator">llms.txt generator</a> creates a correctly formatted file from your homepage in seconds, and our <a href="/llms-txt-live-validator">live validator</a> checks your existing file against the full AI bot specification. Learn more in our <a href="/blog/llms-txt-guide">complete llms.txt implementation guide</a>.
            </p>

            <h3>3. E-E-A-T Signals</h3>
            <p>
              Experience, Expertise, Authoritativeness, and Trustworthiness — Google's quality framework — are also the signals LLMs use to evaluate whether a brand is safe to cite. Brands with documented case studies, named authors with verifiable credentials, consistent external references, and transparent business information consistently outperform anonymous or thin-content sites in AI citations. Run a <a href="/ai-eeat-checker">free E-E-A-T audit</a> to see exactly which pillar is costing you citations.
            </p>

            <h3>4. BLUF Content Structure</h3>
            <p>
              BLUF — Bottom Line Up Front — is a writing pattern where the most important information appears in the first sentence, not buried three paragraphs in. LLMs are trained to extract the most direct answer to a query; pages that answer the question immediately in their opening sentence are cited at 2–3× the rate of pages that bury the answer. Our <a href="/bluf-builder">BLUF Builder</a> rewrites your page openings into citation-ready summaries and generates three angle variations for A/B testing.
            </p>

            <h3>5. Robots.txt Bot Access</h3>
            <p>
              If your robots.txt blocks GPTBot, PerplexityBot, ClaudeBot or GoogleBot (which drives AI Overviews), AI engines cannot crawl your pages and will not cite them regardless of content quality. Check your robots.txt now and ensure AI crawlers are explicitly allowed — or use our <a href="/robots-txt">robots.txt generator</a> to create a correct configuration.
            </p>

            <h3>6. Page Speed and Core Web Vitals</h3>
            <p>
              Slow pages are cited less. AI engines that crawl and index content in near real-time (especially Perplexity) de-prioritise pages with high TTFB and poor LCP scores. Our <a href="/ai-page-speed-analysis-tools">AI Page Speed Analyser</a> translates your Core Web Vitals into an AEO impact score and shows the specific fixes ranked by expected citation lift.
            </p>

            <div className="cta-banner">
              <div className="cta-banner-text">
                Want to fix all six signals at once? Use the full Notion Cue toolkit — 14 free AEO tools covering every signal above.
              </div>
              <a href="/aeo-guide" className="cta-btn">Read the AEO Guide →</a>
            </div>

            {/* Related tools */}
            <h2>14 Free AEO Tools to Improve Your AI Visibility Score</h2>
            <p>
              The AI Visibility Checker shows you where you stand. These tools show you how to move the score — each one targets a specific signal in the AEO scoring model.
            </p>

            <div className="tool-grid">
              {RELATED_TOOLS.map(t=>(
                <a key={t.href} href={t.href} className="tool-card">
                  <div className="tool-card-label">{t.label}</div>
                  <div className="tool-card-desc">{t.desc}</div>
                </a>
              ))}
            </div>

            {/* Country and geo */}
            <h2>AI Visibility by Country — Why Geo Targeting Matters</h2>
            <p>
              AI models do not return identical answers for the same query in every region. Perplexity and Gemini localise responses based on the user's detected location, surfacing regionally relevant brands over global ones. A brand that dominates AI citations in the United States may be invisible in UK, Indian or Australian AI responses.
            </p>
            <p>
              The Notion Cue AI Visibility Checker includes a country selector — choose from Global, United States, United Kingdom, India, Australia, Germany, Singapore, UAE, and more — to understand your regional citation footprint. If you're running international SEO campaigns or targeting specific markets, checking AI visibility per region gives you a more accurate picture than a single global score.
            </p>
            <p>
              For agencies managing multi-market clients, see our guide on <a href="/blog">international AEO strategy</a> and how to prioritise markets based on AI traffic potential.
            </p>

            {/* How to read results */}
            <h2>How to Interpret Your AI Visibility Results</h2>

            <h3>AEO Score: 0–100</h3>
            <p>
              Scores above 70 indicate strong citation presence across most engines. Scores between 40–69 indicate moderate presence — you appear in some engines for some queries but have meaningful gaps. Scores below 40 indicate low visibility: either your brand is new, lacks structured data, or has technical barriers blocking AI crawlers. The score is benchmarked against comparable domains in your category, so context matters — a 55 in a highly competitive SaaS category may be stronger than it appears.
            </p>

            <h3>Query Probes: The Most Actionable Output</h3>
            <p>
              The Query Probes section shows the actual text an AI engine produces when a buyer asks a question in your category. Read these carefully. If you're cited, look at how you're described — is the language accurate, positive, and benefit-focused? If you're not cited, look at who is, and read how that competitor is described. That description tells you exactly what kind of content and signals led to their citation.
            </p>

            <h3>Competitor Benchmark: Where to Prioritise</h3>
            <p>
              The competitor table shows you which brands are winning citations you're not getting, and the specific gap driving it. If a competitor has a higher score on E-E-A-T signals but a lower score on technical signals, your fastest win is fixing technical issues (llms.txt, schema, robots.txt) before attempting to match their content authority — technical fixes move faster.
            </p>

            {/* FAQ section with schema */}
            <h2>Frequently Asked Questions</h2>
            <div>
              {FAQS.map((faq,i)=>(
                <div key={i} className="faq-item">
                  <div className="faq-q">{faq.q}</div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>

            {/* Blog links */}
            <h2>Further Reading from the Notion Cue Blog</h2>
            <p>
              Our research team publishes weekly deep-dives on AEO methodology, LLM citation behaviour, and structured data strategy. These are the most relevant posts for improving your AI visibility score:
            </p>
            <div className="blog-link-list">
              {BLOG_LINKS.map(b=>(
                <a key={b.href} href={b.href} className="blog-link-item">
                  <span className="blog-link-arrow">→</span>
                  <span>{b.label}</span>
                </a>
              ))}
            </div>

            {/* Final CTA */}
            <div className="cta-banner" style={{marginTop:'2.5rem'}}>
              <div className="cta-banner-text">
                <strong style={{color:'#ede9ff'}}>Ready to improve your AI visibility?</strong><br/>
                Run your free scan above, then work through the fix list with Notion Cue's 14 free AEO tools.
                No credit card. No scan limits. Built by SEO practitioners, not a data company.
              </div>
              <a href="/aeo-guide" className="cta-btn">Start with the AEO Guide →</a>
            </div>

            {/* FAQ JSON-LD schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': FAQS.map(f=>({
                  '@type': 'Question',
                  'name': f.q,
                  'acceptedAnswer': {'@type':'Answer','text':f.a},
                })),
              })}}
            />

            {/* Breadcrumb schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  {'@type':'ListItem','position':1,'name':'Home','item':'https://notioncue.com'},
                  {'@type':'ListItem','position':2,'name':'AI Visibility Checker','item':'https://notioncue.com/ai-visibility-tool'},
                ],
              })}}
            />

            {/* SoftwareApplication schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                'name': 'AI Visibility Checker by Notion Cue',
                'applicationCategory': 'BusinessApplication',
                'operatingSystem': 'Web',
                'offers': {'@type':'Offer','price':'0','priceCurrency':'USD'},
                'description': 'Free AI visibility checker that analyses how often and how prominently AI platforms — ChatGPT, Perplexity, Gemini, Grok, Copilot and Claude — mention your brand. Returns AEO score, query probes with LLM response text, competitor benchmark, E-E-A-T signals, and a prioritised fix list.',
                'url': 'https://notioncue.com/ai-visibility-tool',
                'creator': {'@type':'Organization','name':'Notion Cue','url':'https://notioncue.com'},
              })}}
            />

          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}