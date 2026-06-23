import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { SchemaClient } from '@/components/SchemaClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'Schema Markup Generator — Notion Cue',
  description: 'Paste any URL and get real, filled-in JSON-LD schema markup — FAQPage, Organization, Article, HowTo, and more. Free tool, one-click copy.',
}

const FAQS_SCHEMA = [
  { q: 'Which schema type improves AI citations most?', a: 'FAQPage schema has the highest single-type impact — pages with FAQPage JSON-LD are cited in AI Overviews at 3.2x the rate of equivalent pages without it. Organization schema is second for brand citations, and Article schema matters most for blog and guide content where author credentials affect citation likelihood.' },
  { q: 'Does the generated schema use my actual page content?', a: 'Yes — the tool fetches your live page and reads the actual content before generating the schema. The output is a filled-in, ready-to-use JSON-LD object, not a template with placeholder text.' },
  { q: 'Where do I add the schema to my page?', a: 'Paste the script tag inside the <head> section of your HTML, or in Next.js, use a dangerouslySetInnerHTML script tag in your page component. Most CMS platforms (WordPress, Webflow, Shopify) have dedicated fields for custom head scripts where you can paste it directly.' },
  { q: 'Do I need all schema types or just one?', a: 'For most pages, two or three complementary schema types work better than one. A product page benefits from Organization + Product + FAQPage together. A blog post benefits from Article + Author + BreadcrumbList. The generator auto-detects which combination makes most sense for your specific page type.' },
]

export default function SchemaGeneratorPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS_SCHEMA.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{PAGE_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader />
        <SubNavClient />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>
          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW}>Tools</div>
            <h1 style={H1}>Schema Markup<br /><span style={{ color: 'var(--accent)' }}>Generator</span></h1>
            <p style={LEAD}>Paste a URL and get real, filled-in JSON-LD schema — FAQPage, Organization, Article, HowTo, and more — generated from your actual page content. One click to copy and paste into your site.</p>
          </div>
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <SchemaClient />
          </div>

          <section style={SECTION}>
            <div style={EYEBROW}>Schema priority guide</div>
            <h2 style={H2}>Which schema to add first,<br /><span style={{ color: 'var(--muted)' }}>and why.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
              {[
                { schema: 'FAQPage', impact: '3.2x citation rate', priority: 'HIGH', desc: 'Highest single-type AEO impact. Add to any page with visible Q&A content. Models extract FAQ blocks directly into answers.' },
                { schema: 'Organization', impact: 'Brand citation baseline', priority: 'HIGH', desc: 'Tells every engine who you are — name, logo, contact, social profiles. Apply sitewide, not just on the homepage.' },
                { schema: 'Article', impact: 'Author authority signals', priority: 'HIGH', desc: 'Adds author credentials to blog and guide content. Works together with byline markup to satisfy Gemini\'s E-E-A-T requirements.' },
                { schema: 'HowTo', impact: 'Step content extraction', priority: 'MED', desc: 'Strong for instructional content. Models can extract individual steps and present them as structured answers.' },
                { schema: 'BreadcrumbList', impact: 'Page hierarchy clarity', priority: 'MED', desc: 'Helps models understand which pages are pillar vs spoke content — supports topical authority signals.' },
                { schema: 'Product', impact: 'Commercial intent queries', priority: 'MED', desc: 'Essential for e-commerce. Adds price, availability, and rating signals that commercial-intent queries prioritise.' },
              ].map(s => (
                <div key={s.schema} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                    <span style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.95rem' }}>{s.schema}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', textTransform: 'uppercase', color: s.priority === 'HIGH' ? '#f87171' : '#c8f247', background: s.priority === 'HIGH' ? 'rgba(248,113,113,.08)' : 'rgba(200,242,71,.08)', border: `1px solid ${s.priority === 'HIGH' ? 'rgba(248,113,113,.25)' : 'rgba(200,242,71,.25)'}`, padding: '.15rem .45rem', borderRadius: '4px' }}>{s.priority}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: '#4ade80', marginBottom: '.5rem' }}>{s.impact}</div>
                  <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.68)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION, textAlign: 'center' }}>
            <div style={EYEBROW}>FAQ</div>
            <h2 style={{ ...H2, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_SCHEMA} />
          </section>
        </div>
        <SharedFooter />
      </div>
    </>
  )
}

// SHARED STYLES (used by all 4 pages above)
// ════════════════════════════════════════════════════════
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  button,select{cursor:pointer;font-family:inherit}
  input:focus,button:focus,textarea:focus,select:focus{outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
`

const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '600px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }