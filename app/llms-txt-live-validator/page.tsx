import SharedHeader from '@/components/SharedHeader'
import JsonLd from '@/components/JsonLd'
import { toolPageSchema } from '@/lib/schema'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import LlmsValidatorClient from '@/components/LLMSValidatorClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'
import Link from 'next/link'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'llms.txt Live Validator — Check Any Domain\'s AI Bot Configuration | Notion Cue',
  description: 'Live-fetch and validate any domain\'s llms.txt file. Checks format, bot declarations, and robots.txt conflicts for GPTBot, PerplexityBot, ClaudeBot, and 5 more. Free tool — audit your own site or monitor competitors.',
  keywords: ['llms.txt validator','llms.txt checker','AI bot configuration','GPTBot access check','llms.txt format','AEO technical audit','AI crawler validator'],
  alternates: { canonical: 'https://notioncue.com/llms-txt-live-validator' },
  openGraph: {
    title: 'llms.txt Live Validator — Check AI Bot Access for Any Domain',
    description: 'Live-fetch and validate llms.txt for any domain. Checks 8 AI bots, flags robots.txt conflicts, detects misconfigurations. Free.',
    type: 'website',
    url: 'https://notioncue.com/llms-txt-live-validator',
  },
}

const FAQS = [
  { q: 'What is llms.txt and why does it matter for AEO?', a: 'llms.txt is a plain text file at yourdomain.com/llms.txt that tells AI crawlers how to access and use your content. It works alongside robots.txt — where robots.txt controls what bots can crawl, llms.txt declares your content\'s availability for AI training and retrieval. Sites with a correctly formatted llms.txt signal technical maturity to AI engines and explicitly allow the bots most responsible for citation in answers.' },
  { q: 'What\'s the difference between this validator and the llms.txt generator?', a: 'The generator creates a new llms.txt file from scratch for your domain. This validator reads and audits an existing one — checking the live file at any domain, not just yours. Use it to verify your own file after deployment, to monitor competitors\' AEO posture, or to diagnose why a specific bot might still be blocked despite an apparently correct configuration.' },
  { q: 'Which AI bots does the validator check?', a: 'GPTBot (ChatGPT), PerplexityBot, ClaudeBot, Google-Extended (Gemini), Amazonbot, Bytespider, FacebookBot, and CCBot. These cover the crawlers responsible for the majority of AI engine citation behaviour. The validator checks both the llms.txt declarations and the robots.txt rules for each, flagging any conflicts between the two files.' },
  { q: 'What does a conflict between llms.txt and robots.txt mean?', a: 'A conflict means your llms.txt allows a bot while your robots.txt blocks it, or vice versa. Robots.txt takes precedence for crawl access — so a bot allowed in llms.txt but blocked in robots.txt still can\'t reach your pages. These conflicts are one of the most common reasons sites have correct-looking configurations but zero AI citations.' },
  { q: 'Can I use this to audit competitor sites?', a: 'Yes — enter any domain. This is useful for understanding competitors\' AEO posture: which bots they\'re explicitly allowing or blocking, whether they have a correctly formatted llms.txt, and where they have conflicts that leave them vulnerable to citation displacement.' },
  { q: 'What happens if a domain has no llms.txt at all?', a: 'The validator reports "file not found" and shows you what the missing file should contain. Absence of llms.txt doesn\'t automatically block AI crawlers — robots.txt still controls that — but it removes one signal of technical AEO maturity and means AI engines have less guidance on how to categorise and cite your content. Generate one free with the llms.txt Generator.' },
]

const BOTS = [
  { bot: 'GPTBot',         engine: 'ChatGPT',          color: '#10a37f', priority: 'Critical', desc: 'OpenAI\'s primary crawler. Blocking GPTBot means ChatGPT cannot include your content in browse-mode or retrieval responses. The highest-priority bot to allow.' },
  { bot: 'PerplexityBot',  engine: 'Perplexity',       color: '#ff6b35', priority: 'Critical', desc: 'Perplexity fetches live content for every answer. Near-real-time indexing — fixing access here shows the fastest citation results.' },
  { bot: 'ClaudeBot',      engine: 'Anthropic Claude', color: '#d97706', priority: 'High',     desc: 'Anthropic\'s crawler for Browsing and citation. Distinct from CCBot which is training-only. Increasingly used for research queries.' },
  { bot: 'Google-Extended', engine: 'Gemini / AI Overviews', color: '#4285f4', priority: 'High', desc: 'Google\'s AI training crawler. Distinct from Googlebot — blocking this while allowing Googlebot is a common and impactful misconfiguration.' },
  { bot: 'Grok-Bot',       engine: 'Grok (xAI)',       color: '#1d9bf0', priority: 'High',     desc: 'xAI\'s crawler for Grok citation. Often missing from legacy llms.txt files written before mid-2024.' },
  { bot: 'Amazonbot',      engine: 'Alexa / Kendra',   color: '#ff9900', priority: 'Medium',   desc: 'Powers Amazon Kendra enterprise search and Alexa voice answers.' },
  { bot: 'FacebookBot',    engine: 'Meta AI',           color: '#1877f2', priority: 'Medium',   desc: 'Meta\'s crawler for training AI systems across Facebook and Instagram.' },
  { bot: 'CCBot',          engine: 'Common Crawl',      color: '#7b6cff', priority: 'Low',      desc: 'Feeds multiple open-weight models. Blocking this doesn\'t prevent live citations but may affect future model training.' },
]

const RELATED_TOOLS = [
  { label: 'llms.txt Generator',    href: '/llms-text-generator',          desc: 'Build a correctly formatted llms.txt from scratch' },
  { label: 'Robots.txt Generator',  href: '/robots-txt',                   desc: 'Configure AI crawler access in robots.txt' },
  { label: 'AI Visibility Checker', href: '/ai-visibility-tool',           desc: 'Full AEO score across 6 LLMs' },
  { label: 'Schema Generator',      href: '/ai-schema-markup-generator',   desc: 'Add structured data to key pages' },
  { label: 'AI Visibility Heatmap', href: '/ai-visibility-heatmap',        desc: 'Map all pages by citation potential' },
  { label: 'E-E-A-T Checker',       href: '/ai-eeat-checker',              desc: 'Score authority signals across all pillars' },
]

export default function LlmsValidatorPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notioncue.com' },
      { '@type': 'ListItem', position: 2, name: 'llms.txt Validator', item: 'https://notioncue.com/llms-txt-live-validator' },
    ]
  }

  return (
    <>
      <JsonLd schema={toolPageSchema(
        { name: 'llms.txt Live Validator', description: 'Live-fetch and validate any domain llms.txt — checks all 8 AI bot declarations and flags robots.txt conflicts.', abstract: 'Live validation of any domain llms.txt — checks all 8 AI crawlers and flags robots.txt conflicts.', featureList: ['Live llms.txt fetch', '8 AI bot declaration checks', 'robots.txt conflict detection', 'Competitor monitoring'], path: '/llms-txt-live-validator' },
        FAQS,
        [{ name: 'llms.txt Validator', path: '/llms-txt-live-validator' }],
      )} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <style>{STYLES}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader /><SubNavClient />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          {/* Hero */}
          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EY}>Free Tool</div>
            <h1 style={H1}>llms.txt<br /><span style={{ color: 'var(--accent)' }}>Live Validator</span></h1>
            <p style={LEAD}>Enter any domain and live-fetch their actual llms.txt. Validates format, checks every major AI bot declaration, and flags conflicts with robots.txt — for your own site or any competitor.</p>
          </div>

          {/* Tool */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <LlmsValidatorClient />
          </div>

          {/* 3 use cases */}
          <section style={SEC}>
            <div style={EY}>How to use this tool</div>
            <h2 style={H2}>Three things you can do<br /><span style={{ color: 'var(--muted)' }}>with this validator.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { icon: '🔍', title: 'Audit your own site', desc: 'After deploying a new or updated llms.txt, run the validator to confirm the file is live, correctly formatted, and that there are no robots.txt conflicts that would nullify its bot declarations.' },
                { icon: '🔎', title: 'Check competitors', desc: 'Enter any competitor domain to see their AI bot configuration. A competitor with a broken llms.txt or blocking robots.txt rule is effectively invisible to AI engines — that\'s a citation gap you can fill.' },
                { icon: '⚠️', title: 'Diagnose missing citations', desc: 'If your domain has good AEO scores but low actual citation rates, a conflict between llms.txt and robots.txt is one of the most common silent causes. The validator surfaces these mismatches with a specific fix for each.' },
              ].map(s => (
                <div key={s.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '.85rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '1rem', marginBottom: '.6rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* What is llms.txt */}
          <section style={SEC}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div style={EY}>What is llms.txt</div>
                <h2 style={H2}>The standard that tells AI<br /><span style={{ color: 'var(--muted)' }}>what it's allowed to read.</span></h2>
                <p style={PR}>llms.txt is an emerging specification, analogous to robots.txt, that gives website owners a structured way to declare their content's availability for AI training, retrieval, and citation. Where robots.txt controls crawl access at the page level, llms.txt operates at the intent level — telling AI systems what the site is, what it covers, and how its content should be used.</p>
                <p style={PR}>The file lives at the root of your domain, is plain text, and follows a simple key-value format. A well-formed llms.txt includes the site name, a description of what the site covers, contact information, and per-bot Allow or Disallow declarations. Engines that support llms.txt — including GPTBot and PerplexityBot — check for the file before indexing content.</p>
                <p style={PR}>Sites with a correctly formatted llms.txt consistently show higher citation rates than comparable sites without one — the signal it sends about technical AEO maturity compounds over time. Generate one free with the <Link href="/llms-text-generator" style={{ color: 'var(--violet)', textDecoration: 'none' }}>llms.txt Generator</Link>.</p>
              </div>
              <div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ padding: '.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.45)' }}>yourdomain.com/llms.txt — correct format</div>
                  <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', lineHeight: 1.8, color: 'rgba(255,255,255,.7)', padding: '1.25rem', margin: 0, overflowX: 'auto' }}>{`# llms.txt

Name: Your Brand
Description: What your site covers
Contact: hello@yourdomain.com

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Grok-Bot
Allow: /`}</pre>
                </div>
                <div style={{ background: 'rgba(248,113,113,.04)', border: '1px solid rgba(248,113,113,.15)', borderRadius: '12px', padding: '1.1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f87171', marginBottom: '.65rem' }}>Most common conflict (and fix)</div>
                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.65, marginBottom: '.5rem' }}>llms.txt says <code style={{ fontFamily: "'JetBrains Mono',monospace", color: '#c8f247' }}>Allow: GPTBot</code> but robots.txt has <code style={{ fontFamily: "'JetBrains Mono',monospace", color: '#f87171' }}>Disallow: /</code> for all agents.</p>
                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.65, margin: 0 }}>Fix: add explicit <code style={{ fontFamily: "'JetBrains Mono',monospace", color: '#4ade80' }}>User-agent: GPTBot / Allow: /</code> block in robots.txt above the wildcard rule.</p>
                </div>
              </div>
            </div>
          </section>

          {/* llms.txt vs robots.txt deep comparison */}
          <section style={SEC}>
            <div style={EY}>llms.txt vs robots.txt</div>
            <h2 style={H2}>Two files. Different jobs.<br /><span style={{ color: 'var(--muted)' }}>Both required for full AEO coverage.</span></h2>
            <p style={{ ...PR, maxWidth: 700, marginBottom: '2rem' }}>Many SEO professionals assume that allowing AI bots in robots.txt is sufficient. It isn't. llms.txt and robots.txt serve different purposes and both are needed for a complete AI visibility configuration.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--card)', border: '1px solid rgba(200,242,71,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>robots.txt — Access control</div>
                {['Controls whether a bot can crawl your pages at all', 'Applies at the URL / path level', 'Must not block GPTBot, PerplexityBot, ClaudeBot, Grok-Bot', 'Takes precedence over llms.txt when there\'s a conflict', 'Standard — every bot respects it', 'Does not tell AI what your site is about'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '.5rem', fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.3rem' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✦</span>{p}
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid rgba(34,211,238,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#22d3ee', marginBottom: '1rem' }}>llms.txt — Intent declaration</div>
                {['Declares what your site is and what it covers', 'Operates at the site level, not URL level', 'Tells AI systems how to categorise and cite you', 'Can be overridden by robots.txt (access trumps intent)', 'Emerging standard — not all bots support it yet', 'Adds topical authority signal for AEO scoring'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '.5rem', fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.3rem' }}>
                    <span style={{ color: '#22d3ee', flexShrink: 0 }}>✦</span>{p}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(200,242,71,.04)', border: '1px solid rgba(200,242,71,.15)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '.65rem' }}>Correct setup = both files configured</div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <Link href="/robots-txt" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--violet)', textDecoration: 'none' }}>Generate robots.txt →</Link>
                <Link href="/llms-text-generator" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--violet)', textDecoration: 'none' }}>Generate llms.txt →</Link>
              </div>
            </div>
          </section>

          {/* The 8 bots */}
          <section style={SEC}>
            <div style={EY}>The 8 AI bots we check</div>
            <h2 style={H2}>Each bot has a different role<br /><span style={{ color: 'var(--muted)' }}>in the citation pipeline.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginTop: '2rem' }}>
              {BOTS.map(b => (
                <div key={b.bot} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.65rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${b.color}18`, border: `1px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: b.color }}>{b.bot.slice(0, 2)}</div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: '#fff', fontWeight: 600 }}>{b.bot}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.45)' }}>{b.engine}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', textTransform: 'uppercase', color: b.priority === 'Critical' ? '#f87171' : b.priority === 'High' ? '#c8f247' : b.priority === 'Medium' ? '#45e4ff' : 'rgba(255,255,255,.4)', background: b.priority === 'Critical' ? 'rgba(248,113,113,.08)' : b.priority === 'High' ? 'rgba(200,242,71,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${b.priority === 'Critical' ? 'rgba(248,113,113,.2)' : b.priority === 'High' ? 'rgba(200,242,71,.2)' : 'rgba(255,255,255,.1)'}`, padding: '.15rem .45rem', borderRadius: 4, display: 'inline-block', marginBottom: '.55rem' }}>{b.priority}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* When to validate */}
          <section style={SEC}>
            <div style={EY}>When to run the validator</div>
            <h2 style={H2}>Four situations that need<br /><span style={{ color: 'var(--muted)' }}>an immediate validation check.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
              {[
                { title: 'Before or after site launch', desc: 'Confirm llms.txt is live and correctly formatted before launch day. A 404 on /llms.txt is easy to miss in pre-launch QA and leaves the site invisible to AI crawlers from day one.' },
                { title: 'After a CMS or hosting migration', desc: 'Platform migrations often break root-level files. llms.txt and robots.txt are both easy to lose — validate both immediately after any significant site infrastructure change.' },
                { title: 'When citation rates suddenly drop', desc: 'If your AI citation rate drops with no obvious content changes, a broken llms.txt or a new robots.txt rule blocking AI bots is one of the first places to check.' },
                { title: 'Competitive intelligence', desc: 'Knowing a competitor has blocked GPTBot while you have it allowed is actionable data. Their ChatGPT citations decline; yours fill the gap if your content is strong enough.' },
              ].map(s => (
                <div key={s.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.9rem', color: 'var(--accent)', marginBottom: '.4rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Related tools */}
          <section style={SEC}>
            <div style={EY}>Complete your technical AEO setup</div>
            <h2 style={H2}>Tools to use alongside<br /><span style={{ color: 'var(--muted)' }}>the validator.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginTop: '2rem' }}>
              {RELATED_TOOLS.map(t => (
                <Link key={t.href} href={t.href} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.35rem' }}>{t.label}</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{t.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog */}
          <section style={SEC}>
            <div style={EY}>Further reading</div>
            <h2 style={H2}>llms.txt and technical AEO<br /><span style={{ color: 'var(--muted)' }}>from the Notion Cue blog.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1.5rem' }}>
              {[
                { label: 'llms.txt: the complete implementation guide for 2026', href: '/blog/llms-txt-guide' },
                { label: 'robots.txt for AI crawlers: what changed in 2025', href: '/blog' },
                { label: 'Why 94% of AI-cited pages have structured data', href: '/blog/structured-data-ai-citations' },
                { label: 'The technical AEO checklist: 12 fixes before you publish', href: '/blog' },
              ].map((b, i) => (
                <Link key={i} href={b.href} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', fontSize: '.85rem', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem' }}>→</span>
                  {b.label}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ ...SEC, textAlign: 'center', paddingBottom: '6rem' }}>
            <div style={EY}>FAQ</div>
            <h2 style={{ ...H2, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS} />
          </section>
        </div>
        <SharedFooter />
      </div>
    </>
  )
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;}
  html{scroll-behavior:smooth}body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}button,select{cursor:pointer;font-family:inherit}
  input:focus,button:focus{outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
`
const EY: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '620px' }
const PR: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, marginBottom: '1rem' }
const SEC: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }