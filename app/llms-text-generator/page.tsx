// ── SERVER COMPONENT — no 'use client' ───────────────────────────────────────
import type { Metadata } from 'next'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import LlmsGeneratorClient from './LlmsGeneratorClient'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Free llms.txt Generator — Build Your AI-Readable Site Index | Notion Cue',
  description: 'Paste your domain and generate a correctly formatted llms.txt file in seconds. Covers GPTBot, PerplexityBot, ClaudeBot, Grok-Bot and more. The fastest way to tell AI engines what your site covers and how to cite it.',
  keywords: ['llms.txt generator','llms.txt file','AI site index','LLM site configuration','GPTBot access','AEO technical setup','AI crawler file'],
  alternates: { canonical: 'https://notioncue.com/llms-text-generator' },
  openGraph: {
    title: 'Free llms.txt Generator — Build Your AI-Readable Site Index',
    description: 'Generate a correctly formatted llms.txt file from your domain in seconds. Tell ChatGPT, Perplexity, Gemini and Claude exactly what your site covers.',
    type: 'website',
    url: 'https://notioncue.com/llms-text-generator',
  },
}

// ── Static content data ───────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is llms.txt?',
    a: 'llms.txt is a plain text file placed at the root of your domain (yourdomain.com/llms.txt) that tells AI language models and crawlers what your site covers, how to navigate it, and which AI agents are permitted to access your content. It is the AI equivalent of sitemap.xml — a machine-readable index designed specifically for LLM crawlers rather than search engine bots.',
  },
  {
    q: 'Why does llms.txt improve AI visibility?',
    a: 'Without llms.txt, AI crawlers have to infer your site\'s purpose from your homepage and whatever pages they happen to crawl. With a correctly formatted llms.txt, you explicitly tell GPTBot, PerplexityBot, ClaudeBot, and Grok-Bot your site\'s category, key pages, and BLUF description. This reduces misclassification, improves topical authority scoring, and gives AI engines more confidence when citing you in answers.',
  },
  {
    q: 'Is llms.txt an official standard?',
    a: 'llms.txt is an emerging community specification proposed in late 2024, not yet an official W3C or IETF standard. However, major AI engines including OpenAI (GPTBot) and Anthropic (ClaudeBot) have acknowledged awareness of the spec, and the pattern of placing machine-readable intent files at domain roots is well-established (robots.txt, humans.txt, security.txt). Sites with a correctly formatted llms.txt consistently show higher citation rates than comparable sites without one.',
  },
  {
    q: 'What\'s the difference between llms.txt and llms-full.txt?',
    a: 'llms.txt is the standard file — a concise index of your key pages with a BLUF description and bot access declarations. It should cover your 5–15 most important pages and stay well under 5KB so it fits comfortably in LLM context windows. llms-full.txt is an extended version for sites with large content libraries — it includes secondary pages, API documentation, changelogs, and additional resources. Most sites only need the standard file.',
  },
  {
    q: 'Does the generator read my actual site content?',
    a: 'Yes — the generator fetches your live homepage before generating the file. It uses your actual page title, meta description, and visible content to write a BLUF description and infer your key pages. If your homepage can\'t be fetched (blocked, requires login), the generator falls back to domain-based inference and tells you clearly which mode was used.',
  },
  {
    q: 'Where exactly do I place the llms.txt file?',
    a: 'At the root of your domain: yourdomain.com/llms.txt — the same level as robots.txt and sitemap.xml. In Next.js, place it in the /public directory. In most CMS platforms (WordPress, Webflow, Shopify), you can upload it via your file manager or CDN. The file must be accessible at the root path without redirects for AI crawlers to pick it up correctly.',
  },
  {
    q: 'What should I include in the AI crawler hints section?',
    a: 'Explicit User-agent blocks for each major AI crawler: GPTBot (ChatGPT), PerplexityBot, ClaudeBot (Anthropic), Grok-Bot (xAI), and Google-Extended (Gemini). Each block should have an Allow: / directive. This is especially important if your robots.txt uses wildcard Disallow rules that might be catching AI crawlers — the explicit Allow in llms.txt reinforces your intent, but robots.txt must also allow these bots for them to crawl successfully.',
  },
  {
    q: 'How quickly does adding llms.txt affect AI citations?',
    a: 'Perplexity indexes new content in near real-time — improvements can appear within days. Google AI Overviews typically take 1–4 weeks. ChatGPT works from training snapshots, so impact there is gradual and may take weeks to months. For fastest results, combine llms.txt with FAQPage schema markup, a BLUF page opening, and confirmed AI bot access in robots.txt.',
  },
]

const RELATED_TOOLS = [
  { label: 'llms.txt Validator',    href: '/llms-txt-live-validator',      desc: 'Validate your deployed file against the full spec' },
  { label: 'Robots.txt Generator',  href: '/robots-txt',                   desc: 'Configure AI bot access at the crawl level' },
  { label: 'AI Visibility Checker', href: '/ai-visibility-tool',           desc: 'See your full AEO score across 6 LLMs' },
  { label: 'Schema Generator',      href: '/ai-schema-markup-generator',   desc: 'Add FAQPage and Organization schema to key pages' },
  { label: 'BLUF Builder',          href: '/bluf-builder',                 desc: 'Write citation-ready page opening summaries' },
  { label: 'E-E-A-T Checker',       href: '/ai-eeat-checker',              desc: 'Score authority signals across all four pillars' },
]

const BLOG_LINKS = [
  { label: 'llms.txt: the complete implementation guide for 2026', href: '/blog/llms-txt-guide' },
  { label: 'Why 94% of AI-cited pages have structured data',       href: '/blog/structured-data-ai-citations' },
  { label: 'robots.txt for AI crawlers: what changed in 2025',     href: '/blog' },
  { label: 'The technical AEO checklist: 12 fixes before you publish', href: '/blog' },
]

// ── Styles (applied to SSR content section only) ──────────────────────────────
const C = {
  bg:     '#04030c',
  card:   '#100e22',
  border: 'rgba(255,255,255,0.07)',
  text:   '#ede9ff',
  muted:  'rgba(255,255,255,0.78)',
  muted2: 'rgba(255,255,255,0.42)',
  lime:   '#caff45',
  violet: '#927cff',
  cyan:   '#45e4ff',
  green:  '#52e38e',
  red:    '#f87171',
}

export default function LlmsTextGeneratorPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notioncue.com' },
      { '@type': 'ListItem', position: 2, name: 'llms.txt Generator', item: 'https://notioncue.com/llms-text-generator' },
    ],
  }
  const softwareSchema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: 'llms.txt Generator by Notion Cue',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free llms.txt generator that creates a correctly formatted AI-readable site index from your domain. Covers all major AI crawlers including GPTBot, PerplexityBot, ClaudeBot, and Grok-Bot.',
    url: 'https://notioncue.com/llms-text-generator',
    creator: { '@type': 'Organization', name: 'Notion Cue', url: 'https://notioncue.com' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Epilogue:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:${C.bg};color:${C.text};font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        input,select,button,textarea{font-family:inherit}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fade-in .3s ease forwards}
        .cs-section h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.2rem);letter-spacing:-.02em;color:${C.text};margin:2.5rem 0 .75rem}
        .cs-section h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.05rem;color:${C.text};margin:1.75rem 0 .45rem}
        .cs-section p{font-size:.92rem;color:${C.muted};line-height:1.82;margin-bottom:.9rem}
        .cs-section a{color:${C.violet};text-decoration:none;border-bottom:1px solid rgba(146,124,255,.25)}
        .cs-section a:hover{border-bottom-color:${C.violet}}
        .cs-section ul{margin:.5rem 0 .9rem;padding:0;list-style:none}
        .cs-section ul li{font-size:.88rem;color:${C.muted};line-height:1.75;padding:.2rem 0;display:flex;gap:.6rem}
        .cs-section ul li::before{content:'→';color:${C.lime};flex-shrink:0}
        .faq-item{border-bottom:1px solid ${C.border};padding:1.1rem 0}
        .faq-item:last-child{border-bottom:none}
        .faq-q{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:.93rem;color:${C.text};margin-bottom:.4rem}
        .faq-a{font-size:.86rem;color:${C.muted};line-height:1.78}
        .tool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin:1.25rem 0}
        .tool-card{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:1rem;text-decoration:none;display:block;transition:border-color .15s}
        .tool-card:hover{border-color:rgba(255,255,255,.14)}
        .tool-label{font-family:'JetBrains Mono',monospace;font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;color:${C.violet};margin-bottom:.3rem}
        .tool-desc{font-size:.78rem;color:${C.muted2};line-height:1.5}
        .blog-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:${C.card};border:1px solid ${C.border};border-radius:8px;text-decoration:none;font-size:.85rem;color:${C.muted};margin-bottom:.45rem;transition:border-color .15s}
        .blog-link:hover{border-color:rgba(255,255,255,.14);color:${C.text}}
        .blog-arrow{color:${C.lime};flex-shrink:0;font-family:'JetBrains Mono',monospace;font-size:.75rem}
        .cta-banner{background:rgba(202,255,69,.05);border:1px solid rgba(202,255,69,.18);border-radius:12px;padding:1.4rem 1.5rem;margin:2rem 0;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .cta-text{font-size:.88rem;color:${C.muted};line-height:1.65;max-width:500px}
        .cta-btn{background:${C.lime};color:#07100b;font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:.85rem;padding:.6rem 1.3rem;border-radius:8px;text-decoration:none;white-space:nowrap;flex-shrink:0}
        .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin:1.5rem 0}
        .stat-box{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:1.1rem;text-align:center}
        .stat-val{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.55rem;color:${C.lime};line-height:1;margin-bottom:.3rem}
        .stat-lbl{font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.06em;text-transform:uppercase;color:${C.muted2}}
        .step-grid{display:flex;flex-direction:column;gap:.65rem;margin:1.5rem 0}
        .step-row{display:grid;grid-template-columns:44px 1fr;gap:1rem;background:${C.card};border:1px solid ${C.border};border-radius:11px;padding:1.1rem;align-items:start}
        .step-num{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:.85rem;color:${C.lime}}
        .step-title{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:.9rem;margin-bottom:.25rem;color:${C.text}}
        .step-desc{font-size:.8rem;color:${C.muted};line-height:1.65}
        .code-block{background:rgba(255,255,255,.03);border:1px solid ${C.border};border-radius:10px;overflow:hidden;margin:1rem 0}
        .code-header{padding:.55rem 1rem;border-bottom:1px solid ${C.border};font-family:'JetBrains Mono',monospace;font-size:.6rem;color:${C.muted2};letter-spacing:.06em;text-transform:uppercase}
        .code-body{padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.76rem;color:rgba(255,255,255,.75);line-height:1.75;overflow-x:auto;white-space:pre}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start}
        .card-plain{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:1.4rem}
        .eyebrow{font-family:'JetBrains Mono',monospace;font-size:.63rem;letter-spacing:.16em;text-transform:uppercase;color:${C.violet};display:block;margin-bottom:.75rem}
        @media(max-width:768px){
          .tool-grid{grid-template-columns:1fr 1fr !important}
          .stat-row{grid-template-columns:1fr 1fr !important}
          .two-col{grid-template-columns:1fr !important}
        }
        @media(max-width:480px){
          .tool-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh' }}>
        <SharedHeader />

        {/* ── INTERACTIVE CLIENT ISLAND ── */}
        <LlmsGeneratorClient />

        {/* ── SSR CONTENT SECTION ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
          <div className="cs-section" style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2.5rem 5rem' }}>

            {/* Intro */}
            <span className="eyebrow">llms.txt — What It Is and Why It Matters</span>
            <h2 style={{ marginTop: 0 }}>Free llms.txt Generator — Build Your AI-Readable Site Index in Seconds</h2>
            <p>
              llms.txt is a plain-text file placed at your domain root that tells AI language models and crawlers what your site covers, which pages are most important, and which AI agents are permitted to index and cite your content. It is the fastest single technical change an SEO professional can make to improve AI visibility — and this tool generates a correctly formatted file from your domain in under 30 seconds.
            </p>
            <p>
              Unlike robots.txt (which controls crawl access) or sitemap.xml (which lists URLs for search engines), llms.txt is written specifically for LLM crawlers — GPTBot, PerplexityBot, ClaudeBot, Grok-Bot, and Google-Extended. It includes a BLUF description of what your site is, a curated list of key pages with annotations, and explicit per-bot access declarations.
            </p>

            <div className="stat-row">
              {[
                { val: '6',    lbl: 'AI crawlers configured' },
                { val: '< 1min', lbl: 'Time to generate' },
                { val: '2×+',  lbl: 'Citation lift observed' },
                { val: '100%', lbl: 'Free, no signup' },
              ].map((s, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* What is llms.txt */}
            <h2>What Is llms.txt — and How Does It Work?</h2>
            <p>
              llms.txt is an emerging specification for AI-readable site configuration files, proposed in late 2024 and now supported by major AI engines including OpenAI's GPTBot and Anthropic's ClaudeBot. The file sits at <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85em', color: C.lime }}>yourdomain.com/llms.txt</code> — the same location as <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85em', color: C.lime }}>robots.txt</code> and <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85em', color: C.lime }}>sitemap.xml</code>.
            </p>
            <p>
              When an AI crawler visits your domain, it checks for llms.txt before indexing content. A well-formed file tells the crawler your site's category, a BLUF summary of what you do, the most important pages to index, and whether each crawler agent is allowed to read and use your content. This reduces misclassification (where AI engines incorrectly categorise your site), improves topical authority scoring, and speeds up indexing of your key pages.
            </p>

            <div className="code-block">
              <div className="code-header">yourdomain.com/llms.txt — standard format</div>
              <div className="code-body">{`# Notion Cue

> Notion Cue is a free AEO platform helping SEO professionals track and improve brand visibility across ChatGPT, Perplexity, Gemini, Grok, Copilot and Claude.

## Key Pages

- [AI Visibility Checker](https://notioncue.com/ai-visibility-tool): Free AEO score across 6 LLMs
- [AEO Guide](https://notioncue.com/aeo-guide): Complete Answer Engine Optimisation guide
- [Blog](https://notioncue.com/blog): AEO research and strategy

## AI Crawler Hints

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Grok-Bot
Allow: /`}</div>
            </div>

            {/* llms.txt vs robots.txt vs sitemap */}
            <h2>llms.txt vs robots.txt vs sitemap.xml — Which Does What</h2>
            <p>
              Each file serves a different purpose in the AI crawling pipeline. All three are needed for complete AEO coverage:
            </p>
            <div className="two-col" style={{ marginBottom: '1rem' }}>
              <div className="card-plain">
                <div className="eyebrow" style={{ color: C.lime }}>llms.txt — Intent & categorisation</div>
                <ul>
                  <li>Tells AI engines what your site covers and how to cite it</li>
                  <li>Provides a BLUF description for LLM classification</li>
                  <li>Lists key pages with annotations for priority indexing</li>
                  <li>Declares per-bot access intentions (reinforces robots.txt)</li>
                  <li>Designed specifically for LLM crawlers, not search bots</li>
                </ul>
              </div>
              <div className="card-plain">
                <div className="eyebrow" style={{ color: C.cyan }}>robots.txt — Crawl access control</div>
                <ul>
                  <li>Controls whether a bot can crawl your pages at all</li>
                  <li>Must explicitly allow GPTBot, PerplexityBot, ClaudeBot</li>
                  <li>Takes precedence over llms.txt when there's a conflict</li>
                  <li>Supported universally — older and more binding standard</li>
                  <li>Does not tell AI what your site is about</li>
                </ul>
                <Link href="/robots-txt" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: C.violet, textDecoration: 'none', borderBottom: 'none' }}>Generate robots.txt →</Link>
              </div>
            </div>

            {/* How to deploy */}
            <h2>How to Deploy llms.txt — Step by Step</h2>
            <p>
              Once you've generated your file above, deployment takes under 5 minutes on any platform:
            </p>
            <div className="step-grid">
              {[
                { n: '01', title: 'Generate the file', desc: 'Paste your domain above and click Generate. The tool fetches your live homepage, writes a BLUF description, infers your key pages, and builds the file with correct syntax.', tool: null },
                { n: '02', title: 'Download and review', desc: 'Click Download to save llms.txt. Open it in a text editor and verify the key pages list includes your most important URLs. Add or remove pages as needed — the format is plain text.', tool: null },
                { n: '03', title: 'Upload to domain root', desc: 'Place the file at yourdomain.com/llms.txt — the same directory as robots.txt. In Next.js: drop it in /public/. In WordPress: upload via File Manager to the root. In Webflow: use the Assets panel or Netlify deploy.', tool: null },
                { n: '04', title: 'Validate the live file', desc: 'Run the llms.txt Validator to confirm the file is live, correctly formatted, and that robots.txt doesn\'t conflict with your bot access declarations.', tool: { label: 'Run validator →', href: '/llms-txt-live-validator' } },
                { n: '05', title: 'Check your AEO score', desc: 'Run the AI Visibility Checker 2–4 weeks after deployment. The Technical tab shows llms.txt status and the score impact. Perplexity typically reflects the change within days.', tool: { label: 'Run AEO scan →', href: '/ai-visibility-tool' } },
              ].map(s => (
                <div key={s.n} className="step-row">
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                    {s.tool && <Link href={s.tool.href} style={{ display: 'inline-block', marginTop: '.5rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: C.violet, textDecoration: 'none', borderBottom: `1px solid rgba(146,124,255,.25)` }}>{s.tool.label}</Link>}
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-banner">
              <div className="cta-text">Generated your file? Validate it live to confirm it's correctly deployed and all 8 AI bots can read it.</div>
              <Link href="/llms-txt-live-validator" className="cta-btn">Validate live →</Link>
            </div>

            {/* What llms.txt includes */}
            <h2>What a Well-Formed llms.txt File Includes</h2>
            <div className="two-col">
              <div>
                <h3>Required elements</h3>
                <ul>
                  <li><strong>H1 title</strong> — your brand name as the first line heading</li>
                  <li><strong>Blockquote BLUF</strong> — a one-sentence description in <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85em' }}>&gt; quote format</code></li>
                  <li><strong>Key pages list</strong> — markdown links to your 5–15 most important pages with annotations</li>
                  <li><strong>Bot declarations</strong> — per-agent User-agent / Allow blocks for each major AI crawler</li>
                </ul>
                <h3>Optional elements</h3>
                <ul>
                  <li><strong>Optional section</strong> — secondary pages, changelogs, API docs, support resources</li>
                  <li><strong>Contact field</strong> — email or contact URL for AI engine operators</li>
                  <li><strong>License declaration</strong> — content usage terms (CC BY, proprietary, etc.)</li>
                  <li><strong>Language field</strong> — for multilingual sites serving multiple markets</li>
                </ul>
              </div>
              <div>
                <h3>File size guidelines</h3>
                <ul>
                  <li>Standard llms.txt: keep under 5KB for most LLM context windows</li>
                  <li>llms-full.txt: can be larger — used for comprehensive page indexes</li>
                  <li>Avoid duplicating your full sitemap — AI crawlers don't need every URL</li>
                  <li>Prioritise quality of page annotations over quantity of URLs listed</li>
                </ul>
                <h3>BLUF description tips</h3>
                <ul>
                  <li>One sentence, under 30 words</li>
                  <li>State what you do, who you help, and the primary outcome</li>
                  <li>Avoid marketing language — write for a machine, not a reader</li>
                  <li>Include your primary category keyword for classification accuracy</li>
                </ul>
              </div>
            </div>

            {/* CMS platform guides */}
            <h2>Deploying llms.txt by Platform</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem', margin: '1.25rem 0' }}>
              {[
                { platform: 'Next.js', steps: 'Place llms.txt in /public/. It will be served at /llms.txt automatically by Next.js static file serving. No configuration needed.' },
                { platform: 'WordPress', steps: 'Upload via Appearance → Theme Editor → root directory, or use the Yoast/Rank Math file manager. Alternatively FTP to /public_html/llms.txt.' },
                { platform: 'Webflow', steps: 'Go to Project Settings → Assets. Upload llms.txt, then set the URL to /llms.txt via the custom file manager in the Publishing panel.' },
                { platform: 'Shopify', steps: 'Add via Online Store → Themes → Edit Code → Assets. Or use a custom app to serve the file from the root path.' },
                { platform: 'Vercel', steps: 'Place in /public/llms.txt in your repo — it deploys automatically. Verify at your domain root after the next deploy.' },
                { platform: 'Netlify', steps: 'Place in the /public or root directory before build. Add a _redirects rule if you need to serve from a non-standard path.' },
              ].map(p => (
                <div key={p.platform} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.06em', textTransform: 'uppercase', color: C.violet, marginBottom: '.4rem' }}>{p.platform}</div>
                  <div style={{ fontSize: '.8rem', color: C.muted, lineHeight: 1.65 }}>{p.steps}</div>
                </div>
              ))}
            </div>

            {/* Related tools */}
            <h2>Related AEO Tools</h2>
            <p>llms.txt is one layer of technical AEO. These tools cover the rest:</p>
            <div className="tool-grid">
              {RELATED_TOOLS.map(t => (
                <Link key={t.href} href={t.href} className="tool-card">
                  <div className="tool-label">{t.label}</div>
                  <div className="tool-desc">{t.desc}</div>
                </Link>
              ))}
            </div>

            {/* Blog links */}
            <h2 style={{ marginTop: '2.5rem' }}>Further Reading</h2>
            {BLOG_LINKS.map((b, i) => (
              <Link key={i} href={b.href} className="blog-link">
                <span className="blog-arrow">→</span>
                <span>{b.label}</span>
              </Link>
            ))}

            {/* FAQ */}
            <h2 style={{ marginTop: '2.5rem' }}>Frequently Asked Questions</h2>
            <div>
              {FAQS.map((f, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">{f.q}</div>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>

            {/* Schema — already injected above, but add final CTA */}
            <div className="cta-banner" style={{ marginTop: '2.5rem' }}>
              <div className="cta-text">
                <strong style={{ color: C.text }}>Ready to complete your technical AEO setup?</strong><br />
                llms.txt + robots.txt + FAQPage schema covers the three fastest technical wins for AI citation improvement.
              </div>
              <Link href="/ai-visibility-tool" className="cta-btn">Check your AEO score →</Link>
            </div>

          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}