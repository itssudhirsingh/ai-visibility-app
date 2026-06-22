import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { ReadabilityClient } from '@/components/ReadabilityClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'AI Readability Score — Notion Cue',
  description: 'Score any page or text for AI citation readability. Checks BLUF structure, answer density, content clarity, and FAQ presence. Free — paste a URL or your own text.',
}

const FAQS_READ = [
  { q: 'What does the AI Readability Score measure?', a: 'Five dimensions: BLUF structure (does it answer in the first 2 sentences), answer density (ratio of direct answers to total words), content structure (heading hierarchy, bullets, scannable format), sentence clarity (plain language, low jargon), and FAQ/Q&A presence. These are the factors most correlated with AI engine citation rates.' },
  { q: 'Can I paste text directly instead of a URL?', a: 'Yes — toggle to "Paste text" mode and paste any content directly. This is useful for drafts that aren\'t published yet, or for content behind a login wall.' },
  { q: 'What grade should I aim for?', a: 'A B or above (score 70+) is the realistic target for strong AI citation potential. An A (90+) is achievable on pages specifically written with BLUF structure and FAQ blocks. C and below indicates the content is burying its answer — the most common reason pages don\'t get cited despite being topically relevant.' },
  { q: 'Is this the same as a regular readability score like Flesch-Kincaid?', a: 'No — traditional readability scores measure sentence length and syllable count, optimised for human comprehension. This tool scores for AI retrievability — how quickly and cleanly a language model can extract a direct answer from the content, which is a different dimension entirely.' },
]

export default function ReadabilityPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS_READ.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
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
            <h1 style={H1}>AI Readability<br /><span style={{ color: 'var(--accent)' }}>Score</span></h1>
            <p style={LEAD}>Paste a URL or text and get a score across 5 AI-readability dimensions — plus a BLUF rewrite of your opening sentences, ready to copy in.</p>
          </div>
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <ReadabilityClient />
          </div>

          <section style={SECTION}>
            <div style={EYEBROW}>How scoring works</div>
            <h2 style={H2}>Five things AI engines<br /><span style={{ color: 'var(--muted)' }}>actually check before citing.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { icon: '⚡', label: 'BLUF structure', desc: 'Does the page answer its implied question in the first 2 sentences? LLMs weight the opening 50-80 words 4-8x more than the rest of the page.' },
                { icon: '📊', label: 'Answer density', desc: 'Ratio of direct, specific answers to total word count. High-density pages get cited; low-density pages get skimmed and skipped.' },
                { icon: '🗂', label: 'Content structure', desc: 'Clear heading hierarchy, scannable bullet points, and logical flow all help models extract clean, quotable chunks from your content.' },
                { icon: '💬', label: 'Sentence clarity', desc: 'Short sentences, plain language, and low jargon make content easier for models to process and rephrase without loss of meaning.' },
                { icon: '❓', label: 'FAQ / Q&A presence', desc: 'FAQ blocks are the single highest-impact schema type for AI citations. Pages with explicit Q&A sections get cited at 3.2x the rate of those without.' },
                { icon: '✍️', label: 'BLUF rewrite', desc: 'The tool shows you a rewritten version of your opening sentences using BLUF structure — so you can see the before and after immediately.' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '.75rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',monospace", fontWeight: 600, fontSize: '.95rem', marginBottom: '.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION, textAlign: 'center' }}>
            <div style={EYEBROW}>FAQ</div>
            <h2 style={{ ...H2, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_READ} />
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