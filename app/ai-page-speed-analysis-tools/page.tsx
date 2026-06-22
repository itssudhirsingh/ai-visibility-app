import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { PageSpeedClient } from '@/components/PageSpeedClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'Free Page Speed AEO Impact Checker — Core Web Vitals & AI Citations | NotionCue',
  description: 'Check how your Core Web Vitals affect AI citation rates across ChatGPT, Perplexity, Gemini, and Claude. Free tool — get real PageSpeed Insights data translated into AEO impact scores with prioritised fixes.',
}

const FAQS_PS = [
  { q: 'Why does page speed affect AI citations?', a: 'Retrieval-based engines like Perplexity and ChatGPT in browse mode fetch your page in real time before including it in an answer. A slow page — particularly a high LCP or blocking JavaScript — increases the chance the crawler times out or deprioritises your content in favour of a faster competitor.' },
  { q: 'Which Core Web Vital matters most for AEO?', a: 'LCP (Largest Contentful Paint) and TTFB (Time to First Byte) have the most direct effect on retrieval-based citation rates. CLS matters less for citation likelihood but affects how cleanly a model extracts content from the page — high layout shift can corrupt text blocks mid-extraction.' },
  { q: 'What PageSpeed score should I aim for?', a: 'A performance score of 70+ on mobile is the realistic threshold where speed stops being a meaningful drag on AEO. Scores below 40 often indicate render-blocking JavaScript that prevents AI crawlers from reading your content at all — they see a blank page or a spinner.' },
  { q: 'Is this tool free?', a: 'Yes — it uses Google\'s free PageSpeed Insights API and runs the AEO impact analysis at no cost. No signup required.' },
  { q: 'Does desktop speed or mobile speed matter more for AEO?', a: 'Both matter, but for different engines. Perplexity and ChatGPT browse mode typically crawl from server-side environments similar to desktop. Google\'s Gemini uses mobile-first indexing signals inherited from Google Search. A safe target is to hit 70+ on both — a page that\'s fast on desktop but poor on mobile is still leaving Gemini citations on the table.' },
  { q: 'Will improving PageSpeed directly increase my AI citation rate?', a: 'Speed improvements remove a barrier but don\'t guarantee citations. A fast page with weak E-E-A-T signals or thin content still won\'t be preferred over a slightly slower page with strong authority and relevant content. Think of page speed as the floor — it needs to be solid before the other signals can do their work.' },
  { q: 'What causes a high TTFB and how do I fix it?', a: 'High TTFB usually comes from unoptimised server response time, no CDN, or slow database queries on dynamically rendered pages. The fastest fixes are moving to a CDN (Cloudflare, Fastly), enabling full-page caching for static content, and switching to edge hosting if your server is geographically distant from your primary audience.' },
]

export default function PageSpeedPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_PS.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{PAGE_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader />
        <SubNavClient />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          {/* ── Hero ── */}
          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW}>Free AEO Tool</div>
            <h1 style={H1}>Page Speed<br /><span style={{ color: 'var(--accent)' }}>AEO Impact Checker</span></h1>
            <p style={LEAD}>
              Enter any URL to get real Core Web Vitals data from Google PageSpeed Insights — then see exactly how your load performance affects citation rates across ChatGPT, Perplexity, Gemini, and Claude.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {['Free — no account needed', 'Real PageSpeed Insights data', 'AEO impact per metric'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '.8rem' }}>✓</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.55)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tool ── */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <PageSpeedClient />
          </div>

          {/* ── How to use ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>How it works</div>
            <h2 style={H2}>Three steps to your<br /><span style={{ color: 'var(--muted)' }}>speed audit.</span></h2>
            <p style={{ ...PROSE, maxWidth: 620, marginBottom: '2.5rem' }}>
              This tool pulls live data from Google's PageSpeed Insights API — the same data source Google uses internally — then maps each metric against known AEO thresholds to show you which speed issues are actively costing you AI citations.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {[
                {
                  step: '01',
                  title: 'Enter your URL',
                  color: 'rgba(200,242,71,.15)',
                  bc: 'rgba(200,242,71,.2)',
                  body: 'Paste any public URL — homepage, blog post, landing page. The tool runs a live PageSpeed Insights test against the real URL, so what you get back reflects your actual current performance, not a cached snapshot.',
                },
                {
                  step: '02',
                  title: 'We pull your Core Web Vitals',
                  color: 'rgba(123,108,255,.15)',
                  bc: 'rgba(123,108,255,.2)',
                  body: 'The tool fetches LCP, TTFB, CLS, FID, TBT, and your overall Performance score for both mobile and desktop. Each metric is compared against the thresholds that matter for AI crawler compatibility, not just standard Google search benchmarks.',
                },
                {
                  step: '03',
                  title: 'Get your AEO impact report',
                  color: 'rgba(34,211,238,.15)',
                  bc: 'rgba(34,211,238,.2)',
                  body: 'Each metric gets a plain-English AEO impact rating — how likely it is to cause retrieval timeouts, extraction errors, or deprioritisation by specific AI engines. Fixes are ranked by impact so you know what to tackle first.',
                },
              ].map(s => (
                <div key={s.step} style={{ background: 'var(--card)', border: `1px solid ${s.bc}`, borderRadius: 14, padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '2rem', fontWeight: 300, color: s.bc, marginBottom: '1rem', lineHeight: 1 }}>{s.step}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '.6rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.75 }}>{s.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Why speed matters for AEO ── */}
          <section style={SECTION}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div style={EYEBROW}>Why it matters</div>
                <h2 style={H2}>Speed is a citation signal,<br /><span style={{ color: 'var(--muted)' }}>not just a UX metric.</span></h2>
                <p style={PROSE}>
                  Most SEO professionals know page speed affects Google rankings. Fewer realise it directly affects whether AI engines can cite your content at all. The mechanism is different from traditional search — and the threshold is less forgiving.
                </p>
                <p style={PROSE}>
                  Retrieval-based engines like Perplexity and ChatGPT browse mode don't work from a pre-built index the way Google does. They fetch and parse your page in real time, on demand, as part of answering each query. If your page takes 6 seconds to load, there's a real chance the crawler gives up before it finishes reading. Your content simply doesn't make it into the answer — not because it wasn't relevant, but because the server was too slow.
                </p>
                <p style={PROSE}>
                  Google's Gemini is less sensitive to real-time fetch speed because it draws primarily on Google's existing crawl index. But Gemini uses mobile-first indexing, which means pages with poor mobile performance — even if desktop is fine — get lower quality signals in the index Gemini draws from. A page in the "Poor" Core Web Vitals band consistently gets fewer citations from Gemini than an equivalent page in the "Good" band, independent of content quality.
                </p>
                <p style={PROSE}>
                  Claude and other LLMs that use web retrieval tools follow similar patterns. The common thread across all of them: a page that loads fast is a page that gets read. A page that doesn't get read doesn't get cited.
                </p>
              </div>

              {/* Metric thresholds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '.25rem' }}>
                  AEO thresholds by metric
                </div>
                {[
                  { metric: 'LCP', good: '< 2.5s', warn: '2.5–4s', poor: '> 4s', color: '#4ade80', aeo: 'Perplexity crawlers time out around 4s. LCP under 2.5s leaves a safe margin. Above 4s, real-time citation is unreliable.' },
                  { metric: 'TTFB', good: '< 600ms', warn: '600ms–1.8s', poor: '> 1.8s', color: '#4ade80', aeo: 'Server response time is the first bottleneck any crawler hits. A high TTFB delays every subsequent metric and compounds retrieval risk.' },
                  { metric: 'CLS', good: '< 0.1', warn: '0.1–0.25', poor: '> 0.25', color: '#c8f247', aeo: 'High layout shift doesn\'t cause timeouts, but it can fragment text blocks during extraction — the model receives garbled or incomplete content.' },
                  { metric: 'TBT', good: '< 200ms', warn: '200–600ms', poor: '> 600ms', color: '#fb923c', aeo: 'Heavy JavaScript blocking the main thread prevents headless crawlers from reading dynamically rendered content entirely.' },
                  { metric: 'FCP', good: '< 1.8s', warn: '1.8–3s', poor: '> 3s', color: '#4ade80', aeo: 'First Contentful Paint affects how quickly text content is visible to crawlers that don\'t wait for full page load.' },
                ].map(m => (
                  <div key={m.metric} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.6rem' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1rem', color: m.color, width: 48, flexShrink: 0 }}>{m.metric}</span>
                      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#4ade80', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', padding: '2px 7px', borderRadius: 4 }}>{m.good} Good</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#fb923c', background: 'rgba(251,146,60,.08)', border: '1px solid rgba(251,146,60,.2)', padding: '2px 7px', borderRadius: 4 }}>{m.warn} Warn</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#f87171', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.2)', padding: '2px 7px', borderRadius: 4 }}>{m.poor} Poor</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>{m.aeo}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Engine-by-engine breakdown ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Engine breakdown</div>
            <h2 style={H2}>How each AI engine<br /><span style={{ color: 'var(--muted)' }}>handles slow pages.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Not all AI engines are equally sensitive to page speed. The impact depends on whether the engine uses real-time retrieval, a crawl index, or a hybrid of both. Here's what actually happens when your page is slow, for each engine.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
              {[
                {
                  engine: 'Perplexity',
                  color: '#45e4ff',
                  bc: 'rgba(69,228,255,.2)',
                  sensitivity: 'Very High',
                  mechanism: 'Real-time retrieval on every query',
                  detail: 'Perplexity fetches URLs live as part of every answer. If your page doesn\'t load within its timeout window, it won\'t be cited regardless of relevance. TTFB and LCP are the critical metrics here. A server that responds in under 600ms and renders primary content under 2.5s will be reliably retrieved. Above those thresholds, citation becomes unreliable.',
                },
                {
                  engine: 'ChatGPT Browse',
                  color: '#52e38e',
                  bc: 'rgba(82,227,142,.2)',
                  sensitivity: 'High',
                  mechanism: 'Real-time browser-based retrieval',
                  detail: 'ChatGPT\'s browse mode uses a headless browser to fetch pages. Heavy JavaScript that blocks the main thread (high TBT) is a significant problem here — the browser waits for JS to resolve before reading content, and pages with TBT above 600ms frequently fail to extract cleanly. Render-blocking resources and deferred scripts are the main culprits.',
                },
                {
                  engine: 'Gemini',
                  color: '#ffc45c',
                  bc: 'rgba(255,196,92,.2)',
                  sensitivity: 'Medium',
                  mechanism: 'Google crawl index + real-time signals',
                  detail: 'Gemini draws on Google\'s existing search index rather than fetching pages live per query. This makes it less sensitive to real-time load speed and more sensitive to Core Web Vitals as measured over time in the Chrome User Experience Report (CrUX). Mobile performance matters more here than for other engines — Gemini uses mobile-first indexing.',
                },
                {
                  engine: 'Claude (web retrieval)',
                  color: '#927cff',
                  bc: 'rgba(146,124,255,.2)',
                  sensitivity: 'Medium–High',
                  mechanism: 'Tool-based retrieval on demand',
                  detail: 'When Claude uses web retrieval tools, it fetches pages through an API call that behaves similarly to a headless browser. Pages with server-side rendering and fast TTFB tend to extract cleanly. Client-side rendered apps that require JavaScript execution to display content are the highest-risk format — Claude may receive an empty shell rather than the actual content.',
                },
              ].map(e => (
                <div key={e.engine} style={{ background: 'var(--card)', border: `1px solid ${e.bc}`, borderRadius: 14, padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: e.color }}>{e.engine}</div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: e.color, background: `${e.color}12`, border: `1px solid ${e.color}30`, padding: '3px 9px', borderRadius: 4 }}>
                      {e.sensitivity} sensitivity
                    </span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'rgba(255,255,255,.35)', marginBottom: '.75rem', letterSpacing: '.04em' }}>
                    {e.mechanism}
                  </div>
                  <div style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.75 }}>{e.detail}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Who it helps ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Who benefits</div>
            <h2 style={H2}>Not just for developers.<br /><span style={{ color: 'var(--muted)' }}>Any team losing AI citations to slow pages.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Page speed is often treated as a developer problem. In practice, the teams that lose the most AI citations to slow pages are content and SEO teams who don't have visibility into performance data — until now.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[
                {
                  role: 'SEO Professionals',
                  icon: '📈',
                  bc: 'rgba(200,242,71,.2)',
                  points: [
                    'Identify speed issues before they tank AEO performance',
                    'Benchmark client sites against competitors on Core Web Vitals',
                    'Build the performance case for dev team prioritisation',
                    'Track metric improvements after CDN or hosting changes',
                  ],
                },
                {
                  role: 'Content Marketers',
                  icon: '✍️',
                  bc: 'rgba(123,108,255,.2)',
                  points: [
                    'Check whether heavy images are costing your posts citations',
                    'Identify pages that rank well in search but get skipped by AI',
                    'Prioritise which content pages to optimise first',
                    'Understand the speed gap between your content and competitors\'',
                  ],
                },
                {
                  role: 'Developers & Agencies',
                  icon: '⚙️',
                  bc: 'rgba(34,211,238,.2)',
                  points: [
                    'Translate Core Web Vitals into client-facing AEO impact',
                    'Identify render-blocking JS causing crawler read failures',
                    'Validate speed improvements with before/after AEO scoring',
                    'Present performance work in terms of citation rate, not just ms',
                  ],
                },
              ].map(r => (
                <div key={r.role} style={{ background: 'var(--card)', border: `1px solid ${r.bc}`, borderRadius: 14, padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>{r.icon}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>{r.role}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                    {r.points.map(pt => (
                      <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem' }}>
                        <span style={{ color: 'var(--accent)', fontSize: '.7rem', marginTop: 3, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.62)', lineHeight: 1.6 }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Practical fixes ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Practical fixes</div>
            <h2 style={H2}>The fastest ways to improve<br /><span style={{ color: 'var(--muted)' }}>your AEO speed score.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Most speed problems that affect AI citation rates fall into four categories: server response time, image optimisation, JavaScript blocking, and render strategy. Each fix below maps to a specific metric and an AEO impact level.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[
                { metric: 'TTFB', effort: 'Low effort', impact: 'Very high', color: '#4ade80', fix: 'Move to a CDN with edge caching enabled. Cloudflare\'s free tier alone cuts TTFB by 40–70% for most sites by serving cached responses from a node geographically close to the requester. This is the single highest-leverage speed improvement available for the least effort.' },
                { metric: 'TTFB', effort: 'Medium effort', impact: 'High', color: '#4ade80', fix: 'Enable full-page caching for static or semi-static pages. WordPress sites using WP Rocket or Cloudflare Cache Rules, Next.js sites using ISR — any approach that eliminates server-side processing on repeat requests cuts TTFB dramatically.' },
                { metric: 'LCP', effort: 'Low effort', impact: 'High', color: '#4ade80', fix: 'Preload your LCP element. Add <link rel="preload"> for the hero image or above-the-fold text block. This is a one-line HTML change that consistently moves LCP by 0.5–1.5 seconds on pages where the LCP element is an image.' },
                { metric: 'LCP', effort: 'Medium effort', impact: 'High', color: '#4ade80', fix: 'Convert images to WebP or AVIF and serve them with responsive srcset. A 1MB hero JPEG is the single most common cause of LCP above 4s on mobile. Converting to WebP typically reduces file size by 25–35% with no visible quality loss.' },
                { metric: 'TBT', effort: 'Medium effort', impact: 'High', color: '#fb923c', fix: 'Audit and defer third-party scripts. Analytics, chat widgets, ad scripts, and heatmap tools loaded in the <head> are the most common source of TBT above 600ms. Move them to load after the main content using async or defer attributes, or load them on user interaction.' },
                { metric: 'TBT', effort: 'High effort', impact: 'Very high', color: '#fb923c', fix: 'Switch client-side rendered (CSR) pages to server-side rendering (SSR) or static generation. CSR pages — built with vanilla React or Vue without SSR — serve an empty HTML shell until JavaScript runs. AI crawlers that don\'t execute JS see a blank page. Next.js, Nuxt, or Astro with SSR fix this at the framework level.' },
                { metric: 'CLS', effort: 'Low effort', impact: 'Medium', color: '#c8f247', fix: 'Set explicit width and height attributes on all images and iframes. The browser can then reserve the correct space before the asset loads, eliminating the layout shift that happens when images pop in and push content down. This is a two-attribute HTML fix per image element.' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 110px 110px 1fr', gap: '1.25rem', alignItems: 'center', background: 'var(--card)', padding: '1rem 1.5rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: row.color, fontWeight: 600 }}>{row.metric}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'rgba(255,255,255,.38)', background: 'rgba(255,255,255,.04)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{row.effort}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: row.color, background: `${row.color}12`, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', border: `1px solid ${row.color}25` }}>{row.impact} impact</span>
                  <span style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.65 }}>{row.fix}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{ ...SECTION, textAlign: 'center' }}>
            <div style={EYEBROW}>FAQ</div>
            <h2 style={{ ...H2, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_PS} />
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
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ffffff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  button,select{cursor:pointer;font-family:inherit}
  input:focus,button:focus,textarea:focus,select:focus{outline:none}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
  @media(max-width:768px){
    .ps-grid-2{grid-template-columns:1fr !important}
    .ps-grid-3{grid-template-columns:1fr !important}
    .ps-fix-row{grid-template-columns:1fr !important}
    .ps-fix-row span:nth-child(2),.ps-fix-row span:nth-child(3){display:none}
  }
`

const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: '600px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }