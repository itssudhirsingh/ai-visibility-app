import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import LlmsValidatorClient from '@/components/LLMSValidatorClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'llms.txt Live Validator — Check Any Domain\'s AI Bot Configuration — Notion Cue',
  description: 'Live-fetch and validate any domain\'s llms.txt file. Checks format, bot declarations, and robots.txt conflicts for GPTBot, PerplexityBot, ClaudeBot, and 5 more. Free tool.',
}

const FAQS_LV = [
  { q: 'What is llms.txt and why does it matter for AEO?', a: 'llms.txt is a plain text file at yourdomain.com/llms.txt that tells AI crawlers how to access and use your content. It works alongside robots.txt — where robots.txt controls what bots can crawl, llms.txt declares your content\'s availability for AI training and retrieval. Sites with a correctly formatted llms.txt signal technical maturity to AI engines and explicitly allow the bots most responsible for citation in answers.' },
  { q: 'What\'s the difference between this validator and your llms.txt generator?', a: 'The generator creates a new llms.txt file from scratch. This validator reads and audits an existing one — checking the live file at any domain, not just yours. Use it to check your own file after deploying it, to monitor competitors\' AEO posture, or to diagnose why a specific bot might still be blocked despite an apparently correct configuration.' },
  { q: 'Which AI bots does the validator check?', a: 'GPTBot (ChatGPT), PerplexityBot, ClaudeBot, Google-Extended (Gemini), Amazonbot, Bytespider, FacebookBot, and CCBot. These cover the crawlers responsible for the majority of AI engine citation behaviour. The validator checks both the llms.txt declarations and the robots.txt rules for each, flagging any conflicts between the two files.' },
  { q: 'What does a conflict between llms.txt and robots.txt mean?', a: 'A conflict means your llms.txt allows a bot while your robots.txt blocks it, or vice versa. Robots.txt takes precedence for crawl access — so a bot allowed in llms.txt but blocked in robots.txt still can\'t reach your pages. These conflicts are one of the most common reasons sites have correct-looking configurations but zero AI citations.' },
  { q: 'Can I use this to audit competitor sites?', a: 'Yes — enter any domain. This is useful for understanding competitors\' AEO posture: which bots they\'re explicitly allowing or blocking, whether they have a correctly formatted llms.txt, and where they have conflicts that leave them vulnerable to being displaced in AI citations.' },
]

export default function LlmsValidatorPage() {
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS_LV.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{SHARED_STYLES}</style>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader /><SubNavClient />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3.5rem' }}>

          <div style={{ padding: '6rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
            <div style={EYEBROW_STYLE}>Tools</div>
            <h1 style={H1_STYLE}>llms.txt<br /><span style={{ color: 'var(--accent)' }}>Live Validator</span></h1>
            <p style={LEAD_STYLE}>Enter any domain and live-fetch their actual llms.txt. Validates format, checks every major AI bot declaration, and flags conflicts with robots.txt — for your own site or any competitor.</p>
          </div>

          <div style={{ padding: '3rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
            <LlmsValidatorClient />
          </div>

          {/* HOW TO USE */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>How to use this tool</div>
            <h2 style={H2_STYLE}>Three things you can do<br /><span style={{ color: 'var(--muted)' }}>with this validator.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '2rem' }}>
              {[
                { icon: '🔍', title: 'Audit your own site', desc: 'After deploying a new or updated llms.txt, run the validator to confirm the file is live at the right URL, correctly formatted, and that there are no conflicts with your robots.txt that would nullify its bot declarations.' },
                { icon: '🔎', title: 'Check competitors', desc: 'Enter any competitor domain to see their AI bot configuration. A competitor with a broken llms.txt or blocking robots.txt rule is effectively invisible to the AI engines citing content in your category — that\'s a citation gap you can fill.' },
                { icon: '⚠️', title: 'Diagnose missing citations', desc: 'If your domain has good AEO scores but low actual citation rates, a conflict between llms.txt and robots.txt is one of the most common silent causes. The validator surfaces these mismatches line by line with a specific fix for each.' },
              ].map(s => (
                <div key={s.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '.85rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '1rem', marginBottom: '.6rem' }}>{s.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WHAT IS LLMS TXT */}
          <section style={SECTION_STYLE}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <div style={EYEBROW_STYLE}>What is llms.txt</div>
                <h2 style={H2_STYLE}>The standard that tells AI<br /><span style={{ color: 'var(--muted)' }}>what it's allowed to read.</span></h2>
                <p style={PROSE_STYLE}>llms.txt is an emerging specification, analogous to robots.txt, that gives website owners a structured way to declare their content's availability for AI training, retrieval, and citation. Where robots.txt controls crawl access at the page level, llms.txt operates at the intent level — telling AI systems what the site is, what it covers, and how its content should be used.</p>
                <p style={PROSE_STYLE}>The file lives at the root of your domain, is plain text, and follows a simple key-value format. A well-formed llms.txt includes the site name, a description of what the site covers, contact information, and per-bot Allow or Disallow declarations. Engines that support llms.txt — including GPTBot and PerplexityBot — check for the file before indexing content.</p>
                <p style={PROSE_STYLE}>The specification is still maturing. Different AI engines read it with different levels of strictness, and not all treat it as binding the way browsers treat robots.txt. But sites with a correctly formatted llms.txt consistently show higher citation rates than comparable sites without one — the signal it sends about technical AEO maturity compounds over time.</p>
              </div>
              <div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ padding: '.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted2)' }}>yourdomain.com/llms.txt — correct format</div>
                  <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', lineHeight: 1.8, color: 'rgba(255,255,255,.7)', padding: '1.25rem', margin: 0, overflowX: 'auto' }}>
{`# llms.txt

Name: Your Brand
Description: What your site covers
Contact: email@yourdomain.com

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* THE 8 BOTS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>The 8 AI bots we check</div>
            <h2 style={H2_STYLE}>Each bot has a different role<br /><span style={{ color: 'var(--muted)' }}>in the citation pipeline.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginTop: '2rem' }}>
              {[
                { bot: 'GPTBot', engine: 'ChatGPT', color: '#10a37f', priority: 'Critical', desc: 'OpenAI\'s crawler. Blocking GPTBot means ChatGPT cannot include your content in browse-mode responses. High priority.' },
                { bot: 'PerplexityBot', engine: 'Perplexity', color: '#ff6b35', priority: 'Critical', desc: 'Perplexity fetches live content for every answer. GPTBot equivalent in citation importance, especially for retrieval-based answers.' },
                { bot: 'ClaudeBot', engine: 'Claude', color: '#d97706', priority: 'High', desc: 'Anthropic\'s crawler. Claude is increasingly used for research queries where domain citation matters for authority.' },
                { bot: 'Google-Extended', engine: 'Gemini', color: '#4285f4', priority: 'High', desc: 'Google\'s AI training crawler. Distinct from Googlebot — blocking Google-Extended while allowing Googlebot is a common misconfiguration.' },
                { bot: 'Amazonbot', engine: 'Alexa / Kendra', color: '#ff9900', priority: 'Medium', desc: 'Amazon\'s crawler, used for Alexa voice search and Amazon Kendra enterprise search.' },
                { bot: 'Bytespider', engine: 'TikTok / Doubao', color: '#69c9d0', priority: 'Medium', desc: 'ByteDance\'s crawler. Powers TikTok\'s search features and Doubao AI assistant.' },
                { bot: 'FacebookBot', engine: 'Meta AI', color: '#1877f2', priority: 'Medium', desc: 'Meta\'s crawler for training its AI systems, including Meta AI across Facebook and Instagram.' },
                { bot: 'CCBot', engine: 'Common Crawl', color: '#7b6cff', priority: 'Low', desc: 'Powers multiple open-weight models. Not directly tied to one consumer engine but feeds training datasets broadly.' },
              ].map(b => (
                <div key={b.bot} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.65rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `${b.color}18`, border: `1px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: b.color }}>{b.bot.slice(0, 2)}</div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: '#fff', fontWeight: 600 }}>{b.bot}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'var(--muted2)' }}>{b.engine}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WHO IT HELPS */}
          <section style={SECTION_STYLE}>
            <div style={EYEBROW_STYLE}>Who this tool helps</div>
            <h2 style={H2_STYLE}>Technical SEOs and AEO practitioners<br /><span style={{ color: 'var(--muted)' }}>who need real data, not estimates.</span></h2>
            <p style={{ ...PROSE_STYLE, maxWidth: '700px', marginTop: '1rem', marginBottom: '2rem' }}>This tool is for anyone who needs to verify AI bot configuration rather than assume it's correct. The most common users are technical SEOs auditing a client site, content strategists who want to know why their content isn't being cited despite good AEO scores, and competitive intelligence practitioners monitoring how rivals configure their AI access settings.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { title: 'Before a site launch', desc: 'Confirm llms.txt is live and correctly formatted before launch day. A 404 on /llms.txt is easy to miss in pre-launch QA and leaves the site invisible to AI crawlers from day one.' },
                { title: 'After a CMS migration', desc: 'Platform migrations often break root-level files. llms.txt and robots.txt are both easy to lose in a migration — validate both immediately after any significant site infrastructure change.' },
                { title: 'When citations suddenly drop', desc: 'If your AI citation rate drops with no obvious content changes, a broken llms.txt or a new robots.txt rule blocking AI bots is one of the first places to check.' },
                { title: 'Competitive intelligence', desc: 'Knowing a competitor has blocked GPTBot while you have it allowed is actionable data. Their ChatGPT citations will decline; yours can fill the gap if your content is strong enough.' },
              ].map(s => (
                <div key={s.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.9rem', marginBottom: '.4rem', color: 'var(--accent)' }}>{s.title}</div>
                  <div style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...SECTION_STYLE, textAlign: 'center', paddingBottom: '6rem' }}>
            <div style={EYEBROW_STYLE}>FAQ</div>
            <h2 style={{ ...H2_STYLE, marginBottom: '3rem' }}>Common <span style={{ color: 'var(--muted)' }}>questions.</span></h2>
            <ClusterFAQClient faqs={FAQS_LV} />
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
  :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ffffff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;}
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
const LEAD_STYLE: React.CSSProperties = { fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: '620px' }
const PROSE_STYLE: React.CSSProperties = { fontSize: '.93rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, marginBottom: '1rem' }
const SECTION_STYLE: React.CSSProperties = { padding: '5rem 0', borderBottom: '1px solid var(--border)' }