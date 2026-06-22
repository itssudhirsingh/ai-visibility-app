import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { EEATClient } from '@/components/EEATClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'E-E-A-T Audit Tool — Notion Cue',
  description: 'Audit your website\'s Experience, Expertise, Authoritativeness, and Trustworthiness signals. Free tool — get a pillar-by-pillar score with specific fixes for each AI engine.',
}

const FAQS_EEAT = [
  { q: 'What is E-E-A-T and why does it affect AI citations?', a: 'E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness — Google\'s quality framework that has been informally adopted by multiple LLM evaluation pipelines. Pages with strong E-E-A-T signals are treated as more credible sources by AI engines when deciding what to cite.' },
  { q: 'Which E-E-A-T pillar affects AI citations most?', a: 'Authoritativeness has the most direct effect on citation rate — it\'s the pillar most directly measured by backlink quality and external mentions, which are signals models have been trained to recognise as credibility markers. Trustworthiness follows closely, particularly the presence of SSL, real contact information, and accurate, non-exaggerated claims.' },
  { q: 'How quickly can E-E-A-T improvements affect citation rates?', a: 'Technical E-E-A-T signals — SSL, author schema, Organization markup, About page — can affect citation rates within 3-6 weeks as crawlers re-index updated pages. Authority signals like backlinks and external mentions take longer, typically 2-4 months, consistent with traditional SEO timelines.' },
  { q: 'Does this tool look at my actual page content?', a: 'Yes — it fetches your live page, checks the raw HTML for specific E-E-A-T signals (author schema, SSL, About page links, Organization markup, privacy policy presence), and sends the page content to the AI model for a deeper content-level analysis.' },
]

export default function EEATPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQS_EEAT.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
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
            <h1 style={H1}>E-E-A-T<br /><span style={{ color: 'var(--accent)' }}>Audit Tool</span></h1>
            <p style={LEAD}>Audit all four E-E-A-T pillars — Experience, Expertise, Authoritativeness, Trustworthiness — and get specific fixes per pillar, rated by effort and AEO impact.</p>
          </div>
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <EEATClient />
          </div>

          <section style={SECTION}>
            <div style={EYEBROW}>The four pillars</div>
            <h2 style={H2}>What AI engines read<br /><span style={{ color: 'var(--muted)' }}>before deciding to trust you.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { icon: '⚡', label: 'Experience', color: 'rgba(200,242,71,.2)', bc: 'rgba(200,242,71,.25)', desc: 'First-hand content signals — specific numbers, case studies, screenshots, and original data that couldn\'t have been written without direct involvement. AI engines increasingly reward this because it\'s genuinely hard to fabricate at scale.' },
                { icon: '🎓', label: 'Expertise', color: 'rgba(123,108,255,.2)', bc: 'rgba(123,108,255,.25)', desc: 'Author credential markup, byline schema, linked professional profiles, and depth of topical coverage per domain. A page with a named, credentialed author outperforms an anonymous equivalent in AI citation tests across all major engines.' },
                { icon: '🏅', label: 'Authoritativeness', color: 'rgba(34,211,238,.2)', bc: 'rgba(34,211,238,.25)', desc: 'Backlink quality from trusted domains, mentions in credible publications, and citation frequency across the web. The hardest pillar to improve quickly — but the one with the most durable long-term payoff.' },
                { icon: '🛡', label: 'Trustworthiness', color: 'rgba(244,114,182,.2)', bc: 'rgba(244,114,182,.25)', desc: 'SSL, a real privacy policy, transparent company ownership, accurate and non-exaggerated claims, and verifiable contact information. The easiest pillar to improve in a single afternoon — and one of the most commonly neglected.' },
              ].map(p => (
                <div key={p.label} style={{ background: 'var(--card)', border: `1px solid ${p.bc}`, borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: p.color, border: `1px solid ${p.bc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>{p.label}</div>
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.72)', lineHeight: 1.7 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION, textAlign: 'center' }}>
            <div style={EYEBROW}>FAQ</div>
            <h2 style={{ ...H2, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_EEAT} />
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