import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import GapFinderClient from '@/components/GapFinderClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'AI Answer Gap Finder — Find Questions AI Engines Answer Where No Brand Is Cited — Notion Cue',
  description: 'Find the top 20 questions AI engines answer in your niche where no brand is consistently cited. First-mover and displacement opportunities, scored by potential. Free tool.',
}

const FAQS_GF = [
  { q: 'What is an AI answer gap?', a: 'An AI answer gap is a question that AI engines like ChatGPT, Perplexity, and Gemini answer regularly, but where no brand is consistently cited as the source. These are first-mover opportunities — the first domain to publish a well-structured, BLUF-formatted page targeting that question can claim the citation before any competitor does. A displacement gap is similar: a competing brand is currently cited, but their content is weak enough that a better-structured page from you could displace it.' },
  { q: 'How is this different from keyword gap analysis?', a: 'Keyword gap analysis finds search terms your competitors rank for that you don\'t. AI answer gap analysis finds questions AI engines answer in your niche where the citation slot is either empty or weakly held. These are different datasets. A query can have high search volume and zero AI citation potential, or low search volume and extremely high citation potential because it\'s a definitional or how-to question that LLMs quote directly. The gap finder prioritises the second type.' },
  { q: 'Should I enter my domain or just a niche description?', a: 'Both work. If you enter your domain, the tool fetches your homepage content to infer your niche automatically — useful if your niche is specific and hard to describe in a few words. If you enter a niche description directly, you get gaps for that topic regardless of what\'s on your site. The niche mode is useful for exploring a new content vertical before committing to it.' },
  { q: 'What does "opportunity score" mean?', a: 'The opportunity score (0-100) combines gap type, estimated search volume, query intent, and content competition level. A first-mover gap with high search volume and a how-to intent scores near 100 — these are the highest-leverage pieces to create. A displacement gap with low volume and strong competitor content scores lower, even though it\'s still a real opportunity.' },
  { q: 'How do I use the results with the Content Brief Generator?', a: 'Take any gap from this tool and paste the question directly into the Content Brief Generator as your primary keyword. The brief will then generate a BLUF opening, full section outline, FAQ blocks, schema recommendations, and E-E-A-T signals — everything you need to write a page that can win the citation for that specific question.' },
]

export default function GapFinderPage() {
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS_GF.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{SHARED_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader /><SubNavClient />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW_STYLE}>Tools</div>
            <h1 style={H1_STYLE}>AI Answer<br /><span style={{ color: 'var(--accent)' }}>Gap Finder</span></h1>
            <p style={LEAD_STYLE}>Find the 20 questions AI engines answer in your niche where no brand is consistently cited — or where a competitor holds a weak citation you can displace. Each gap comes with a winning content angle, recommended format, and opportunity score.</p>
          </div>

          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <GapFinderClient />
          </div>

          {/* HOW TO USE */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How to use this tool</div>
            <h2 style={H2_STYLE}>Find a gap, brief the content,<br /><span style={{ color: 'var(--muted)' }}>claim the citation.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '2rem' }}>
              {[
                { n: '01', title: 'Enter domain or niche', desc: 'Paste your domain for auto-detection, or describe your niche directly. Add competitor URLs for displacement gap analysis.' },
                { n: '02', title: 'Review 20 gaps', desc: 'Sort by opportunity score or search volume. Filter between first-mover (unclaimed) and displacement (weakly held) gaps.' },
                { n: '03', title: 'Copy the brief', desc: 'Each gap has a "Copy brief" button that copies the question, format, word count, schema recommendation, and winning angle in one click.' },
                { n: '04', title: 'Generate full brief', desc: 'Paste any gap question into the Content Brief Generator to get a full AEO brief — BLUF opening, outline, FAQs, and E-E-A-T signals ready to hand to a writer.' },
              ].map(s => (
                <div key={s.n} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'var(--accent)', marginBottom: '.65rem' }}>{s.n}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', marginBottom: '.5rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WHY GAPS EXIST */}
          <section style={SECTION_STYLE}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div style={EYEBROW_STYLE}>Why AI answer gaps exist</div>
                <h2 style={H2_STYLE}>AI search is three years old.<br /><span style={{ color: 'var(--muted)' }}>Most niches are still wide open.</span></h2>
                <p style={PROSE_STYLE}>AI answer engines have existed in their current form since late 2022. Three years is not long enough for any niche to be fully saturated with well-structured, citation-ready content. In most B2B and B2C categories, the majority of questions AI engines answer are either pulling from weak, thin content or from no clearly identifiable source at all.</p>
                <p style={PROSE_STYLE}>This is fundamentally different from the situation in traditional SEO, where competitive niches have been optimised since the late 1990s and genuinely ranking for new terms requires either significant authority or a long tail approach. In AI search, the equivalent of "ranking" — being the cited source — is still available for surprisingly competitive queries if your content is structured correctly.</p>
                <p style={PROSE_STYLE}>The window is narrowing. As more brands invest in AEO, the number of unclaimed first-mover gaps will shrink. The brands moving now get to claim the high-volume, high-intent gaps in their category before competitors recognise the opportunity. The Gap Finder surfaces exactly these windows — ranked by how valuable they are and how quickly they need to be claimed.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(200,242,71,.05)', border: '1px solid rgba(200,242,71,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '.75rem' }}>First-mover gaps</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>No brand is consistently cited when AI engines answer this question. The first domain to publish a well-structured page targeting it claims the citation slot before any competition exists. These are the highest-value gaps — once claimed, they tend to hold for months.</p>
                </div>
                <div style={{ background: 'rgba(244,114,182,.05)', border: '1px solid rgba(244,114,182,.2)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '.75rem' }}>Displacement gaps</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>A competitor is currently cited, but their page is structurally weak — no BLUF opening, no schema, thin content. A better-structured page from you can displace them. These gaps are validated by a competitor's existing success at the topic level, making them lower-risk than first-mover gaps.</p>
                </div>
              </div>
            </div>
          </section>

          {/* HOW AI ENGINES SELECT CITED CONTENT */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How AI engines decide what to cite</div>
            <h2 style={H2_STYLE}>Four factors determine<br /><span style={{ color: 'var(--muted)' }}>which page wins the citation.</span></h2>
            <p style={{ ...PROSE_STYLE, maxWidth: '700px', marginTop: '1rem', marginBottom: '2rem' }}>Understanding why gaps exist tells you how to close them. AI engines aren't arbitrary about which content they cite — they follow identifiable patterns that map directly to the content and technical decisions you make when publishing.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
              {[
                { icon: '⚡', title: 'Query-answer match', desc: 'The page that answers the question most directly in its first sentence wins citation over a page that answers it in paragraph three, regardless of which page has more total content or better SEO authority. This is the single most fixable factor — and the one most sites ignore.' },
                { icon: '🏗', title: 'Content structure', desc: 'FAQ blocks, numbered lists, and clear heading hierarchy all help models extract clean, quotable answers. Pages structured for scanning outperform pages structured for narrative reading, even when the underlying information is identical.' },
                { icon: '🏅', title: 'Domain authority', desc: 'When two pages are structurally similar, the domain with more backlinks, more E-E-A-T signals, and more consistent external mentions wins. Authority matters — but it\'s the tiebreaker, not the primary signal for most gap opportunities.' },
                { icon: '⚙️', title: 'Technical access', desc: 'A page that\'s blocked in robots.txt for AI bots, served only via JavaScript, or sitting behind a login wall simply can\'t be cited regardless of content quality. Technical access is the prerequisite — everything else is irrelevant if the bot can\'t read the page.' },
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

          {/* WHO IT HELPS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>Who benefits</div>
            <h2 style={H2_STYLE}>Content teams who need to know<br /><span style={{ color: 'var(--muted)' }}>what to write before they write it.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { role: 'Content strategists', desc: 'Planning a content calendar without knowing which questions AI engines answer without a strong source is planning blind. The Gap Finder gives you a ranked list of genuinely unclaimed content opportunities — by opportunity score, search volume, and recommended format — in under a minute.' },
                { role: 'SEO professionals', desc: 'Traditional keyword gap tools show you where competitors rank that you don\'t. This tool shows you where no one is consistently cited in AI answers — a fundamentally different and more actionable insight for clients starting their AEO investment.' },
                { role: 'Growth marketers', desc: 'For B2B SaaS and service brands, being cited when someone asks ChatGPT "what\'s the best tool for X" is a direct acquisition channel. The gap finder identifies exactly which "best for X" and "how to do Y" questions in your category are unclaimed in AI answers.' },
              ].map(c => (
                <div key={c.role} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '.75rem' }}>{c.role}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION_STYLE, textAlign: 'center', paddingBottom: '6rem' }}>
            <div style={EYEBROW_STYLE}>FAQ</div>
            <h2 style={{ ...H2_STYLE, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_GF} />
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