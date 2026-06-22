import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { PageSpeedClient } from '@/components/PageSpeedClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'Page Speed AEO Impact Checker — Notion Cue',
  description: 'Check how your Core Web Vitals affect AI citation rates across ChatGPT, Perplexity, and Gemini. Free tool — get real PageSpeed data translated into AEO impact.',
}

const FAQS_PS = [
  { q: 'Why does page speed affect AI citations?', a: 'Retrieval-based engines like Perplexity and ChatGPT in browse mode have to fetch your page in real time before including it in an answer. A slow page — particularly a high LCP or blocking JavaScript — increases the chance the crawler times out or deprioritises your content in favour of faster-loading competitors.' },
  { q: 'Which Core Web Vital matters most for AEO?', a: 'LCP (Largest Contentful Paint) and TTFB (Time to First Byte) have the most direct effect on retrieval-based citation rates. CLS matters less for citation likelihood but can affect how cleanly a model extracts content from the page.' },
  { q: 'What PageSpeed score should I aim for?', a: 'A performance score of 70+ on mobile is the realistic threshold where speed stops being a meaningful drag on AEO. Scores below 40 often indicate render-blocking JavaScript that prevents AI crawlers from reading your content at all.' },
  { q: 'Is this tool free?', a: 'Yes — it uses Google\'s free PageSpeed Insights API and runs the AEO impact analysis at no cost. No signup required.' },
]

export default function PageSpeedPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS_PS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
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
            <h1 style={H1}>Page Speed<br /><span style={{ color: 'var(--accent)' }}>AEO Impact Checker</span></h1>
            <p style={LEAD}>Enter any URL to get real Core Web Vitals data and see exactly how your page speed affects citation rates across ChatGPT, Perplexity, and Gemini.</p>
          </div>
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <PageSpeedClient />
          </div>

          <section style={SECTION}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <div style={EYEBROW}>Why it matters</div>
                <h2 style={H2}>Speed is a citation signal,<br /><span style={{ color: 'var(--muted)' }}>not just a UX metric.</span></h2>
                <p style={PROSE}>Retrieval-based AI engines like Perplexity fetch and index live web pages as part of answering each query. A page that loads slowly, blocks rendering with heavy JavaScript, or returns a high TTFB is more likely to be skipped in favour of a faster competitor's page — even when your content is better.</p>
                <p style={PROSE}>Google's Gemini is especially sensitive here, since it draws on the same crawl signals that affect traditional Google Search rankings. A page in the "Poor" Core Web Vitals band consistently underperforms a "Good" page in AI citation tests, independent of content quality.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { metric: 'LCP', threshold: '< 2.5s', label: 'Good for AEO', color: '#4ade80', desc: 'Perplexity crawlers time out after ~4s. LCP under 2.5s leaves comfortable margin.' },
                  { metric: 'TTFB', threshold: '< 600ms', label: 'Good for AEO', color: '#4ade80', desc: 'Server response time is the first bottleneck for any real-time crawler.' },
                  { metric: 'CLS', threshold: '< 0.1', label: 'Content parseable', color: '#c8f247', desc: 'High layout shift can corrupt content extraction even when the page loads fast.' },
                ].map(m => (
                  <div key={m.metric} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.1rem', color: m.color, width: '50px', flexShrink: 0 }}>{m.metric}</div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: m.color, marginBottom: '.25rem' }}>{m.threshold} — {m.label}</div>
                      <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.55 }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

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

// SHARED STYLES (used by all 4 pages above)
// ════════════════════════════════════════════════════════
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
`

const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: '600px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }