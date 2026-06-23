import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { EEATClient } from '@/components/EEATClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'Free E-E-A-T Audit Tool — Check Your AI Citation Signals | NotionCue',
  description: 'Audit your website\'s Experience, Expertise, Authoritativeness, and Trustworthiness signals free. Get a pillar-by-pillar E-E-A-T score with specific fixes ranked by AEO impact — works for ChatGPT, Gemini, Perplexity, and Claude.',
}

const FAQS_EEAT = [
  { q: 'What is E-E-A-T and why does it affect AI citations?', a: 'E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness — Google\'s quality framework that has been informally adopted by multiple LLM evaluation pipelines. Pages with strong E-E-A-T signals are treated as more credible sources by AI engines when deciding what to cite.' },
  { q: 'Which E-E-A-T pillar affects AI citations most?', a: 'Authoritativeness has the most direct effect on citation rate — it\'s the pillar most directly measured by backlink quality and external mentions, which are signals models have been trained to recognise as credibility markers. Trustworthiness follows closely, particularly the presence of SSL, real contact information, and accurate, non-exaggerated claims.' },
  { q: 'How quickly can E-E-A-T improvements affect citation rates?', a: 'Technical E-E-A-T signals — SSL, author schema, Organization markup, About page — can affect citation rates within 3–6 weeks as crawlers re-index updated pages. Authority signals like backlinks and external mentions take longer, typically 2–4 months, consistent with traditional SEO timelines.' },
  { q: 'Does this tool look at my actual page content?', a: 'Yes — it fetches your live page, checks the raw HTML for specific E-E-A-T signals (author schema, SSL, About page links, Organization markup, privacy policy presence), and sends the page content to the AI model for a deeper content-level analysis.' },
  { q: 'Is E-E-A-T a direct Google ranking factor?', a: 'Google has confirmed E-E-A-T is not a single direct ranking factor but a framework used by quality raters to evaluate pages. However, the individual signals that comprise E-E-A-T — backlinks, author markup, SSL, content accuracy — are well-established ranking inputs. In practice, pages with strong E-E-A-T consistently rank higher in both traditional search and AI-generated answers.' },
  { q: 'Does E-E-A-T apply to all content types?', a: 'E-E-A-T carries more weight for YMYL (Your Money or Your Life) content — health, finance, legal, and safety topics — where misinformation has real consequences. But AI engines apply credibility checks broadly. A product page, a how-to guide, and a news article are all evaluated against at least basic trust signals before an AI engine will cite them.' },
]

export default function EEATPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_EEAT.map(f => ({
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
            <h1 style={H1}>E-E-A-T<br /><span style={{ color: 'var(--accent)' }}>Audit Tool</span></h1>
            <p style={LEAD}>
              Run a full E-E-A-T audit on any URL in under 30 seconds. Get a scored breakdown across all four pillars — Experience, Expertise, Authoritativeness, Trustworthiness — with prioritised fixes and their estimated impact on AI citation rates.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {['Free — no account needed', 'Works on any public URL', 'Results in under 30 seconds'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '.8rem' }}>✓</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.55)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tool ── */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <EEATClient />
          </div>

          {/* ── How to use ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>How it works</div>
            <h2 style={H2}>Run your first audit<br /><span style={{ color: 'var(--muted)' }}>in three steps.</span></h2>
            <p style={{ ...PROSE, maxWidth: 620, marginBottom: '2.5rem' }}>
              The tool fetches your live page, parses the HTML for technical E-E-A-T signals, then passes the page content to an AI model for a deeper content-level review. The output is a scored report you can act on today.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {[
                {
                  step: '01',
                  title: 'Enter your URL',
                  color: 'rgba(200,242,71,.15)',
                  bc: 'rgba(200,242,71,.2)',
                  body: 'Paste any public URL — a homepage, a blog post, a landing page, a product page. The tool works on any live page it can fetch. If your page is behind a login or staging gate, it won\'t be able to access it.',
                },
                {
                  step: '02',
                  title: 'We scan the signals',
                  color: 'rgba(123,108,255,.15)',
                  bc: 'rgba(123,108,255,.2)',
                  body: 'The tool checks SSL status, author schema markup, Organization structured data, About and Privacy page links, byline presence, and content credibility signals. It cross-references your HTML against the full E-E-A-T signal checklist.',
                },
                {
                  step: '03',
                  title: 'Get your action list',
                  color: 'rgba(34,211,238,.15)',
                  bc: 'rgba(34,211,238,.2)',
                  body: 'Each pillar gets an individual score. Fixes are ranked by effort vs. AEO impact — so you can see which changes will move your AI citation rate the most, and which are quick wins you can ship this afternoon.',
                },
              ].map(s => (
                <div key={s.step} style={{ background: 'var(--card)', border: `1px solid ${s.bc}`, borderRadius: 14, padding: '1.75rem', position: 'relative' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '2rem', fontWeight: 300, color: s.bc, marginBottom: '1rem', lineHeight: 1 }}>{s.step}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '.6rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.75 }}>{s.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Four pillars ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>The four pillars</div>
            <h2 style={H2}>What AI engines evaluate<br /><span style={{ color: 'var(--muted)' }}>before citing your content.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Google introduced E-E-A-T in the 2022 update to its Search Quality Evaluator Guidelines. Adding the first "E" for Experience was a direct response to AI-generated content flooding search results — Google needed a signal that separated people who had actually done the thing from people who had read about it. LLMs have since absorbed the same logic into their own source selection.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
              {[
                {
                  icon: '⚡', label: 'Experience', color: 'rgba(200,242,71,.2)', bc: 'rgba(200,242,71,.25)',
                  desc: 'First-hand signals: specific numbers, named clients, before-and-after case studies, original screenshots, and data that couldn\'t have been written without direct involvement. AI engines weight this heavily because it\'s genuinely hard to fabricate at scale. A page that says "we increased conversion by 34% over 90 days" gives an AI engine something it can pin credibility to. A page that says "our approach drives results" gives it nothing.',
                  signals: ['Original data or research', 'Named case studies', 'First-person author bylines', 'Dates and version history'],
                },
                {
                  icon: '🎓', label: 'Expertise', color: 'rgba(123,108,255,.2)', bc: 'rgba(123,108,255,.25)',
                  desc: 'Author credential markup, byline schema, linked professional profiles, and depth of topical coverage within a single domain. A page with a named, credentialed author consistently outperforms an anonymous equivalent in AI citation tests. Google\'s quality raters are specifically trained to look for author pages, professional qualifications, and linked external profiles like LinkedIn or Google Scholar.',
                  signals: ['Author schema markup', 'Linked credentials / profiles', 'About the author section', 'Depth of topical coverage'],
                },
                {
                  icon: '🏅', label: 'Authoritativeness', color: 'rgba(34,211,238,.2)', bc: 'rgba(34,211,238,.25)',
                  desc: 'Backlink quality from trusted domains, mentions in credible publications, citation frequency across the web, and brand search volume. This is the hardest pillar to move quickly — there\'s no shortcut to being mentioned by the BBC or cited in a peer-reviewed paper. But it has the most durable long-term effect on citation rate because it operates at the domain level, not just the page level.',
                  signals: ['Backlinks from authoritative domains', 'Press mentions and media coverage', 'Wikipedia citations', 'Brand search volume'],
                },
                {
                  icon: '🛡', label: 'Trustworthiness', color: 'rgba(244,114,182,.2)', bc: 'rgba(244,114,182,.25)',
                  desc: 'SSL certificate, a real privacy policy, transparent company ownership, verifiable contact information, and accurate claims free of exaggeration. The easiest pillar to improve in a single afternoon — and one of the most commonly neglected by small sites. An AI engine that can\'t verify who owns a site, where it\'s based, or how to contact its team will deprioritise it as a citation source regardless of content quality.',
                  signals: ['SSL (HTTPS)', 'Privacy policy and terms pages', 'Contact page with real details', 'Organization schema markup'],
                },
              ].map(p => (
                <div key={p.label} style={{ background: 'var(--card)', border: `1px solid ${p.bc}`, borderRadius: 14, padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.85rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color, border: `1px solid ${p.bc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>{p.label}</div>
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.72)', lineHeight: 1.75, marginBottom: '1.25rem' }}>{p.desc}</div>
                  <div style={{ borderTop: `1px solid ${p.bc}`, paddingTop: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '.6rem' }}>Key signals</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                      {p.signals.map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                          <span style={{ color: p.bc, fontSize: '.7rem' }}>→</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.5)' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── How Google tracks E-E-A-T ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Under the hood</div>
            <h2 style={H2}>How Google measures<br /><span style={{ color: 'var(--muted)' }}>what you can\'t fake.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', marginTop: '2rem' }}>
              <div>
                <p style={PROSE}>
                  Google doesn\'t publish the exact formula. What it does publish is the 176-page Search Quality Evaluator Guidelines, which trains human raters to score pages against E-E-A-T criteria. Those scores feed back into algorithm development — not directly into rankings, but as training signal for the systems that do.
                </p>
                <p style={PROSE}>
                  In practice, Google tracks E-E-A-T through a combination of on-page signals, off-page signals, and entity signals. On-page: structured data, author markup, content accuracy, citation of primary sources. Off-page: link graph quality, brand mentions in trusted publications, co-citation patterns. Entity: whether your brand, author, or organisation appears in the Knowledge Graph with consistent NAP data (Name, Address, Phone).
                </p>
                <p style={PROSE}>
                  PageRank is still a component of authority measurement. But modern Google weaves in link quality (not just quantity), topical relevance of linking domains, and anchor text distribution. A single link from a respected industry publication typically outweighs fifty links from unrelated directories.
                </p>
                <p style={PROSE}>
                  For AI engines, the mechanism is different but the outcome is the same. LLMs are trained on text corpora where credible sources are naturally more prevalent and more frequently cited by other credible sources. A page with strong E-E-A-T signals appears more often in that training data, gets cited more by other trusted pages in it, and therefore carries more weight when the model decides what to reference in an answer.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Structured data parsing', desc: 'Google\'s crawlers extract author, organisation, and article schema from your HTML. If your author schema links to a named Person entity with a matching sameAs property pointing to a Wikipedia page or Google Scholar profile, your Expertise score gets a measurable boost.', icon: '🔍' },
                  { label: 'Link graph analysis', desc: 'The quality and topical relevance of pages linking to yours feeds into your Authority score. Google uses link graph analysis to build a picture of which sites are trusted within a given topic cluster — and whether yours is one of them.', icon: '🕸' },
                  { label: 'Entity recognition', desc: 'Google\'s Knowledge Graph stores entities — people, organisations, places, products. If your brand exists in the graph with consistent information, crawlers can verify claims on your site against that record. Inconsistencies flag trust problems.', icon: '🏢' },
                  { label: 'Content accuracy signals', desc: 'NLP models compare factual claims on your page against known facts in Google\'s knowledge base. Exaggerated statistics, undated claims, and unverified numbers are negative trust signals — even if a human reader wouldn\'t notice them.', icon: '✅' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.95rem', marginBottom: '.4rem' }}>{item.label}</div>
                      <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Who it helps ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Who benefits</div>
            <h2 style={H2}>Built for anyone<br /><span style={{ color: 'var(--muted)' }}>who wants to be cited by AI.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              E-E-A-T matters most for sites operating in competitive or high-stakes verticals — but the fundamentals apply to any site that wants AI engines to treat it as a credible source. Here\'s who gets the most out of this audit.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[
                {
                  role: 'SEO Professionals',
                  icon: '📈',
                  bc: 'rgba(200,242,71,.2)',
                  points: [
                    'Identify E-E-A-T gaps before a site audit',
                    'Benchmark clients against competitors',
                    'Translate AEO signals into a prioritised roadmap',
                    'Track improvements after schema and content changes',
                  ],
                },
                {
                  role: 'Content Marketers',
                  icon: '✍️',
                  bc: 'rgba(123,108,255,.2)',
                  points: [
                    'Check whether new content meets AI credibility thresholds',
                    'Find missing author signals before publishing',
                    'Understand why a competitor gets cited more than you',
                    'Optimise YMYL content for AI search snippets',
                  ],
                },
                {
                  role: 'Founders & In-house Teams',
                  icon: '🏢',
                  bc: 'rgba(34,211,238,.2)',
                  points: [
                    'Audit your own site without an agency',
                    'Fix trust signals that are costing you AI citations',
                    'Get a clear picture of where your domain sits on authority',
                    'Understand what\'s holding back your AI search visibility',
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

          {/* ── Practical improvements ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Practical fixes</div>
            <h2 style={H2}>Changes you can make<br /><span style={{ color: 'var(--muted)' }}>this week.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Most E-E-A-T problems are technical, not editorial. You don\'t need to rewrite your content from scratch. You need to give crawlers the right structured data to read it correctly. Below are the highest-impact fixes for each pillar — ranked by how quickly they affect citation rates.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[
                { pillar: 'Trustworthiness', effort: 'Low effort', impact: 'High impact', color: 'rgba(244,114,182,.6)', fix: 'Add Organization schema to your homepage. Include legalName, url, logo, contactPoint, and sameAs pointing to your social profiles. This gives every AI engine crawling your site a machine-readable trust record to verify your identity against.' },
                { pillar: 'Trustworthiness', effort: 'Low effort', impact: 'High impact', color: 'rgba(244,114,182,.6)', fix: 'Create or improve your About page. Name the founders, list the company\'s history, and include a physical address or at least a country of incorporation. Anonymity is a trust deficit — crawlers register it.' },
                { pillar: 'Expertise', effort: 'Low effort', impact: 'High impact', color: 'rgba(123,108,255,.6)', fix: 'Add Person schema to every article with a byline. Map the author\'s name, jobTitle, url, and sameAs to a LinkedIn or professional profile page. A named author with verifiable credentials consistently outperforms "Staff Writer" in citation audits.' },
                { pillar: 'Experience', effort: 'Medium effort', impact: 'High impact', color: 'rgba(200,242,71,.6)', fix: 'Add a date to every page that contains factual claims. AI engines treat undated content as lower quality because they can\'t verify how current the information is. Use datePublished and dateModified in your Article schema.' },
                { pillar: 'Experience', effort: 'Medium effort', impact: 'High impact', color: 'rgba(200,242,71,.6)', fix: 'Replace vague performance claims with specific, verifiable ones. "We help businesses grow" tells an AI engine nothing. "We\'ve run 430 campaigns across SaaS and e-commerce since 2018" gives it something to work with.' },
                { pillar: 'Authoritativeness', effort: 'High effort', impact: 'Very high impact', color: 'rgba(34,211,238,.6)', fix: 'Build one genuinely authoritative resource per quarter — an original study, a detailed industry survey, or a comprehensive guide with primary data. Pages that generate natural backlinks from credible domains move your authority score more than any technical fix.' },
                { pillar: 'Authoritativeness', effort: 'Medium effort', impact: 'Medium impact', color: 'rgba(34,211,238,.6)', fix: 'Get your brand into your industry\'s Wikipedia pages as a cited source. Wikipedia backlinks are no-follow, but Wikipedia is in every LLM\'s training data. Being cited there is one of the clearest authority signals available to an AI engine.' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 100px 120px 1fr', gap: '1.25rem', alignItems: 'center', background: 'var(--card)', padding: '1rem 1.5rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: row.color, fontWeight: 500 }}>{row.pillar}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.38)', background: 'rgba(255,255,255,.04)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{row.effort}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: row.color, background: `${row.color}10`, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{row.impact}</span>
                  <span style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.65 }}>{row.fix}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
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
  @media(max-width:768px){
    .eeat-grid-2{grid-template-columns:1fr !important}
    .eeat-grid-3{grid-template-columns:1fr !important}
    .eeat-fix-row{grid-template-columns:1fr !important}
    .eeat-fix-row span:nth-child(2),.eeat-fix-row span:nth-child(3){display:none}
  }
`

const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '600px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }