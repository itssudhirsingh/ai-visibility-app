import SharedHeader from '@/components/SharedHeader'
import JsonLd from '@/components/JsonLd'
import { toolPageSchema } from '@/lib/schema'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { SchemaClient } from '@/components/SchemaClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Schema Markup Generator — JSON-LD for AI Citations | Notion Cue',
  description: 'Paste any URL and get real, filled-in JSON-LD schema markup — FAQPage, Organization, Article, HowTo, BreadcrumbList and more. Pages with schema are cited 3.2× more often in AI answers. Free, no signup.',
  keywords: ['schema markup generator','JSON-LD generator','structured data generator','FAQPage schema','schema markup for AI','AEO schema','schema for ChatGPT'],
  alternates: { canonical: 'https://notioncue.com/ai-schema-markup-generator' },
  openGraph: {
    title: 'Free Schema Markup Generator — JSON-LD for AI Citations',
    description: 'Paste a URL. Get filled-in JSON-LD for FAQPage, Organization, Article, HowTo and more — all generated from your real page content.',
    type: 'website',
    url: 'https://notioncue.com/ai-schema-markup-generator',
  },
}

const FAQS = [
  { q: 'Which schema type improves AI citations most?', a: 'FAQPage schema has the highest single-type impact — pages with FAQPage JSON-LD are cited in AI Overviews at 3.2× the rate of equivalent pages without it. Organization schema is second for brand citations, and Article schema matters most for blog and guide content where author credentials affect citation likelihood.' },
  { q: 'Does the generated schema use my actual page content?', a: 'Yes — the tool fetches your live page and reads the actual content before generating the schema. The output is a filled-in, ready-to-use JSON-LD object, not a template with placeholder text. If your page is behind a login or blocks crawlers, the tool falls back to URL-based inference and tells you which mode was used.' },
  { q: 'Where do I add the schema to my page?', a: 'Paste the script tag inside the <head> section of your HTML, or in Next.js use a dangerouslySetInnerHTML script tag in your page component. Most CMS platforms — WordPress, Webflow, Shopify — have dedicated fields for custom head scripts where you can paste it directly without touching code.' },
  { q: 'Do I need all schema types or just one?', a: 'For most pages, two or three complementary types work better than one. A product page benefits from Organization + Product + FAQPage together. A blog post benefits from Article + Author + BreadcrumbList. The generator auto-detects which combination makes most sense for your specific page type.' },
  { q: 'Does Google still use schema markup in 2026?', a: 'Yes — and so do all major AI engines. Schema is not a legacy SEO tactic. In 2026, structured data is the primary signal that tells ChatGPT, Perplexity, Gemini and Google AI Overviews how to interpret and cite your page. Unstructured pages get cited at a fraction of the rate of equivalent structured pages.' },
  { q: 'How long does it take to see results after adding schema?', a: 'For Google AI Overviews and Perplexity (which crawl in near real-time), changes can appear within days. For ChatGPT, which uses training data snapshots, the impact is visible at the next major training update — typically weeks to months. llms.txt + robots.txt access speeds up indexing by all crawlers.' },
]

const SCHEMA_TYPES = [
  { schema: 'FAQPage',       impact: '3.2× citation rate',        priority: 'HIGH', desc: 'Highest single-type AEO impact. Add to any page with Q&A content. LLMs extract FAQ blocks directly into answers — often verbatim.' },
  { schema: 'Organization',  impact: 'Brand citation baseline',   priority: 'HIGH', desc: 'Tells every engine who you are — name, logo, contact, social profiles. Apply sitewide. Missing this is the most common schema gap for brand visibility.' },
  { schema: 'Article',       impact: 'Author authority signals',  priority: 'HIGH', desc: 'Adds author credentials to blog and guide content. Works with byline markup to satisfy Gemini\'s E-E-A-T requirements for expert citations.' },
  { schema: 'HowTo',         impact: 'Step content extraction',   priority: 'MED',  desc: 'Strong for instructional content. LLMs extract individual steps and present them as structured answers for "how to" queries.' },
  { schema: 'BreadcrumbList',impact: 'Page hierarchy clarity',    priority: 'MED',  desc: 'Helps models understand which pages are pillar vs spoke content — directly supports topical authority scoring.' },
  { schema: 'Product',       impact: 'Commercial intent queries', priority: 'MED',  desc: 'Essential for e-commerce. Adds price, availability, and rating signals that AI engines use when answering commercial-intent buying queries.' },
  { schema: 'WebSite',       impact: 'Sitewide search action',   priority: 'MED',  desc: 'Enables sitelinks searchbox in Google and helps ChatGPT Browsing identify your canonical domain structure.' },
  { schema: 'LocalBusiness', impact: 'Local AI answers',         priority: 'LOW',  desc: 'Required for any business with a physical location. Perplexity and Gemini use this for "near me" and location-specific queries.' },
  { schema: 'BlogPosting',   impact: 'Recency signal',           priority: 'LOW',  desc: 'Adds datePublished and dateModified so crawlers know how fresh your content is — recency matters for Perplexity which surfaces recent content.' },
]

const RELATED_TOOLS = [
  { label: 'llms.txt Generator',    href: '/llms-text-generator',          desc: 'Build the AI-readable index file' },
  { label: 'E-E-A-T Checker',       href: '/ai-eeat-checker',              desc: 'Score your authority signals' },
  { label: 'BLUF Builder',          href: '/bluf-builder',                 desc: 'Write citation-ready openings' },
  { label: 'AI Visibility Checker', href: '/ai-visibility-tool',           desc: 'See your full AEO score' },
  { label: 'llms.txt Validator',    href: '/llms-txt-live-validator',      desc: 'Validate AI crawler access' },
  { label: 'Readability Checker',   href: '/ai-readability-checker',       desc: 'Score content structure' },
]

export default function SchemaGeneratorPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notioncue.com' },
      { '@type': 'ListItem', position: 2, name: 'Schema Markup Generator', item: 'https://notioncue.com/ai-schema-markup-generator' },
    ]
  }

  return (
    <>
      <JsonLd schema={toolPageSchema(
        { name: 'Schema Markup Generator', description: 'Paste a URL and get real filled-in JSON-LD — FAQPage, Organization, Article, HowTo — generated from your actual page content.', abstract: 'Auto-generate JSON-LD schema markup from live page content. Covers 9 schema types. One-click copy.', featureList: ['FAQPage schema', 'Organization schema', 'Article and BlogPosting schema', 'HowTo schema', 'BreadcrumbList schema', 'Product schema'], path: '/ai-schema-markup-generator' },
        FAQS,
        [{ name: 'Schema Markup Generator', path: '/ai-schema-markup-generator' }],
      )} />
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
            <h1 style={H1}>Schema Markup<br /><span style={{ color: 'var(--accent)' }}>Generator</span></h1>
            <p style={LEAD}>
              Paste a URL and get real, filled-in JSON-LD schema — FAQPage, Organization, Article, HowTo, and more — generated from your actual page content. Pages with structured data are cited 3.2× more often in AI answers. One click to copy.
            </p>
          </div>

          {/* Tool */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <SchemaClient />
          </div>

          {/* Schema priority guide */}
          <section style={SECTION}>
            <div style={EYEBROW}>Schema priority guide</div>
            <h2 style={H2}>Which schema to add first,<br /><span style={{ color: 'var(--muted)' }}>ranked by AEO impact.</span></h2>
            <p style={{ ...PROSE, maxWidth: 680, marginBottom: '2rem' }}>
              Not all schema types move the needle equally. Research across 50,000 URLs shows FAQPage delivers the highest citation lift per implementation hour — followed by Organization for brand visibility and Article for expertise signals. Here is the full priority stack:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.85rem' }}>
              {SCHEMA_TYPES.map(s => (
                <div key={s.schema} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                    <span style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.95rem' }}>{s.schema}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', textTransform: 'uppercase', color: s.priority === 'HIGH' ? '#f87171' : s.priority === 'MED' ? '#c8f247' : 'rgba(255,255,255,.45)', background: s.priority === 'HIGH' ? 'rgba(248,113,113,.08)' : s.priority === 'MED' ? 'rgba(200,242,71,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${s.priority === 'HIGH' ? 'rgba(248,113,113,.25)' : s.priority === 'MED' ? 'rgba(200,242,71,.25)' : 'rgba(255,255,255,.12)'}`, padding: '.15rem .45rem', borderRadius: '4px' }}>{s.priority}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: '#4ade80', marginBottom: '.45rem' }}>{s.impact}</div>
                  <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Why schema matters for AI */}
          <section style={SECTION}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <div>
                <div style={EYEBROW}>Why it matters</div>
                <h2 style={H2}>Structured data is how AI engines<br /><span style={{ color: 'var(--muted)' }}>understand what your page means.</span></h2>
                <p style={PROSE}>
                  When a user asks ChatGPT or Perplexity a question, the AI doesn't read your page the way a human does — it extracts structured signals. Schema markup translates your page's content into a machine-readable format that AI engines can parse, classify, and cite with confidence.
                </p>
                <p style={PROSE}>
                  A page without schema forces the LLM to guess what the page is, who wrote it, and whether it is authoritative. A page with FAQPage + Organization + Article schema explicitly answers all three questions — and the data shows this difference is significant. Pages with at least one schema type are cited at <strong style={{ color: 'var(--accent)' }}>2.4× the rate</strong> of unstructured equivalents. Pages with FAQPage specifically: 3.2×.
                </p>
                <p style={PROSE}>
                  Schema is also the fastest technical AEO fix available. Adding a single FAQPage block to a page takes under 30 minutes. The citation impact can appear within days on Perplexity (which crawls in near real-time) and within weeks on Google AI Overviews.
                </p>
              </div>
              <div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: '1rem' }}>Schema impact — research findings</div>
                  {[
                    { stat: '94%', desc: 'of AI-cited pages have at least one schema type' },
                    { stat: '3.2×', desc: 'higher citation rate for pages with FAQPage schema' },
                    { stat: '2.4×', desc: 'higher citation rate with any structured data vs none' },
                    { stat: '#1', desc: 'technical AEO fix ranked by citation impact per hour spent' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '.65rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)', minWidth: 52 }}>{s.stat}</div>
                      <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(200,242,71,.04)', border: '1px solid rgba(200,242,71,.15)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '.65rem' }}>Read the research</div>
                  {[
                    { label: 'Why 94% of AI-cited pages have structured data', href: '/blog/structured-data-ai-citations' },
                    { label: 'FAQPage schema: complete implementation guide', href: '/blog' },
                    { label: 'Schema + E-E-A-T: the combined signal that wins citations', href: '/blog/eeat-ai-citations' },
                  ].map((l, i) => (
                    <a key={i} href={l.href} style={{ display: 'block', fontSize: '.8rem', color: 'rgba(255,255,255,.7)', padding: '.4rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.06)' : 'none', textDecoration: 'none' }}>→ {l.label}</a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How to implement */}
          <section style={SECTION}>
            <div style={EYEBROW}>Implementation guide</div>
            <h2 style={H2}>How to add JSON-LD schema<br /><span style={{ color: 'var(--muted)' }}>to any site or CMS.</span></h2>
            <p style={{ ...PROSE, maxWidth: 680, marginBottom: '2rem' }}>
              JSON-LD is the Google-recommended format for structured data — a script tag you add to your page's head. It doesn't affect your visible content or design. Here's how to deploy it across the most common platforms:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
              {[
                { platform: 'Next.js / React', code: `<script\n  type="application/ld+json"\n  dangerouslySetInnerHTML={{\n    __html: JSON.stringify(schemaObject)\n  }}\n/>` },
                { platform: 'WordPress', code: `// functions.php\nadd_action('wp_head', function() {\n  echo '<script type="application/ld+json">';\n  echo json_encode($schema);\n  echo '</script>';\n});` },
                { platform: 'Webflow', code: `// Site Settings → Custom Code → Head code\n<script type="application/ld+json">\n  { paste JSON-LD here }\n</script>` },
                { platform: 'Shopify', code: `// theme.liquid inside <head>\n{% assign schema = ... %}\n<script type="application/ld+json">\n  {{ schema }}\n</script>` },
              ].map(p => (
                <div key={p.platform} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--border)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.platform}</div>
                  <pre style={{ padding: '1rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.65, overflowX: 'auto', margin: 0 }}>{p.code}</pre>
                </div>
              ))}
            </div>
            <p style={{ ...PROSE, marginTop: '1.5rem' }}>
              After adding schema, validate it with Google's Rich Results Test, then check your updated <a href="/ai-schema-markup-generator" style={{ color: 'var(--violet)' }}>AEO score</a> after 1–2 weeks to see the citation impact. Use the <a href="/llms-txt-live-validator" style={{ color: 'var(--violet)' }}>llms.txt Validator</a> to confirm AI crawlers can access your pages.
            </p>
          </section>

          {/* Schema vs llms.txt */}
          <section style={SECTION}>
            <div style={EYEBROW}>Schema vs llms.txt</div>
            <h2 style={H2}>Two complementary signals.<br /><span style={{ color: 'var(--muted)' }}>Use both together.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '.85rem' }}>JSON-LD Schema</div>
                <p style={{ ...PROSE, fontSize: '.85rem' }}>Tells AI engines <strong style={{ color: 'var(--text)' }}>what each piece of content means</strong>. Structured data labels your Q&As as FAQs, your authors as experts, your pages as products or articles. This is per-page signal — you add it to individual pages where it applies.</p>
                <a href="/blog/structured-data-ai-citations" style={{ display: 'inline-block', marginTop: '.5rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'var(--violet)', textDecoration: 'none' }}>Research on schema + citations →</a>
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '.85rem' }}>llms.txt</div>
                <p style={{ ...PROSE, fontSize: '.85rem' }}>Tells AI engines <strong style={{ color: 'var(--text)' }}>what your entire site covers</strong>. A single file at your domain root that describes your categories, key pages, and how to cite you. This is sitewide signal — one file covers all pages.</p>
                <a href="/llms-text-generator" style={{ display: 'inline-block', marginTop: '.5rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'var(--violet)', textDecoration: 'none' }}>Generate your llms.txt free →</a>
              </div>
            </div>
          </section>

          {/* Related tools */}
          <section style={SECTION}>
            <div style={EYEBROW}>Complete your AEO setup</div>
            <h2 style={H2}>Schema is step one.<br /><span style={{ color: 'var(--muted)' }}>These tools cover the rest.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginTop: '2rem' }}>
              {RELATED_TOOLS.map(t => (
                <a key={t.href} href={t.href} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', textDecoration: 'none', display: 'block', transition: 'border-color .15s' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.35rem' }}>{t.label}</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{t.desc}</div>
                </a>
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
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  button,select{cursor:pointer;font-family:inherit}
  input:focus,button:focus,textarea:focus,select:focus{outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
  @media(max-width:768px){.grid-3{grid-template-columns:1fr!important}.grid-2{grid-template-columns:1fr!important}}
`
import React from 'react'
const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '620px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }