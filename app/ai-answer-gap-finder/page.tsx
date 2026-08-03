import SharedHeader from '@/components/SharedHeader'
import JsonLd from '@/components/JsonLd'
import { toolPageSchema } from '@/lib/schema'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import GapFinderClient from '@/components/GapFinderClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'
import Link from 'next/link'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'AI Answer Gap Finder — Find Questions AI Engines Answer Where No Brand Is Cited | Notion Cue',
  description: 'Find the top 20 questions AI engines answer in your niche where no brand is consistently cited — or where a weak competitor can be displaced. First-mover and displacement gaps, scored and briefed. Free.',
  keywords: ['AI answer gap finder','AEO content gaps','AI citation gaps','content gap analysis AI','answer engine gap','unclaimed AI citations','ChatGPT citation gaps'],
  alternates: { canonical: 'https://notioncue.com/ai-answer-gap-finder' },
  openGraph: {
    title: 'AI Answer Gap Finder — Unclaimed Citation Opportunities in Your Niche',
    description: '20 AI citation gaps per scan — first-mover opportunities where no brand is cited, and displacement gaps where a weak competitor can be beaten. Free.',
    type: 'website',
    url: 'https://notioncue.com/ai-answer-gap-finder',
  },
}

const FAQS = [
  { q: 'What is an AI answer gap?', a: 'An AI answer gap is a question that AI engines like ChatGPT, Perplexity, and Gemini likely answer regularly, but where our model estimates no brand is consistently cited as the source — based on training-data patterns, not a live check of current outputs. These are first-mover opportunities: the first domain to publish a well-structured, BLUF-formatted page targeting that question can claim the citation before competitors do. A displacement gap is similar: a competing brand is cited, but their content has structural weaknesses a better-structured page from you could displace.' },
  { q: 'How is this different from keyword gap analysis?', a: 'Keyword gap analysis finds search terms your competitors rank for that you don\'t. AI answer gap analysis finds questions AI engines answer in your niche where the citation slot is either empty or weakly held. These are different datasets. A query can have high search volume and zero AI citation potential, or low search volume and extremely high citation potential because it\'s a definitional or how-to question that LLMs quote directly. The gap finder prioritises the second type.' },
  { q: 'Should I enter my domain or just a niche description?', a: 'Both work. If you enter your domain, the tool fetches your homepage content to infer your niche automatically. If you enter a niche description directly, you get gaps for that topic regardless of what\'s on your site — useful for exploring a new content vertical before committing to it.' },
  { q: 'What does the opportunity score mean?', a: 'The opportunity score (0–100) combines gap type, estimated search volume, query intent, and content competition level. A first-mover gap with high search volume and a how-to intent scores near 100 — these are the highest-leverage pieces to create. A displacement gap with low volume and strong competitor content scores lower, even though it\'s still a real opportunity.' },
  { q: 'How do I use the results with the BLUF Builder?', a: 'Take any gap from this tool and paste the question directly into the BLUF Builder as your page\'s topic. The builder generates three angled 30–50 word openings — direct, benefit-led, and question-led — pre-structured for AI citation. Use the output as the first paragraph of the page you create to target that gap.' },
  { q: 'How quickly can I claim a first-mover gap?', a: 'The gap between publishing and seeing citations varies by engine. Perplexity indexes in near real-time — you can appear in Perplexity answers within days of publishing a well-structured page. ChatGPT works from training data snapshots, so citation there may take weeks to months. Gemini\'s AI Overviews typically lag 1–4 weeks. The fastest path is a correctly structured page with FAQPage schema, a BLUF opening, and AI bot access confirmed in robots.txt.' },
]

const RELATED_TOOLS = [
  { label: 'BLUF Builder',            href: '/bluf-builder',                 desc: 'Write citation-ready openings for every gap you find' },
  { label: 'AI Visibility Checker',   href: '/ai-visibility-tool',           desc: 'See your full AEO score across 6 LLMs' },
  { label: 'Schema Generator',        href: '/ai-schema-markup-generator',   desc: 'Add FAQPage schema to each new page you create' },
  { label: 'E-E-A-T Checker',         href: '/ai-eeat-checker',              desc: 'Score authority signals before publishing gap content' },
  { label: 'Topic Cluster Map',       href: '/topic-cluster-generator',      desc: 'Turn gap findings into a full content cluster' },
  { label: 'AI Visibility Heatmap',   href: '/ai-visibility-heatmap',        desc: 'Map existing pages by citation potential' },
]

export default function GapFinderPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notioncue.com' },
      { '@type': 'ListItem', position: 2, name: 'AI Answer Gap Finder', item: 'https://notioncue.com/ai-answer-gap-finder' },
    ]
  }

  return (
    <>
      <JsonLd schema={toolPageSchema(
        { name: 'AI Answer Gap Finder', description: 'AI-estimated questions in your niche where no brand is consistently cited — or where a weak competitor can be displaced.', abstract: 'Uncover AI citation gaps — queries where engines answer without a clear leader, or where you can displace a weak competitor.', featureList: ['AI-estimated citation gap detection', 'Competitor displacement analysis', 'First-mover opportunity scoring', 'BLUF content brief per gap'], path: '/ai-answer-gap-finder' },
        FAQS,
        [{ name: 'AI Answer Gap Finder', path: '/ai-answer-gap-finder' }],
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
            <h1 style={H1}>AI Answer<br /><span style={{ color: 'var(--accent)' }}>Gap Finder</span></h1>
            <p style={LEAD}>Find the 20 questions AI engines likely answer in your niche where no brand is consistently cited — or where a competitor holds a weak citation you can displace. Each gap includes a winning content angle, recommended format, and opportunity score.</p>
          </div>

          {/* Tool */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <GapFinderClient />
          </div>

          {/* How to use */}
          <section style={SEC}>
            <div style={EY}>How to use this tool</div>
            <h2 style={H2}>Find a gap, brief the content,<br /><span style={{ color: 'var(--muted)' }}>claim the citation.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '2rem' }}>
              {[
                { n: '01', title: 'Enter domain or niche', desc: 'Paste your domain for auto-detection, or describe your niche directly. Add competitor URLs for displacement gap analysis.' },
                { n: '02', title: 'Review 20 gaps', desc: 'Sort by opportunity score or search volume. Filter between first-mover (unclaimed) and displacement (weakly held) gaps.' },
                { n: '03', title: 'Copy the brief', desc: 'Each gap has a Copy brief button that copies the question, format, word count, schema recommendation, and winning angle in one click.' },
                { n: '04', title: 'Write and publish', desc: 'Use the BLUF Builder to generate your opening paragraph, add FAQPage schema, and publish. Check citation status weekly.' },
              ].map(s => (
                <div key={s.n} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'var(--accent)', marginBottom: '.65rem' }}>{s.n}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', marginBottom: '.5rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Why gaps exist */}
          <section style={SEC}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div style={EY}>Why AI answer gaps exist</div>
                <h2 style={H2}>AI search is three years old.<br /><span style={{ color: 'var(--muted)' }}>Most niches are still wide open.</span></h2>
                <p style={PR}>AI answer engines have existed in their current form since late 2022. Three years is not long enough for any niche to be fully saturated with well-structured, citation-ready content. In most B2B and B2C categories, the majority of questions AI engines answer are either pulling from weak, thin content or from no clearly identifiable source at all.</p>
                <p style={PR}>This is fundamentally different from traditional SEO, where competitive niches have been optimised since the late 1990s. In AI search, the equivalent of ranking — being the cited source — is still available for surprisingly competitive queries if your content is structured correctly.</p>
                <p style={PR}>The window is narrowing. The brands moving now claim the high-volume, high-intent gaps before competitors recognise the opportunity. The Gap Finder surfaces exactly these windows — ranked by value and urgency.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(200,242,71,.05)', border: '1px solid rgba(200,242,71,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '.75rem' }}>First-mover gaps</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>Our model estimates no brand is consistently cited when AI engines answer this question. The first domain to publish a well-structured page targeting it has a strong chance to claim the citation slot before any competitor does.</p>
                </div>
                <div style={{ background: 'rgba(244,114,182,.05)', border: '1px solid rgba(244,114,182,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f472b6', marginBottom: '.75rem' }}>Displacement gaps</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>A competitor is estimated to be cited, but their page has structural weaknesses — no BLUF opening, no schema, thin content. A better-structured page from you can compete for that slot.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4 factors */}
          <section style={SEC}>
            <div style={EY}>How AI engines decide what to cite</div>
            <h2 style={H2}>Four factors determine<br /><span style={{ color: 'var(--muted)' }}>which page wins the citation.</span></h2>
            <p style={{ ...PR, maxWidth: 700, marginBottom: '2rem' }}>Understanding why gaps exist tells you exactly how to close them. AI engines follow identifiable patterns that map directly to the content and technical decisions you make when publishing.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
              {[
                { icon: '⚡', title: 'Query-answer match', desc: 'The page that answers the question most directly in its first sentence wins citation over a page that answers it in paragraph three — regardless of authority or total content volume. This is the single most fixable factor, and the one most sites ignore. Use the BLUF Builder to rewrite page openings for direct answer-first structure.' },
                { icon: '🏗', title: 'Content structure', desc: 'FAQ blocks, numbered lists, and clear heading hierarchy help models extract clean, quotable answers. Pages structured for scanning outperform pages structured for narrative reading, even when the underlying information is identical. FAQPage schema amplifies this by giving models a pre-parsed question-answer pair to extract directly.' },
                { icon: '🏅', title: 'Domain authority', desc: 'When two pages are structurally similar, the domain with more E-E-A-T signals, backlinks, and consistent external mentions wins. Authority matters — but it\'s the tiebreaker, not the primary signal for most gap opportunities. New brands with well-structured content regularly displace authoritative brands with poorly structured pages.' },
                { icon: '⚙️', title: 'Technical access', desc: 'A page blocked in robots.txt for AI bots, served only via JavaScript, or sitting behind a login wall simply cannot be cited. Check that GPTBot, PerplexityBot, and ClaudeBot are all allowed in your robots.txt — use our free Robots.txt Generator to verify and fix your configuration.' },
              ].map(f => (
                <div key={f.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', marginBottom: '.4rem' }}>{f.title}</div>
                    <div style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gap to content workflow */}
          <section style={SEC}>
            <div style={EY}>Gap-to-citation workflow</div>
            <h2 style={H2}>From gap discovery to<br /><span style={{ color: 'var(--muted)' }}>live citation in 5 steps.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginTop: '2rem' }}>
              {[
                { step: '01', action: 'Run the Gap Finder', detail: 'Enter your domain or niche. Sort results by opportunity score and pick the top 5 first-mover gaps to pursue first.', tool: null },
                { step: '02', action: 'Write the BLUF opening', detail: 'Paste the gap question into the BLUF Builder. Use the question-led variant as your first paragraph — it matches the exact query format AI engines use to find citation sources.', tool: { label: 'BLUF Builder →', href: '/bluf-builder' } },
                { step: '03', action: 'Add FAQPage schema', detail: 'Use the Schema Generator to create a FAQPage block for the page. Include the gap question and a direct 2–3 sentence answer. Pages with FAQPage schema are cited at 3.2× the rate of equivalent unstructured pages.', tool: { label: 'Schema Generator →', href: '/ai-schema-markup-generator' } },
                { step: '04', action: 'Confirm crawler access', detail: 'Check that GPTBot, PerplexityBot, and ClaudeBot are allowed in your robots.txt. One blocked crawler = one engine that can never cite you, regardless of content quality.', tool: { label: 'Robots.txt Generator →', href: '/robots-txt' } },
                { step: '05', action: 'Track citation status', detail: 'Run the AI Visibility Checker 2–4 weeks after publishing. Perplexity typically indexes within days. ChatGPT may take weeks. The Query Probes tab shows the exact AI response text so you can see when and how you\'re being cited.', tool: { label: 'AI Visibility Checker →', href: '/ai-visibility-tool' } },
              ].map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', alignItems: 'start' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.85rem', color: 'var(--accent)' }}>{s.step}</div>
                  <div>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.93rem', marginBottom: '.3rem' }}>{s.action}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: s.tool ? '.6rem' : 0 }}>{s.detail}</div>
                    {s.tool && <Link href={s.tool.href} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'var(--violet)', textDecoration: 'none' }}>{s.tool.label}</Link>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Who it helps */}
          <section style={SEC}>
            <div style={EY}>Who benefits</div>
            <h2 style={H2}>Content teams who need to know<br /><span style={{ color: 'var(--muted)' }}>what to write before they write it.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { role: 'Content strategists', desc: 'Planning a content calendar without knowing which questions AI engines answer without a strong source is planning blind. The Gap Finder gives you a ranked list of genuinely unclaimed content opportunities — by opportunity score, search volume, and recommended format — in under a minute.' },
                { role: 'SEO professionals', desc: 'Traditional keyword gap tools show you where competitors rank that you don\'t. This tool estimates where no one is consistently cited in AI answers — a fundamentally different and more actionable starting hypothesis for clients beginning their AEO investment.' },
                { role: 'Growth marketers', desc: 'For B2B SaaS and service brands, being cited when someone asks ChatGPT "what\'s the best tool for X" is a direct acquisition channel. The gap finder identifies exactly which "best for X" and "how to do Y" questions in your category are unclaimed in AI answers.' },
              ].map(c => (
                <div key={c.role} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '.75rem' }}>{c.role}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Related tools */}
          <section style={SEC}>
            <div style={EY}>Complete the workflow</div>
            <h2 style={H2}>Tools to use alongside<br /><span style={{ color: 'var(--muted)' }}>the Gap Finder.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginTop: '2rem' }}>
              {RELATED_TOOLS.map(t => (
                <Link key={t.href} href={t.href} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.35rem' }}>{t.label}</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{t.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog links */}
          <section style={SEC}>
            <div style={EY}>Further reading</div>
            <h2 style={H2}>AEO content strategy<br /><span style={{ color: 'var(--muted)' }}>from the Notion Cue blog.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1.5rem' }}>
              {[
                { label: 'What is AEO? Complete guide to Answer Engine Optimisation', href: '/blog/what-is-aeo' },
                { label: 'BLUF writing: the content format AI engines prefer to quote', href: '/blog/bluf-writing-for-ai' },
                { label: 'Why 94% of AI-cited pages have structured data', href: '/blog/structured-data-ai-citations' },
                { label: 'How to find and claim first-mover AI citation gaps', href: '/blog' },
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
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;}
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