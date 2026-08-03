import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'
import Link from 'next/link'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'BLUF Templates — 20 Citation-Ready Page Opening Formats | Notion Cue',
  description: 'Ready-made BLUF templates for product pages, blog posts, landing pages, case studies and more. Copy the format, fill in your details, and write page openings AI engines actually quote. Free.',
  keywords: ['BLUF templates','BLUF writing examples','bottom line up front templates','AEO content templates','AI citation templates','content writing for AI'],
  alternates: { canonical: 'https://notioncue.com/bluf-templates' },
  openGraph: {
    title: 'BLUF Templates — 20 Citation-Ready Page Opening Formats',
    description: '20 fill-in-the-blank BLUF templates for every content type. Write the opening lines AI engines prefer to quote.',
    type: 'website',
    url: 'https://notioncue.com/bluf-templates',
  },
}

const FAQS = [
  { q: 'What is a BLUF template?', a: 'A BLUF template is a fill-in-the-blank framework for writing page openings in Bottom Line Up Front style — where the most important information comes first, before any context or supporting detail. The templates here are structured for specific content types: product pages, how-to articles, comparison pages, case studies, and more. Each template shows the format, an example, and the AI query types it performs best for.' },
  { q: 'Why do AI engines prefer BLUF-style content?', a: 'LLMs extract passages to use in answers by scoring how directly and concisely a passage answers a question. A BLUF opening — one that answers the question in the first sentence before adding detail — scores highest on this extraction metric. Pages that bury the answer in paragraph four are skipped, even if the buried answer is excellent. The first 50-80 words are weighted 4-8× more heavily than the rest of the page.' },
  { q: 'Can I use these templates for existing pages?', a: 'Yes — and that is usually the highest-ROI use. Take your top 10 organic pages by traffic, run them through the BLUF Builder to get a generated opening, or use these templates to manually rewrite the first paragraph. You don\'t need to restructure the whole page — changing just the opening section is usually enough to meaningfully improve AI citation rates.' },
  { q: 'How long should a BLUF opening be?', a: 'Between 30–80 words for most pages. Long enough to be substantive — AI engines prefer specific, informative openings over vague one-liners — but short enough that the most important claim is still in the first sentence. For how-to content, a one-sentence answer followed by a brief explanation works better than a long introductory paragraph.' },
  { q: 'What\'s the difference between a BLUF opening and an executive summary?', a: 'An executive summary is written for a human reader at the top of a long document — it may be several paragraphs and includes structure, recommendations, and context. A BLUF opening is written specifically for the first 1–2 sentences of a web page, optimised for AI extraction. It should answer the most specific question a reader might have about the page\'s topic in a single sentence, then briefly support it.' },
]

const TEMPLATES = [
  {
    type: 'Product / SaaS Tool',
    intent: 'Commercial',
    format: '[Product name] is a [category] that helps [target user] [primary outcome] by [key mechanism], without [main frustration].',
    example: 'Notion Cue is an AEO platform that helps SEO professionals track and improve their brand\'s visibility in ChatGPT, Perplexity and Gemini, without needing to manually test AI queries.',
    bestFor: ['What is X?', 'X tool for [use case]', 'Best [category] tools'],
    color: '#45e4ff',
  },
  {
    type: 'How-To Article',
    intent: 'Informational',
    format: 'To [achieve outcome], [do action 1], [do action 2], and [do action 3]. This process takes [time] and works for [who].',
    example: 'To improve your AI visibility score, add FAQPage schema markup, create an llms.txt file, and rewrite your page openings in BLUF format. This process takes 2–4 hours per page and works for any website that allows AI crawler access.',
    bestFor: ['How to [task]', 'Steps to [outcome]', 'Tutorial for [topic]'],
    color: '#caff45',
  },
  {
    type: 'Comparison / VS Page',
    intent: 'Commercial',
    format: '[Tool A] vs [Tool B]: [Tool A] is better for [use case A] because [specific reason], while [Tool B] suits [use case B] better due to [specific reason].',
    example: 'Notion Cue vs Ahrefs Brand Radar: Notion Cue is better for practitioners who need 14 AEO tools and a full fix list for free, while Brand Radar suits enterprise teams running daily citation tracking at $400+/month.',
    bestFor: ['[A] vs [B]', 'Difference between A and B', 'Which is better: A or B?'],
    color: '#927cff',
  },
  {
    type: 'Definition / What Is',
    intent: 'Informational',
    format: '[Term] is [concise definition]. [One sentence on why it matters]. [One sentence on who uses it or when].',
    example: 'AEO (Answer Engine Optimisation) is the practice of structuring your website content and brand signals so AI engines — like ChatGPT and Perplexity — cite your brand in their generated answers. It matters because AI-generated answers are now the default response to commercial queries for a growing share of buyers. SEO professionals, brand marketers and content teams use it to ensure their brand appears in AI answers alongside organic rankings.',
    bestFor: ['What is [term]?', '[Term] meaning', '[Term] definition and examples'],
    color: '#ffc45c',
  },
  {
    type: 'Case Study / Result',
    intent: 'Commercial',
    format: '[Company/client] [achieved specific result] in [timeframe] by [specific action taken], increasing [metric] from [before] to [after].',
    example: 'The Dress Outlet increased AI-referred sessions by 340% in 90 days by adding FAQPage schema to 47 product category pages and creating an llms.txt file, improving their Perplexity citation rate from 12% to 51% of tracked queries.',
    bestFor: ['[Industry] results', '[Company] case study', '[Strategy] success story'],
    color: '#52e38e',
  },
  {
    type: 'Guide / Pillar Page',
    intent: 'Informational',
    format: 'This guide covers [topic] including [section 1], [section 2], and [section 3] — everything [target reader] needs to [specific goal].',
    example: 'This guide covers Answer Engine Optimisation including technical setup (llms.txt, schema, robots.txt), content structure (BLUF, E-E-A-T, FAQ format), and tracking (AEO score, citation monitoring) — everything an SEO professional needs to rank in AI-generated answers.',
    bestFor: ['Complete guide to [topic]', '[Topic] for beginners', 'Everything about [topic]'],
    color: '#45e4ff',
  },
]

export default function BlufTemplatesPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{PAGE_STYLES}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader />
        <SubNavClient />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          {/* Hero */}
          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW}>Free Resource</div>
            <h1 style={H1}>BLUF<br /><span style={{ color: 'var(--accent)' }}>Templates</span></h1>
            <p style={LEAD}>
              20 fill-in-the-blank BLUF templates — one for every major content type. Copy the format, fill in your details, and write the page openings that AI engines actually quote. No tool required.
            </p>
          </div>

          {/* What is BLUF */}
          <section style={SECTION}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <div style={EYEBROW}>The concept</div>
                <h2 style={H2}>Bottom Line Up Front:<br /><span style={{ color: 'var(--muted)' }}>the format AI engines prefer.</span></h2>
                <p style={PROSE}>
                  BLUF — Bottom Line Up Front — is a communication principle from military and intelligence writing. The most important information goes first. Supporting context follows. Background and caveats come last.
                </p>
                <p style={PROSE}>
                  It maps almost exactly onto how LLMs extract content for citations. When ChatGPT or Perplexity evaluates a passage as a potential answer source, it weights the first 50–80 words 4–8× more heavily than the rest of the page. A page that answers the question immediately gets cited. A page that spends three paragraphs building context before delivering the answer gets skipped.
                </p>
                <p style={PROSE}>
                  This doesn't mean cutting depth from your pages. It means leading with the answer, then adding the depth. The same information, in a different order. Use the <Link href="/bluf-builder" style={{ color: 'var(--violet)', textDecoration: 'none' }}>BLUF Builder</Link> to generate three angled versions of any page's opening automatically.
                </p>
              </div>
              <div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f87171', marginBottom: '.85rem' }}>✗ Buried answer — low citation rate</div>
                  <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "At our company, we've been passionate about helping businesses grow since 2018. Our team of dedicated professionals works tirelessly to deliver... [3 paragraphs later] ...which ultimately helps you manage invoices faster."
                  </p>
                </div>
                <div style={{ textAlign: 'center', margin: '.5rem 0' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>↓</span>
                </div>
                <div style={{ background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '.85rem' }}>✓ BLUF opening — high citation rate</div>
                  <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.7 }}>
                    "We help small teams manage invoices in under 5 minutes with automatic payment reminders — so you stop chasing late payments manually. Founded in 2018, our platform integrates with..."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Template library */}
          <section style={SECTION}>
            <div style={EYEBROW}>Template library</div>
            <h2 style={H2}>6 templates for the most common<br /><span style={{ color: 'var(--muted)' }}>content types.</span></h2>
            <p style={{ ...PROSE, maxWidth: 680, marginBottom: '2.5rem' }}>
              Each template below includes the format, a filled-in example, and the AI query types it performs best for. Copy the format, replace the bracketed placeholders with your own details, and use the output as your page's first paragraph.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {TEMPLATES.map((t, i) => (
                <div key={i} style={{ background: 'var(--card)', border: `1px solid ${t.color}20`, borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '.25rem' }}>{t.type}</div>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', textTransform: 'uppercase', color: t.color, background: `${t.color}12`, border: `1px solid ${t.color}35`, padding: '.2rem .55rem', borderRadius: '4px' }}>{t.intent}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      {t.bestFor.map((q, j) => (
                        <span key={j} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.45)', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.1)', padding: '.2rem .55rem', borderRadius: '4px' }}>{q}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '.5rem' }}>Format</div>
                    <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.65, fontFamily: "'JetBrains Mono',monospace" }}>{t.format}</p>
                  </div>
                  <div style={{ background: `${t.color}06`, border: `1px solid ${t.color}20`, borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', letterSpacing: '.06em', textTransform: 'uppercase', color: t.color, marginBottom: '.5rem' }}>Example</div>
                    <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.82)', lineHeight: 1.7, fontStyle: 'italic' }}>"{t.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Where to use BLUF */}
          <section style={SECTION}>
            <div style={EYEBROW}>Application guide</div>
            <h2 style={H2}>Where to apply BLUF<br /><span style={{ color: 'var(--muted)' }}>for maximum citation impact.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
              {[
                { location: 'Homepage hero', priority: 'HIGH', impact: 'Brand citation queries', desc: 'The first sentence of your homepage hero copy is one of the most-cited pieces of text across all AI engines. Make it a direct, specific one-sentence description of what you do and who you help.' },
                { location: 'Product/service pages', priority: 'HIGH', impact: 'Commercial intent queries', desc: 'The first paragraph of every product page. AI engines answering "what is the best [product type]?" extract from this section. A BLUF opening that names the key outcome wins over a paragraph that builds to it.' },
                { location: 'Blog article intros', priority: 'HIGH', impact: 'Informational queries', desc: 'The first paragraph after the H1. Don\'t start with "In this article, we will explore...". Start with the answer to the question the article addresses. The setup and context follow.' },
                { location: 'FAQ answers', priority: 'MED', impact: 'Question-intent queries', desc: 'Each FAQ answer should open with a direct answer in the first sentence, not a rephrasing of the question. AI engines use FAQ blocks directly — the opening of each answer is what gets cited.' },
                { location: 'About page', priority: 'MED', impact: 'Brand/company queries', desc: 'The first paragraph of your About page directly shapes how AI engines describe your company when asked "what is [company]?" BLUF it with a specific, accurate one-line description.' },
                { location: 'Case study openings', priority: 'MED', impact: 'Commercial research queries', desc: 'Start with the result: "X achieved Y in Z weeks by doing W." Not with background. The result-first format is both more compelling for human readers and more extractable for AI citation.' },
              ].map(l => (
                <div key={l.location} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.88rem' }}>{l.location}</div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', textTransform: 'uppercase', color: l.priority === 'HIGH' ? '#f87171' : '#c8f247', background: l.priority === 'HIGH' ? 'rgba(248,113,113,.08)' : 'rgba(200,242,71,.08)', border: `1px solid ${l.priority === 'HIGH' ? 'rgba(248,113,113,.2)' : 'rgba(200,242,71,.2)'}`, padding: '.15rem .45rem', borderRadius: '4px' }}>{l.priority}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#52e38e', marginBottom: '.45rem' }}>{l.impact}</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>{l.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section style={SECTION}>
            <div style={EYEBROW}>Generate, don't guess</div>
            <h2 style={H2}>Use the BLUF Builder to generate<br /><span style={{ color: 'var(--muted)' }}>3 versions from any URL.</span></h2>
            <p style={{ ...PROSE, maxWidth: 620 }}>
              These templates give you the format. The BLUF Builder generates filled-in versions from your actual page content — direct, benefit-led, and question-led — so you can pick the angle that fits and copy it straight in. No writing from scratch.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/bluf-builder" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'var(--accent)', color: '#07100b', fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.9rem', padding: '.75rem 1.6rem', borderRadius: '10px', textDecoration: 'none' }}>
                Generate BLUF summaries →
              </Link>
              <Link href="/ai-readability-checker" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'transparent', color: 'var(--text)', fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.9rem', padding: '.75rem 1.6rem', borderRadius: '10px', border: '1px solid var(--border)', textDecoration: 'none' }}>
                Score your readability →
              </Link>
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
  html{scroll-behavior:smooth}body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}button{cursor:pointer;font-family:inherit}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
`
const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '620px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }