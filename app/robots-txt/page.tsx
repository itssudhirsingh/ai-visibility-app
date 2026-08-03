import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Free Robots.txt Generator for AI Bots — ChatGPT, Perplexity, Gemini | Notion Cue',
  description: 'Generate a robots.txt file that correctly allows or blocks AI crawlers — GPTBot, PerplexityBot, ClaudeBot, GoogleBot, Anthropic-AI and more. Blocking the wrong bots silently kills your AI visibility. Free, instant.',
  keywords: ['robots.txt generator','AI bots robots.txt','GPTBot robots.txt','block AI crawlers','allow ChatGPT crawling','PerplexityBot robots.txt','AEO robots.txt'],
  alternates: { canonical: 'https://notioncue.com/robots-txt' },
  openGraph: {
    title: 'Free Robots.txt Generator for AI Bots',
    description: 'Configure AI crawler access in seconds. Allow GPTBot, PerplexityBot, ClaudeBot and more — or block them by choice. Instant download.',
    type: 'website',
    url: 'https://notioncue.com/robots-txt',
  },
}

const FAQS = [
  { q: 'Which AI crawlers does robots.txt control?', a: 'All major AI engines respect robots.txt: GPTBot (OpenAI/ChatGPT), PerplexityBot (Perplexity), ClaudeBot (Anthropic), Googlebot (Google AI Overviews and AI Mode), Bingbot (Copilot), and Grok-Bot (xAI). If your robots.txt uses a wildcard Disallow: / or blocks these agents specifically, those engines cannot crawl or cite your content — regardless of how good it is.' },
  { q: 'Should I block or allow AI crawlers?', a: 'For most brands, allowing AI crawlers is the correct choice — it is a prerequisite for AI citations. If your robots.txt blocks GPTBot, ChatGPT cannot index your pages and will never cite you, regardless of content quality, schema markup, or any other AEO work. The only valid reason to block AI crawlers is if you actively do not want your content used in AI training data — a legitimate concern for some publishers and data-sensitive businesses.' },
  { q: 'Does blocking GPTBot stop ChatGPT from using my content?', a: 'It stops ChatGPT from crawling your pages going forward, but it does not remove content already in OpenAI\'s training data. For content removal from training data, you need to use OpenAI\'s opt-out process directly. For citation removal, blocking GPTBot prevents new indexing but doesn\'t erase existing citations immediately.' },
  { q: 'What\'s the difference between robots.txt and llms.txt?', a: 'robots.txt controls whether AI crawlers can access your pages at all — it\'s a permission gate. llms.txt is a separate file that tells AI engines what your site is about and how to categorise and cite it — it\'s a guidance document. Both work together: robots.txt opens the door, llms.txt tells the crawler where to go once inside.' },
  { q: 'Will this affect my Google rankings?', a: 'Blocking Googlebot in robots.txt will prevent Google from indexing your pages, which will remove them from search results. Do not use Disallow: / for Googlebot unless you intentionally want pages de-indexed. The generator creates targeted, agent-specific rules so your Googlebot access is never accidentally blocked.' },
  { q: 'How quickly does a robots.txt change take effect?', a: 'Most AI crawlers respect robots.txt changes within 24–48 hours. Googlebot may take 1–7 days depending on your crawl budget. Changes that allow previously blocked content will trigger recrawling, which can take weeks to fully propagate through training data — but citation improvements from newly allowed pages can appear on Perplexity in days.' },
]

const AI_BOTS = [
  { agent: 'GPTBot',         engine: 'ChatGPT (OpenAI)',    risk: 'HIGH',   note: 'Blocking silently kills ChatGPT citations. Most commonly blocked by accident via wildcard rules.' },
  { agent: 'PerplexityBot',  engine: 'Perplexity',          risk: 'HIGH',   note: 'Perplexity crawls in near real-time. Missing this is the fastest way to disappear from Perplexity answers.' },
  { agent: 'ClaudeBot',      engine: 'Anthropic Claude',    risk: 'HIGH',   note: 'Used by Claude for Browsing and citation. Separate from CCBot (training data only).' },
  { agent: 'Googlebot',      engine: 'AI Overviews + AI Mode', risk: 'HIGH', note: 'Drives all Google AI features. Blocking this removes you from Google entirely, not just AI.' },
  { agent: 'Bingbot',        engine: 'Copilot (Microsoft)', risk: 'MED',    note: 'Copilot is powered by Bing index. Block Bingbot and Copilot cannot cite you.' },
  { agent: 'Grok-Bot',       engine: 'Grok (xAI)',          risk: 'MED',    note: 'Newer agent — often missing from legacy robots.txt files. Add explicitly to cover xAI.' },
  { agent: 'CCBot',          engine: 'Common Crawl (training)', risk: 'LOW', note: 'Used for AI training data, not live citation. Blocking this does not prevent citations but may affect future model training.' },
  { agent: 'anthropic-ai',   engine: 'Anthropic (training)', risk: 'LOW',   note: 'Anthropic\'s training crawler. Separate from ClaudeBot which drives live citations.' },
]

export default function RobotsTxtPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notioncue.com' },
      { '@type': 'ListItem', position: 2, name: 'Robots.txt Generator', item: 'https://notioncue.com/robots-txt' },
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <style>{PAGE_STYLES}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader />
        <SubNavClient />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          {/* Hero */}
          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW}>Free Tool</div>
            <h1 style={H1}>Robots.txt<br /><span style={{ color: 'var(--accent)' }}>Generator</span></h1>
            <p style={LEAD}>
              Generate a robots.txt file that correctly configures AI crawler access — GPTBot, PerplexityBot, ClaudeBot, Googlebot and more. A misconfigured robots.txt is the most common reason brands rank on Google but disappear entirely from AI answers. Fix it in 30 seconds.
            </p>
          </div>

          {/* Generator placeholder — replace with actual RobotsTxtClient when built */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2rem', maxWidth: 640 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: '1.25rem' }}>Configure AI crawler access</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginBottom: '1.5rem' }}>
                {AI_BOTS.slice(0, 6).map(b => (
                  <div key={b.agent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem .85rem', background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: 'var(--text)', marginBottom: '.15rem' }}>{b.agent}</div>
                      <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)' }}>{b.engine}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', textTransform: 'uppercase', color: b.risk === 'HIGH' ? '#f87171' : b.risk === 'MED' ? '#c8f247' : 'rgba(255,255,255,.4)', background: b.risk === 'HIGH' ? 'rgba(248,113,113,.08)' : b.risk === 'MED' ? 'rgba(200,242,71,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${b.risk === 'HIGH' ? 'rgba(248,113,113,.2)' : b.risk === 'MED' ? 'rgba(200,242,71,.2)' : 'rgba(255,255,255,.1)'}`, padding: '.15rem .45rem', borderRadius: '4px' }}>{b.risk}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: '#4ade80' }}>Allow</span>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ background: 'var(--accent)', color: '#07100b', border: 'none', borderRadius: '10px', padding: '.85rem 1.75rem', fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}>
                Generate robots.txt →
              </button>
            </div>
          </div>

          {/* AI bots reference */}
          <section style={SECTION}>
            <div style={EYEBROW}>AI bot reference</div>
            <h2 style={H2}>Every AI crawler you need to know,<br /><span style={{ color: 'var(--muted)' }}>ranked by citation impact.</span></h2>
            <p style={{ ...PROSE, maxWidth: 680, marginBottom: '2rem' }}>
              Each AI engine sends its own crawler with a distinct user-agent string. Your robots.txt must explicitly name these agents — a generic Disallow: / rule blocks all of them simultaneously, and many legacy robots.txt files from 2022–2023 were written before most of these crawlers existed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 1fr', gap: '1rem', padding: '.6rem 1rem', background: 'rgba(255,255,255,.02)', borderRadius: '8px 8px 0 0', borderBottom: '1px solid var(--border)' }}>
                {['Bot name', 'Powers', 'Risk', 'Note'].map(h => (
                  <div key={h} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{h}</div>
                ))}
              </div>
              {AI_BOTS.map((b, i) => (
                <div key={b.agent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 1fr', gap: '1rem', padding: '.75rem 1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: i === AI_BOTS.length - 1 ? '0 0 8px 8px' : '0', alignItems: 'start' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', color: 'var(--text)' }}>{b.agent}</div>
                  <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.65)' }}>{b.engine}</div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', textTransform: 'uppercase', color: b.risk === 'HIGH' ? '#f87171' : b.risk === 'MED' ? '#c8f247' : 'rgba(255,255,255,.4)', background: b.risk === 'HIGH' ? 'rgba(248,113,113,.08)' : b.risk === 'MED' ? 'rgba(200,242,71,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${b.risk === 'HIGH' ? 'rgba(248,113,113,.2)' : b.risk === 'MED' ? 'rgba(200,242,71,.2)' : 'rgba(255,255,255,.1)'}`, padding: '.15rem .45rem', borderRadius: '4px', alignSelf: 'start' }}>{b.risk}</span>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.55 }}>{b.note}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Why robots.txt matters for AEO */}
          <section style={SECTION}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <div>
                <div style={EYEBROW}>The silent AEO killer</div>
                <h2 style={H2}>Good content, great schema,<br /><span style={{ color: 'var(--muted)' }}>zero citations — here's why.</span></h2>
                <p style={PROSE}>
                  The most common AEO diagnostic finding is a brand that has correctly implemented schema markup, maintains an active content strategy, and has strong E-E-A-T signals — but still gets zero citations from ChatGPT or Perplexity. The culprit, in almost every case, is a robots.txt file that blocks the relevant AI crawler.
                </p>
                <p style={PROSE}>
                  This happens because most robots.txt files were written for the Google-and-Bing era of 2015–2022. The bot names GPTBot, PerplexityBot, and ClaudeBot didn't exist then. Many sites use wildcard rules or blocking patterns that silently catch all new crawlers — including every AI bot launched in the last three years.
                </p>
                <p style={PROSE}>
                  Fixing robots.txt is the fastest AEO win available. A single file change can immediately restore AI crawler access, and citation improvements from newly accessible content can appear on Perplexity within days. Use the <a href="/llms-txt-live-validator" style={{ color: 'var(--violet)' }}>llms.txt Validator</a> to confirm your configuration after updating.
                </p>
              </div>
              <div>
                <div style={{ background: 'rgba(248,113,113,.04)', border: '1px solid rgba(248,113,113,.15)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f87171', marginBottom: '1rem' }}>Common robots.txt mistakes</div>
                  {[
                    { mistake: 'User-agent: * / Disallow: /', effect: 'Blocks all crawlers including every AI bot' },
                    { mistake: 'Missing GPTBot entirely', effect: 'ChatGPT cannot cite you — it defaults to blocked' },
                    { mistake: 'Blocking /api/ paths', effect: 'Some AI crawlers use API endpoints for structured data' },
                    { mistake: 'Using noindex meta instead of robots.txt', effect: 'Meta noindex doesn\'t block crawling, only indexing' },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '.6rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: '#f87171', marginBottom: '.2rem' }}>{m.mistake}</div>
                      <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)' }}>{m.effect}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.15)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '.85rem' }}>Correct configuration (example)</div>
                  <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.75, margin: 0 }}>{`User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Grok-Bot
Allow: /

User-agent: *
Disallow: /admin/
Disallow: /api/private/`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Robots.txt + llms.txt together */}
          <section style={SECTION}>
            <div style={EYEBROW}>The full AEO crawler setup</div>
            <h2 style={H2}>robots.txt + llms.txt<br /><span style={{ color: 'var(--muted)' }}>work as a pair.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
              {[
                { step: '01', title: 'Configure robots.txt', desc: 'Allow GPTBot, PerplexityBot, ClaudeBot and other AI agents. This opens the door for crawlers.', href: '/robots-txt', cta: 'Generate robots.txt' },
                { step: '02', title: 'Add llms.txt', desc: 'Create the AI-readable index of your site that tells crawlers what you cover and how to cite you.', href: '/llms-text-generator', cta: 'Generate llms.txt' },
                { step: '03', title: 'Validate setup', desc: 'Use the live validator to confirm both files are correctly configured and AI bots can access all key pages.', href: '/llms-txt-live-validator', cta: 'Validate now' },
              ].map(s => (
                <div key={s.step} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.4rem', fontWeight: 500, color: 'var(--accent)', marginBottom: '.75rem' }}>{s.step}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', marginBottom: '.5rem' }}>{s.title}</div>
                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, marginBottom: '1rem' }}>{s.desc}</p>
                  <a href={s.href} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.04em', color: 'var(--violet)', textDecoration: 'none' }}>{s.cta} →</a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ padding: '5rem 0 6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={EYEBROW}>FAQ</div>
              <h2 style={{ ...H2, marginBottom: 0 }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            </div>
            <ClusterFAQClient faqs={FAQS} />
          </section>

        </div>
        <SharedFooter />
      </div>
    </>
  )
}

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--text:#ffffff;--muted:rgba(255,255,255,0.88);--accent:#c8f247;--violet:#7b6cff;}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}button,select{cursor:pointer;font-family:inherit}
  input:focus,button:focus{outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
`
const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '620px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }