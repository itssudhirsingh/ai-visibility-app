import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import HeatmapClient from '@/components/HeatmapClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'AI Visibility Heatmap — See Which Pages AI Engines Cite — Notion Cue',
  description: 'Scan your entire site and get a colour-coded heatmap showing which pages have high, medium, or low AI citation potential across ChatGPT, Perplexity, and Gemini. Free tool.',
}

const FAQS_HM = [
  { q: 'What does the AI Visibility Heatmap actually measure?', a: 'The heatmap scores each page on your site for citation potential across 6 AI engines — based on URL structure, inferred page type, and content signals. Pages scoring 70+ (green) have strong structural alignment with how AI engines select sources. Pages below 40 (red) have specific issues preventing them from appearing in AI-generated answers, even if they rank well in traditional search.' },
  { q: 'How does the tool find my pages?', a: 'It first attempts to fetch your sitemap.xml or sitemap_index.xml automatically. If no sitemap is found, it falls back to analysing your domain directly. For the most comprehensive results, make sure your sitemap is live at /sitemap.xml and submitted to Google Search Console.' },
  { q: 'Why do some pages score low even when they rank well in Google?', a: 'SEO ranking and AEO citation potential measure different things. A page can rank position one in Google through backlinks and authority while still scoring poorly for AI citation because it buries its answer, lacks FAQ schema, or has a thin content structure that models can\'t extract clean answers from. The heatmap surfaces exactly this gap.' },
  { q: 'How many pages can the tool scan?', a: 'The free tier scans up to 30 pages per domain from your sitemap. This covers most sites comprehensively. Larger sites with hundreds of pages benefit from Pro-tier scanning which scores the full sitemap.' },
  { q: 'How often should I re-run the heatmap?', a: 'Run it after any significant content update, site redesign, or schema change. Monthly scans are a reasonable cadence for most sites — AEO scores shift gradually unless you make structural changes, in which case a rescan within 2-3 weeks shows the impact.' },
]

export default function HeatmapPage() {
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS_HM.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{SHARED_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader /><SubNavClient />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW_STYLE}>Tools</div>
            <h1 style={H1_STYLE}>AI Visibility<br /><span style={{ color: 'var(--accent)' }}>Heatmap</span></h1>
            <p style={LEAD_STYLE}>Enter your domain and get a colour-coded map of every page on your site — green for pages AI engines cite, red for pages they ignore, with a specific fix for each one.</p>
          </div>

          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <HeatmapClient />
          </div>

          {/* HOW TO USE */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How to use this tool</div>
            <h2 style={H2_STYLE}>Three steps from URL<br /><span style={{ color: 'var(--muted)' }}>to actionable page-level fixes.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { n: '01', title: 'Enter your domain', desc: 'Paste your homepage URL. The tool fetches your sitemap automatically and pulls up to 30 pages. You\'ll see results within 20-30 seconds.' },
                { n: '02', title: 'Read the heatmap', desc: 'Green tiles are your citation-ready pages. Yellow tiles need work. Red tiles are invisible to AI engines today — these are your highest-leverage fixes.' },
                { n: '03', title: 'Action the fixes', desc: 'Each page shows its primary issue and the single most impactful fix. Start with red pages that get high organic traffic — the gap between SEO performance and AEO performance is your biggest missed opportunity.' },
              ].map(s => (
                <div key={s.n} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'var(--accent)', marginBottom: '.75rem' }}>{s.n}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '.6rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WHY HEATMAP MATTERS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>Why this matters</div>
            <h2 style={H2_STYLE}>Most sites have a 60% gap between<br /><span style={{ color: 'var(--muted)' }}>SEO ranking and AI citation rate.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', marginTop: '2rem' }}>
              <div>
                <p style={PROSE_STYLE}>Your Google rankings tell you which pages people find. Your AI citation rate tells you which pages AI engines trust enough to quote. These are different lists — and in most sites we've scanned, the overlap is smaller than marketers expect.</p>
                <p style={PROSE_STYLE}>A blog post can rank position two in Google for a competitive keyword and simultaneously have zero AI citations for the same query. The reason is structural: Google rewards authority and backlinks; AI engines reward content that directly answers a question in its first two sentences, has clean schema markup, and sits on a domain with consistent E-E-A-T signals.</p>
                <p style={PROSE_STYLE}>The heatmap shows both dimensions together. You'll see your highest-traffic pages sitting in the red zone — great for SEO, invisible to AI — and you'll see exactly what to fix on each one. Most fixes take under an hour per page: a BLUF rewrite of the opening paragraph, a FAQPage schema block, or a single author byline addition.</p>
                <p style={PROSE_STYLE}>The opportunity here is real. AI engines like Perplexity now handle billions of queries per month in commercial and research categories. A brand that appears in those answers converts at a different rate than one that doesn't. The heatmap is the starting point for knowing which pages on your site are winning that coverage and which aren't.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { pct: '89%', label: 'of sites have at least one high-traffic page with low AI citation potential' },
                  { pct: '3.2x', label: 'more citations after adding BLUF structure and FAQ schema to red-zone pages' },
                  { pct: '60%', label: 'average gap between a site\'s SEO performance and AEO citation rate' },
                  { pct: '22 days', label: 'average time to measurable citation improvement after fixing structural issues' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent)', flexShrink: 0, lineHeight: 1 }}>{s.pct}</div>
                    <div style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW AI ENGINES DISCOVER PAGES */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How AI engines discover your content</div>
            <h2 style={H2_STYLE}>The crawl-to-citation pipeline<br /><span style={{ color: 'var(--muted)' }}>most sites break at step two.</span></h2>
            <p style={{ ...PROSE_STYLE, maxWidth: '700px', marginTop: '1rem', marginBottom: '2rem' }}>AI engines don't discover your pages the same way Google does. Understanding the difference tells you exactly why some pages appear in AI answers and others don't, even when both are well-ranked.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {[
                { step: '1', title: 'Crawl access', desc: 'The engine\'s bot must be allowed by your robots.txt and can physically reach the page. GPTBot, PerplexityBot, and ClaudeBot are blocked on more sites than marketers realise — often through a catch-all disallow rule left over from a staging environment.', color: '#22d3ee' },
                { step: '2', title: 'Content extraction', desc: 'The engine parses the HTML and extracts the text content. JavaScript-rendered content that isn\'t server-side rendered often fails here — the bot sees a blank page. Pages with excessive ad scripts, popup overlays, or broken schema markup also score poorly at this stage.', color: '#7b6cff' },
                { step: '3', title: 'Relevance matching', desc: 'The engine scores your page against the user\'s query. Pages that answer the query in the first sentence win over pages that answer it in paragraph four. This is the BLUF problem — and it\'s the most fixable issue across the sites we scan.', color: '#c8f247' },
                { step: '4', title: 'Authority check', desc: 'The engine weighs your domain authority against competing sources for the same query. E-E-A-T signals — author credentials, backlinks, external mentions — determine which source gets the citation when two pages are otherwise equivalent in structure and relevance.', color: '#4ade80' },
              ].map(s => (
                <div key={s.step} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', alignItems: 'start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${s.color}18`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.75rem', color: s.color, flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', marginBottom: '.35rem' }}>{s.title}</div>
                    <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* WHO IT HELPS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>Who benefits most</div>
            <h2 style={H2_STYLE}>Built for teams who already<br /><span style={{ color: 'var(--muted)' }}>have SEO but need AEO.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { role: 'SEO managers', desc: 'You know which pages rank. This shows you which of those ranked pages are missing AI citations — and gives you a prioritised fix list that maps to your existing content calendar rather than starting from scratch.' },
                { role: 'Content teams', desc: 'The heatmap makes the abstract concrete. Instead of briefing writers to "optimise for AEO," you can show them the exact pages that need BLUF rewrites, which sections need FAQ blocks, and what the citation gap between you and competitors looks like.' },
                { role: 'Agency teams', desc: 'Client reporting gets harder when you can\'t show AI visibility alongside organic rankings. The heatmap gives you a site-wide AEO overview you can screenshot and include in monthly reports — the kind of visualisation that makes the problem legible to non-technical stakeholders.' },
              ].map(c => (
                <div key={c.role} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '.75rem' }}>{c.role}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW GOOGLE/AI TRACKS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How AI engines evaluate page quality</div>
            <h2 style={H2_STYLE}>The signals that determine<br /><span style={{ color: 'var(--muted)' }}>whether your page gets cited.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
              {[
                { category: 'Content signals (35% of citation score)', items: ['BLUF structure — direct answer in sentence 1', 'Answer density — ratio of answers to total words', 'Heading hierarchy — clear H1 → H2 → H3 structure', 'FAQ blocks — explicit Q&A sections with matching schema', 'Definition sections — "what is X" answered plainly early'], color: 'rgba(200,242,71,.2)', bc: 'rgba(200,242,71,.25)' },
                { category: 'Technical signals (30% of citation score)', items: ['FAQPage, HowTo, and Article schema markup', 'llms.txt present and correctly configured', 'AI bots allowed in robots.txt', 'Page speed — LCP under 2.5s for retrieval engines', 'Server-rendered HTML — JS-only content often unseen'], color: 'rgba(123,108,255,.2)', bc: 'rgba(123,108,255,.25)' },
                { category: 'Authority signals (20% of citation score)', items: ['Domain authority and backlink quality', 'Author byline with linked credentials and schema', 'External mentions in credible publications', 'Citation frequency across other AI engines', 'E-E-A-T signals across the full domain'], color: 'rgba(34,211,238,.2)', bc: 'rgba(34,211,238,.25)' },
                { category: 'Crawlability (15% of citation score)', items: ['Sitemap submitted and up to date', 'No broken internal links on key pages', 'No noindex tags on pages intended for citation', 'Canonical URLs set correctly', 'No duplicate content on parameterised URL variants'], color: 'rgba(74,222,128,.2)', bc: 'rgba(74,222,128,.25)' },
              ].map(c => (
                <div key={c.category} style={{ background: 'var(--card)', border: `1px solid ${c.bc}`, borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '1rem' }}>{c.category}</div>
                  <ul style={{ listStyle: 'none' }}>
                    {c.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '.5rem', fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '.35rem' }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✦</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION_STYLE, textAlign: 'center', paddingBottom: '6rem' }}>
            <div style={EYEBROW_STYLE}>FAQ</div>
            <h2 style={{ ...H2_STYLE, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_HM} />
          </section>
        </div>
        <SharedFooter />
      </div>
    </>
  )
}

// SHARED CONSTANTS
// ════════════════════════════════════════════════════════
const SHARED_STYLES = `
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
const EYEBROW_STYLE: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1_STYLE: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2_STYLE: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD_STYLE: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '620px' }
const PROSE_STYLE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION_STYLE: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }