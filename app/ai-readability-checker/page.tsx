import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import { ReadabilityClient } from '@/components/ReadabilityClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'Free AI Readability Score — Check Content for AI Citations | NotionCue',
  description: 'Score any page or text for AI citation readability. Checks BLUF structure, answer density, content clarity, heading hierarchy, and FAQ presence. Free — paste a URL or your own text and get fixes in seconds.',
}

const FAQS_READ = [
  { q: 'What does the AI Readability Score measure?', a: 'Five dimensions: BLUF structure (does it answer in the first 2 sentences), answer density (ratio of direct answers to total words), content structure (heading hierarchy, bullets, scannable format), sentence clarity (plain language, low jargon), and FAQ/Q&A presence. These are the factors most correlated with AI engine citation rates.' },
  { q: 'Can I paste text directly instead of a URL?', a: 'Yes — toggle to "Paste text" mode and paste any content directly. This is useful for drafts that aren\'t published yet, or for content behind a login wall.' },
  { q: 'What grade should I aim for?', a: 'A B or above (score 70+) is the realistic target for strong AI citation potential. An A (90+) is achievable on pages specifically written with BLUF structure and FAQ blocks. C and below indicates the content is burying its answer — the most common reason pages don\'t get cited despite being topically relevant.' },
  { q: 'Is this the same as a regular readability score like Flesch-Kincaid?', a: 'No — traditional readability scores measure sentence length and syllable count, optimised for human comprehension. This tool scores for AI retrievability — how quickly and cleanly a language model can extract a direct answer from the content, which is a different dimension entirely.' },
  { q: 'Does sentence length actually affect AI citation rates?', a: 'Yes, but not in isolation. Sentences under 20 words are easier for models to parse without ambiguity, but the bigger factor is specificity. A short vague sentence scores lower than a slightly longer sentence with a concrete, verifiable claim. The tool evaluates both length and specificity together as part of the sentence clarity dimension.' },
  { q: 'What is BLUF and why does it matter for AI?', a: 'BLUF stands for Bottom Line Up Front — a military writing principle that puts the conclusion first and the supporting detail after. LLMs extract answers by weighting the opening sentences of a page 4–8x more heavily than the rest. A page that buries its answer in paragraph four will consistently lose citations to a page that states the same answer in sentence one, even if the buried version is more thorough.' },
  { q: 'How often should I re-check my content\'s readability score?', a: 'After any significant content update, before publishing a new article targeting a competitive query, and whenever you notice a page has dropped out of AI-generated answers it previously appeared in. The score reflects your current live page, so changes you make will show up immediately on a re-run.' },
]

export default function ReadabilityPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_READ.map(f => ({
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
            <h1 style={H1}>AI Readability<br /><span style={{ color: 'var(--accent)' }}>Score</span></h1>
            <p style={LEAD}>
              Paste a URL or raw text and get a scored breakdown across five AI-readability dimensions — plus a BLUF rewrite of your opening sentences, ready to copy in. Find out exactly why AI engines skip your content and what to change first.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {['Free — no account needed', 'Works on URLs or pasted text', 'BLUF rewrite included'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '.8rem' }}>✓</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.55)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tool ── */}
          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <ReadabilityClient />
          </div>

          {/* ── How to use ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>How it works</div>
            <h2 style={H2}>Score your content<br /><span style={{ color: 'var(--muted)' }}>in three steps.</span></h2>
            <p style={{ ...PROSE, maxWidth: 620, marginBottom: '2.5rem' }}>
              The tool analyses your content against the five signals most correlated with AI citation rates. You can run it on any live page or paste content directly — useful for drafts, gated pages, or content you're editing before it goes live.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {[
                {
                  step: '01',
                  title: 'Enter a URL or paste text',
                  color: 'rgba(200,242,71,.15)',
                  bc: 'rgba(200,242,71,.2)',
                  body: 'For a live page, paste the URL and the tool fetches the content directly. For drafts or content behind a login, switch to text mode and paste your copy. Both routes run the same five-dimension analysis.',
                },
                {
                  step: '02',
                  title: 'We score five AI dimensions',
                  color: 'rgba(123,108,255,.15)',
                  bc: 'rgba(123,108,255,.2)',
                  body: 'The tool checks BLUF structure, answer density, content structure, sentence clarity, and FAQ presence. Each dimension is scored independently so you can see exactly which one is dragging your overall grade down.',
                },
                {
                  step: '03',
                  title: 'Get your score and rewrite',
                  color: 'rgba(34,211,238,.15)',
                  bc: 'rgba(34,211,238,.2)',
                  body: 'Your overall grade (A through F) appears alongside a per-dimension breakdown and a BLUF-rewritten version of your opening sentences. Copy the rewrite directly into your content or use it as a model for the full page.',
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

          {/* ── Five dimensions ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>How scoring works</div>
            <h2 style={H2}>Five things AI engines<br /><span style={{ color: 'var(--muted)' }}>check before citing your content.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Traditional readability tools measure sentence length and syllable count — metrics built for human comprehension. AI readability is a different problem. A model extracting an answer from your page cares about answer location, answer density, and structural clarity. These five dimensions capture what actually predicts citation rate.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {[
                {
                  icon: '⚡',
                  label: 'BLUF Structure',
                  weight: '30% of score',
                  color: 'rgba(200,242,71,.15)',
                  bc: 'rgba(200,242,71,.25)',
                  tc: '#c8f247',
                  desc: 'Does the page state its main answer in the first two sentences? LLMs weight the opening 50–80 words 4–8x more heavily than the rest of the page when extracting a quotable response. A page that opens with context-setting background before getting to the point will consistently lose citations to a page that leads with the answer.',
                  tip: 'Rewrite your H1 and opening sentence so that together they answer the page\'s primary question directly. The supporting detail can follow.',
                },
                {
                  icon: '📊',
                  label: 'Answer Density',
                  weight: '25% of score',
                  color: 'rgba(123,108,255,.15)',
                  bc: 'rgba(123,108,255,.25)',
                  tc: '#7b6cff',
                  desc: 'The ratio of direct, specific answers to total word count. A 2,000-word page with 400 words of genuine answers scores higher than a 600-word page with 100 words of answers. Filler, transition paragraphs, and brand storytelling dilute density — which is why long-form content often underperforms shorter, denser pages in AI citation tests.',
                  tip: 'Cut every sentence that doesn\'t add a new fact, clarification, or example. Then check if what remains actually answers the question.',
                },
                {
                  icon: '🗂',
                  label: 'Content Structure',
                  weight: '20% of score',
                  color: 'rgba(34,211,238,.15)',
                  bc: 'rgba(34,211,238,.25)',
                  tc: '#22d3ee',
                  desc: 'Clear heading hierarchy, scannable bullet points, numbered lists for sequential steps, and logical section flow. Models extract content in chunks bounded by headings and list items. A wall of prose gives the model one undifferentiated block to work from. A page with clear H2s and structured lists gives it clean, citable units.',
                  tip: 'Every H2 should be answerable as a standalone question. If it reads like a topic label ("Our Approach") rather than a question or answer ("How X works"), rewrite it.',
                },
                {
                  icon: '💬',
                  label: 'Sentence Clarity',
                  weight: '15% of score',
                  color: 'rgba(244,114,182,.15)',
                  bc: 'rgba(244,114,182,.25)',
                  tc: '#f472b6',
                  desc: 'Short sentences, plain language, low jargon, and high specificity. Vague declaratives ("our solution drives results") score near zero because they can\'t be cited as factual claims. Specific statements ("response time dropped from 4.2s to 1.1s after switching to edge hosting") score high because they give the model something concrete to quote.',
                  tip: 'Run a ctrl+F for the word "solution", "leverage", "innovative", and "seamless". Replace every hit with the specific thing you\'re actually describing.',
                },
                {
                  icon: '❓',
                  label: 'FAQ / Q&A Presence',
                  weight: '10% of score',
                  color: 'rgba(255,196,92,.15)',
                  bc: 'rgba(255,196,92,.25)',
                  tc: '#ffc45c',
                  desc: 'Pages with explicit FAQ blocks get cited at 3.2x the rate of pages without them. The reason is structural: a question-and-answer pair is the exact format an LLM is being asked to produce. A page that pre-formats its content as Q&A gives the model a ready-made answer it can extract with minimal transformation.',
                  tip: 'Add a FAQ section to any page targeting an informational query. Five questions minimum, each answered in 2–4 sentences. Add FAQPage schema to make it machine-readable.',
                },
                {
                  icon: '✍️',
                  label: 'BLUF Rewrite',
                  weight: 'Bonus output',
                  color: 'rgba(82,227,142,.15)',
                  bc: 'rgba(82,227,142,.25)',
                  tc: '#52e38e',
                  desc: 'Beyond your score, the tool generates a BLUF-rewritten version of your opening sentences. This isn\'t a generic suggestion — it\'s a rewrite of your actual content, restructured to lead with the answer. You can copy it directly into your page or use it as a reference for rewriting the rest of the section.',
                  tip: 'Compare the rewrite against your original. The gap between them is your BLUF deficit — the information your readers (and AI engines) have to dig for before getting the answer.',
                },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--card)', border: `1px solid ${s.bc}`, borderRadius: 14, padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color, border: `1px solid ${s.bc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{s.icon}</div>
                      <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.95rem' }}>{s.label}</div>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: s.tc, background: `${s.tc}12`, border: `1px solid ${s.tc}25`, padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>{s.weight}</span>
                  </div>
                  <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.68)', lineHeight: 1.72, marginBottom: '1rem' }}>{s.desc}</div>
                  <div style={{ borderTop: `1px solid ${s.bc}`, paddingTop: '.85rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '.4rem' }}>Quick fix</div>
                    <div style={{ fontSize: '.8rem', color: s.tc, lineHeight: 1.6 }}>{s.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── AI readability vs traditional ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>AI vs traditional readability</div>
            <h2 style={H2}>Why Flesch-Kincaid<br /><span style={{ color: 'var(--muted)' }}>doesn't predict AI citations.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', marginTop: '2rem' }}>
              <div>
                <p style={PROSE}>
                  Rudolf Flesch developed his readability formula in 1948 to help the US Army write clearer field manuals. The formula counts syllables and sentence length — a reasonable proxy for how hard a human finds text to read. Copywriters and content teams have used variants of it ever since.
                </p>
                <p style={PROSE}>
                  It tells you nothing useful about AI citation rates. A page written at a sixth-grade reading level with short sentences and simple words can still score an F on AI readability if it buries the answer in paragraph six. Conversely, a technically dense page with long sentences can score an A if it leads with a precise, direct answer and structures the rest as clearly labelled sections.
                </p>
                <p style={PROSE}>
                  The difference comes down to what's being optimised. Flesch-Kincaid optimises for human comprehension — the experience of reading through a document linearly. AI readability optimises for machine extraction — the ability of a model to locate and quote a specific answer from anywhere in the document without reading the whole thing.
                </p>
                <p style={PROSE}>
                  LLMs don't read your page from top to bottom the way a person does. They tokenise it, weight different sections by position and structure, and pull the highest-confidence answer chunk. A page that's structured for that process — BLUF opening, headed sections, FAQ block — performs well regardless of sentence complexity. A page that reads beautifully but puts its conclusions last performs poorly.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,.03)', padding: '.75rem 1.25rem', gap: '1rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Signal</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Traditional</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: '#c8f247', letterSpacing: '.08em', textTransform: 'uppercase' }}>AI Readability</div>
                </div>
                {[
                  { signal: 'Sentence length', trad: 'Shorter = better', ai: 'Irrelevant if specific' },
                  { signal: 'Answer position', trad: 'Not measured', ai: 'Critical — first 80 words' },
                  { signal: 'Syllable count', trad: 'Fewer = better', ai: 'Not measured' },
                  { signal: 'FAQ blocks', trad: 'Not measured', ai: '3.2x citation lift' },
                  { signal: 'Heading structure', trad: 'Minor factor', ai: 'Major extraction signal' },
                  { signal: 'Answer density', trad: 'Not measured', ai: 'Core scoring dimension' },
                  { signal: 'Schema markup', trad: 'Not measured', ai: 'Directly boosts citations' },
                  { signal: 'Jargon level', trad: 'Lower = better', ai: 'Specificity > simplicity' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--card)', padding: '.85rem 1.25rem', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.6)' }}>{row.signal}</span>
                    <span style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.38)' }}>{row.trad}</span>
                    <span style={{ fontSize: '.8rem', color: '#c8f247' }}>{row.ai}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Who it helps ── */}
          <section style={SECTION}>
            <div style={EYEBROW}>Who benefits</div>
            <h2 style={H2}>Every team publishing content<br /><span style={{ color: 'var(--muted)' }}>that should be cited by AI.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Content that scores well on traditional SEO metrics often performs poorly in AI search. This tool is for any team that's noticed the gap — pages ranking on page one that never appear in AI-generated answers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[
                {
                  role: 'Content Writers',
                  icon: '✍️',
                  bc: 'rgba(200,242,71,.2)',
                  points: [
                    'Check drafts before publishing for AI citation potential',
                    'Get a BLUF rewrite of your opening to test against your own',
                    'Identify which paragraphs are dragging down answer density',
                    'Understand why a competitor\'s shorter article gets cited more',
                  ],
                },
                {
                  role: 'SEO & AEO Teams',
                  icon: '📈',
                  bc: 'rgba(123,108,255,.2)',
                  points: [
                    'Audit existing content for AI readability gaps at scale',
                    'Prioritise rewrites by current readability score',
                    'Build a content brief standard based on score thresholds',
                    'Track before/after scores after structural content changes',
                  ],
                },
                {
                  role: 'Founders & Marketers',
                  icon: '🏢',
                  bc: 'rgba(34,211,238,.2)',
                  points: [
                    'Check your homepage and key landing pages without an agency',
                    'Find out why your content doesn\'t appear in ChatGPT answers',
                    'Get specific fixes rather than generic writing advice',
                    'Run a competitor\'s URL to understand their content structure',
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
            <h2 style={H2}>How to move from a C<br /><span style={{ color: 'var(--muted)' }}>to an A without rewriting everything.</span></h2>
            <p style={{ ...PROSE, maxWidth: 640, marginBottom: '2.5rem' }}>
              Most pages score C or below not because the content is bad but because it's structured for a human reader scanning from top to bottom. Restructuring for AI extraction is usually faster than rewriting — you're moving and reformatting existing content, not generating new ideas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[
                { dim: 'BLUF', effort: 'Low effort', impact: 'Very high', color: '#c8f247', fix: 'Rewrite your first sentence to state the page\'s primary answer directly. If your page is "How to improve Core Web Vitals", your first sentence should be the answer — not background on why Core Web Vitals exist. Move all context-setting to paragraph two or below.' },
                { dim: 'BLUF', effort: 'Low effort', impact: 'High', color: '#c8f247', fix: 'Add a TL;DR or key takeaway box immediately below your H1. A 2–3 sentence summary at the top of the page gives AI engines a clean, pre-formatted answer chunk before they process the rest of the content.' },
                { dim: 'Answer density', effort: 'Medium effort', impact: 'High', color: '#7b6cff', fix: 'Delete your introduction section. Most introductions restate the title, explain what the article will cover, and promise to answer the question — without actually answering it. Cut to the first substantive paragraph and your answer density will jump immediately.' },
                { dim: 'Answer density', effort: 'Medium effort', impact: 'High', color: '#7b6cff', fix: 'Replace vague claims with specific ones throughout. Audit every paragraph for sentences containing "significant", "many", "some", "various", or "several" — these are density killers. Replace each with the actual number, name, or specific claim.' },
                { dim: 'Content structure', effort: 'Low effort', impact: 'High', color: '#22d3ee', fix: 'Rewrite your H2s as questions or direct answers. "Our approach to content marketing" → "How to structure content for AI citations". A heading that answers a question is extractable on its own. A heading that names a topic is not.' },
                { dim: 'FAQ presence', effort: 'Low effort', impact: 'Very high', color: '#ffc45c', fix: 'Add a FAQ section to every informational page. Five to eight questions, each answered in 2–4 sentences. Wrap it in FAQPage schema. This single change consistently produces the largest single-session score improvement for pages that don\'t already have one.' },
                { dim: 'Sentence clarity', effort: 'Low effort', impact: 'Medium', color: '#f472b6', fix: 'Find your three most jargon-heavy paragraphs and rewrite each with concrete nouns in place of abstract ones. "Leverage our synergistic platform capabilities" → "Use the dashboard to schedule, analyse, and export your data." Same meaning, machine-readable.' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 110px 110px 1fr', gap: '1.25rem', alignItems: 'center', background: 'var(--card)', padding: '1rem 1.5rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: row.color, fontWeight: 600 }}>{row.dim}</span>
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
            <ClusterFAQClient faqs={FAQS_READ} />
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
    .rd-grid-2{grid-template-columns:1fr !important}
    .rd-grid-3{grid-template-columns:1fr !important}
    .rd-fix-row{grid-template-columns:1fr !important}
    .rd-fix-row span:nth-child(2),.rd-fix-row span:nth-child(3){display:none}
  }
`

const EYEBROW: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '.75rem' }
const H1: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-.03em', marginBottom: '1.25rem' }
const H2: React.CSSProperties = { fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem' }
const LEAD: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, maxWidth: '600px' }
const PROSE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }