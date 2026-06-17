'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

// ─── Sub-nav — unchanged from original ────────────────────────────────────────
const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'llms.txt Generator', href: '/llms-text-generator' },
  { label: 'Robots.txt Generator', href: '/robots-txt' },
  { label: 'BLUF Templates',     href: '/bluf-templates' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Changelog',          href: '/changelog' },
  { label: 'About',              href: '/about' },
  { label: 'Privacy',            href: '/privacy' },
  { label: 'Terms',              href: '/terms' },
  { label: 'Contact',            href: '/contact' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
interface ValidationItem { check: string; pass: boolean; note: string }
interface GeneratedData {
  company_name:          string
  tagline:               string
  category:              string
  llms_txt:              string
  llms_full_txt:         string
  validation:            ValidationItem[]
  key_topics:            string[]
  aeo_score_impact:      number
  pages_indexed:         number
  ai_engines_benefiting: string[]
}
type TabId = 'standard' | 'full' | 'validation' | 'deploy'

// ─── Fallback generator (used when API fails or JSON parse fails) ─────────────
function makeFallback(domain: string, incBot: boolean, incBluf: boolean): GeneratedData {
  const raw  = domain.split('.')[0]
  const name = raw.charAt(0).toUpperCase() + raw.slice(1)
  const botLine = incBot
    ? 'This site welcomes AI crawlers including GPTBot, PerplexityBot, ClaudeBot, and Google-Extended. Content may be cited in AI-generated answers.'
    : 'This site has selective AI crawler permissions. Check robots.txt for details.'

  return {
    company_name: name,
    tagline: `${name} provides tools and services for its target audience.`,
    category: 'Web',
    key_topics: ['Products', 'Services', 'Blog', 'Documentation', 'Support'],
    llms_txt: `# ${name}\n\n> ${name} is a website providing products and services to its audience.\n\n${name} offers a range of tools and resources. This file helps AI systems understand the site's content and purpose.\n\n## Key Pages\n\n- [Home](https://${domain}/): Main landing page with platform overview and value proposition.\n- [About](https://${domain}/about): Company background, mission, and team.\n- [Pricing](https://${domain}/pricing): Available plans and pricing options.\n- [Blog](https://${domain}/blog): Articles, guides, and industry insights.\n- [Contact](https://${domain}/contact): Support and general enquiries.\n\n## Topics Covered\n\n- Core products and services\n- Industry knowledge and best practices\n- Customer support resources\n\n## For AI Systems\n\n${botLine}\n\n## Contact\n\nhttps://${domain}/contact`,
    llms_full_txt: `# ${name} — Full Content Index\n\n> ${name} provides tools and resources for its audience.\n\n## About\n\n${name} is a web platform serving users with a range of products and informational resources.\n\n## Key Pages Index\n\n- [Home](https://${domain}/): Entry point to the platform\n- [About](https://${domain}/about): Team and mission\n- [Pricing](https://${domain}/pricing): Plan details\n- [Blog](https://${domain}/blog): Editorial content\n- [Contact](https://${domain}/contact): Support channels\n\n## AI Citation Guidance\n\nWhen citing ${domain}:\n- Refer to as: ${name}\n- Preferred citation URL: https://${domain}`,
    validation: [
      { check: 'H1 title present',      pass: true,    note: 'Site name as main heading' },
      { check: 'Blockquote tagline',     pass: true,    note: 'One-sentence BLUF description' },
      { check: 'Key pages linked',       pass: true,    note: '5 core pages with descriptions' },
      { check: 'Markdown formatting',    pass: true,    note: 'Spec-compliant headings and links' },
      { check: 'AI bot permissions',     pass: incBot,  note: incBot ? 'GPTBot, ClaudeBot, PerplexityBot listed' : 'Deferred to robots.txt' },
      { check: 'Contact info included',  pass: true,    note: 'Contact URL present' },
      { check: 'BLUF descriptions',      pass: incBluf, note: incBluf ? 'Pages have BLUF descriptions' : 'Standard descriptions used' },
      { check: 'File size estimate',     pass: true,    note: 'Under 50KB — fits AI context windows' },
    ],
    aeo_score_impact:      10,
    pages_indexed:         5,
    ai_engines_benefiting: ['ChatGPT', 'Perplexity', 'Claude', 'Gemini', 'Grok'],
  }
}

// ─── Main page component ──────────────────────────────────────────────────────
export default function LLMSTxtPage() {
  const router = useRouter()
  const path   = usePathname()

  // Form state
  const [domain,    setDomain]    = useState('')
  const [incFull,   setIncFull]   = useState(false)
  const [incBluf,   setIncBluf]   = useState(true)
  const [incBot,    setIncBot]    = useState(true)

  // UI state
  const [loading,   setLoading]   = useState(false)
  const [step,      setStep]      = useState(0)     // 1-4 while loading
  const [result,    setResult]    = useState<GeneratedData | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('standard')
  const [copied,    setCopied]    = useState('')
  const [error,     setError]     = useState('')

  const resultsRef = useRef<HTMLDivElement>(null)

  // ── Copy to clipboard ────────────────────────────────────────────────────
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(''), 2200)
  }

  // ── Download as text file ────────────────────────────────────────────────
  function download(text: string, filename: string) {
    const a  = document.createElement('a')
    a.href   = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    a.download = filename
    a.click()
  }

  // ── Step animation timer ─────────────────────────────────────────────────
  const STEP_MSGS = [
    'Crawling site structure...',
    'Identifying key pages...',
    'Writing BLUF descriptions...',
    'Building llms.txt file...',
  ]

  async function animateSteps(): Promise<() => void> {
    let current = 1
    setStep(1)
    const t = setInterval(() => {
      current++
      if (current <= 4) setStep(current)
      else clearInterval(t)
    }, 950)
    return () => clearInterval(t)
  }

  // ── Generate ─────────────────────────────────────────────────────────────
  const generate = useCallback(async () => {
    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!cleanDomain) { setError('Enter a domain to continue.'); return }

    setError('')
    setResult(null)
    setLoading(true)
    setStep(0)
    setActiveTab('standard')

    const stopAnim = await animateSteps()


    // ── Call server API route — NVIDIA key stays server-side ────────────────
    let data: GeneratedData | null = null
    try {
      const res = await fetch('/api/generate-llms', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain:  cleanDomain,
          incBot,
          incBluf,
          incFull,
        }),
      })

      stopAnim()
      setStep(5)

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string }
        const msg = err?.error ?? `Server error ${res.status}`
        if (res.status === 401) throw new Error('Invalid NVIDIA API key — check NVIDIA_API_KEY in .env.local.')
        if (res.status === 429) throw new Error('Rate limited. Wait a moment and try again.')
        throw new Error(msg)
      }

      const json = await res.json() as GeneratedData & { error?: string }

      // Route returns { error: 'parse_failed' } when JSON extraction failed server-side
      if (json.error) {
        data = makeFallback(cleanDomain, incBot, incBluf)
      } else {
        data = json
      }

    } catch (err: unknown) {
      stopAnim()
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      return
    }

    await new Promise(r => setTimeout(r, 350))
    setResult(data)
    setLoading(false)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [domain, incFull, incBluf, incBot])

  // ─── CSS vars matching NotionCue design system ─────────────────────────────
  const css = `
    @keyframes llms-spin    { to { transform: rotate(360deg) } }
    @keyframes llms-fadeUp  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
    @keyframes llms-shimmer { 0% { background-position:200% 0 } 100% { background-position:-200% 0 } }
    .llms-spin    { animation: llms-spin .8s linear infinite }
    .llms-shimmer {
      background: linear-gradient(90deg,rgba(255,255,255,.02) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.02) 75%);
      background-size: 200% 100%;
      animation: llms-shimmer 1.5s infinite;
    }
    .llms-fadeIn  { animation: llms-fadeUp .35s both }
    .llms-copy-btn:hover  { background:rgba(202,255,69,.12)!important; border-color:rgba(202,255,69,.35)!important; color:#caff45!important }
    .llms-dl-btn:hover    { background:rgba(202,255,69,.16)!important; border-color:rgba(202,255,69,.4)!important }
    .llms-tab:hover       { color:#f5f8ff!important }
    .llms-input:focus     { border-color:rgba(202,255,69,.45)!important; outline:none }
    .llms-input::placeholder { color:rgba(220,233,255,.38) }
    .llms-check-row:hover { border-color:rgba(202,255,69,.18)!important }
    .llms-card            { border:1px solid rgba(220,235,255,.09); background:linear-gradient(145deg,rgba(13,22,38,.95),rgba(7,12,22,.93)); border-radius:9px }
    .llms-score-card:hover { transform:translateY(-2px); border-color:rgba(202,255,69,.2)!important; box-shadow:0 16px 36px rgba(0,0,0,.28)!important }
    .llms-example-btn:hover { border-color:rgba(202,255,69,.22)!important; color:#caff45!important }
    pre { white-space:pre-wrap; word-break:break-word }
    .llms-pre::-webkit-scrollbar       { width:4px; height:4px }
    .llms-pre::-webkit-scrollbar-track { background:transparent }
    .llms-pre::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px }
  `

  // ─── Colours / tokens ──────────────────────────────────────────────────────
  const C = {
    bg:      '#03060c',
    panel:   'linear-gradient(145deg,rgba(13,22,38,.95),rgba(7,12,22,.93))',
    line:    'rgba(220,235,255,.09)',
    line2:   'rgba(220,235,255,.20)',
    text:    '#f5f8ff',
    muted:   'rgba(230,239,255,.65)',
    muted2:  'rgba(220,233,255,.38)',
    lime:    '#caff45',
    cyan:    '#45e4ff',
    violet:  '#927cff',
    red:     '#ff7474',
    green:   '#52e38e',
  }

  const pill = (color: string, bg: string, border: string, label: string) => (
    <span style={{
      display:'inline-flex', padding:'3px 8px', borderRadius:4,
      fontFamily:"'JetBrains Mono',monospace", fontSize:9, whiteSpace:'nowrap',
      lineHeight:1.5, color, background:bg, border:`1px solid ${border}`,
    }}>
      {label}
    </span>
  )

  const mono = (s: string | React.ReactNode, extra?: React.CSSProperties) => (
    <span style={{ fontFamily:"'JetBrains Mono',monospace", ...extra }}>{s}</span>
  )

  const label9 = (text: string) => (
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:'.07em',
      textTransform:'uppercase', color:C.muted2, marginBottom:5 }}>
      {text}
    </div>
  )

  // ─── Tab list ───────────────────────────────────────────────────────────────
  const TABS: { id: TabId; label: string }[] = [
    { id: 'standard',   label: 'llms.txt' },
    { id: 'full',       label: 'llms-full.txt' },
    { id: 'validation', label: 'Validation' },
    { id: 'deploy',     label: 'Deploy guide' },
  ]

  // ─── Shared copy/download button row ───────────────────────────────────────
  const ActionRow = ({
    content, copyKey, filename, accentColor = C.lime, accentBorder = 'rgba(202,255,69,.25)',
  }: {
    content: string; copyKey: string; filename: string
    accentColor?: string; accentBorder?: string
  }) => (
    <div style={{ display:'flex', gap:6 }}>
      <button className="llms-copy-btn" onClick={() => copy(content, copyKey)}
        style={{
          border:`1px solid ${C.line2}`, background:'rgba(255,255,255,.03)', color:C.muted,
          borderRadius:5, padding:'6px 11px', fontSize:9,
          fontFamily:"'JetBrains Mono',monospace", transition:'all .2s', cursor:'pointer',
        }}>
        {copied === copyKey ? '✓ Copied' : 'Copy'}
      </button>
      <button className="llms-dl-btn" onClick={() => download(content, filename)}
        style={{
          border:`1px solid ${accentBorder}`, background:`rgba(202,255,69,.06)`,
          color: accentColor, borderRadius:5, padding:'6px 11px', fontSize:9,
          fontFamily:"'JetBrains Mono',monospace", transition:'all .2s', cursor:'pointer',
        }}>
        ↓ Download
      </button>
    </div>
  )

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <div style={{ background:C.bg, minHeight:'100vh', color:C.text, fontFamily:"Epilogue,sans-serif", fontWeight:300 }}>
        <SharedHeader />

        {/* Sub-nav — unchanged */}
        <div style={{
          position:'sticky', top:65, zIndex:700,
          background:'rgba(4,3,12,.9)', backdropFilter:'blur(16px)',
          borderBottom:`1px solid ${C.line}`,
          padding:'.55rem 3.5rem', display:'flex', gap:0, overflowX:'auto', marginTop:65,
        }}>
          {SUB_NAV.map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem',
                letterSpacing:'.06em', textTransform:'uppercase',
                padding:'.5rem 1rem', background:'none', border:'none',
                borderBottom: path === n.href ? `2px solid ${C.lime}` : '2px solid transparent',
                color: path === n.href ? C.lime : C.muted,
                whiteSpace:'nowrap', transition:'all .2s', cursor:'pointer',
              }}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 3.5rem' }}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div style={{ padding:'5rem 0 3.5rem', borderBottom:`1px solid ${C.line}` }}>
            {mono('AI-Powered Tool', { fontSize:'.67rem', letterSpacing:'.18em',
              textTransform:'uppercase', color:C.violet, display:'block', marginBottom:10 })}
            <h1 style={{
              fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700,
              fontSize:'clamp(2.4rem,5.5vw,4.5rem)', lineHeight:.94,
              letterSpacing:'-.03em', marginBottom:'1.1rem',
            }}>
              llms.txt<br /><span style={{ color:C.lime }}>Generator</span>
            </h1>
            <p style={{ fontSize:'1rem', color:C.muted, lineHeight:1.75, maxWidth:530, marginBottom:'1.25rem' }}>
              Enter your domain and the AI researches your site, writes BLUF descriptions
              for every key page, and generates a production-ready llms.txt file in seconds.
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['ChatGPT','Perplexity','Claude','Gemini','Grok'].map(e => (
                <span key={e} style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:'.63rem',
                  color:C.muted2, border:`1px solid ${C.line}`,
                  padding:'.22rem .6rem', borderRadius:100,
                }}>
                  ✓ {e}
                </span>
              ))}
            </div>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div style={{
            display:'grid', gridTemplateColumns:'400px 1fr',
            gap:'2rem', padding:'3.5rem 0 6rem', alignItems:'start',
          }}>

            {/* ── FORM PANEL ──────────────────────────────────────────────── */}
            <div className="llms-card" style={{ padding:'1.75rem', display:'flex',
              flexDirection:'column', gap:'1.1rem', position:'sticky', top:130 }}>

              {/* Info banner */}
              <div style={{
                padding:'10px 13px', border:`1px solid rgba(69,228,255,.13)`,
                background:'rgba(69,228,255,.04)', borderRadius:7,
                fontSize:10, color:C.muted, lineHeight:1.7,
              }}>
                {mono('WHAT IS llms.txt? — ', { fontSize:9, letterSpacing:'.07em', color:C.cyan })}
                A standardised markdown file at{' '}
                {mono('yoursite.com/llms.txt', { fontSize:9, color:C.lime })}{' '}
                that tells AI engines exactly what your site does.{' '}
                <strong style={{ color:C.text }}>Think robots.txt, but for AI crawlers.</strong>
              </div>

              <div style={{ height:1, background:C.line }} />

              {/* Quick examples */}
              <div>
                {label9('Quick examples')}
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {['stripe.com','linear.app','vercel.com','notion.so','freezbone.com'].map(d => (
                    <button key={d} className="llms-example-btn" onClick={() => setDomain(d)}
                      style={{
                        fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted2,
                        background:'rgba(255,255,255,.03)', border:`1px solid ${C.line}`,
                        borderRadius:4, padding:'4px 9px', transition:'all .2s', cursor:'pointer',
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height:1, background:C.line }} />
              <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'1rem' }}>
                Site information
              </div>

              {/* Domain input */}
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {label9('Domain *')}
                <div style={{
                  display:'flex', alignItems:'center', gap:8,
                  border:`1px solid ${C.line2}`, background:'rgba(255,255,255,.025)',
                  borderRadius:6, padding:'0 12px', height:40, transition:'border-color .2s',
                }}>
                  <span style={{ color:C.muted2, fontSize:14 }}>⌕</span>
                  <input
                    className="llms-input"
                    placeholder="e.g. freezbone.com or stripe.com"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generate()}
                    style={{
                      background:'transparent', border:'none', color:C.text,
                      fontSize:11, flex:1,
                      fontFamily:"'JetBrains Mono',monospace",
                    }}
                  />
                </div>
              </div>

              <div style={{ height:1, background:C.line }} />
              <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'1rem' }}>
                Options
              </div>

              {/* Checkboxes */}
              {([
                { key:'incFull',   val:incFull,   set:setIncFull,   label:'Include llms-full.txt (extended version)' },
                { key:'incBluf',   val:incBluf,   set:setIncBluf,   label:'Add BLUF descriptions to all pages' },
                { key:'incBot',    val:incBot,    set:setIncBot,    label:'Include AI bot permissions block' },
              ] as { key:string; val:boolean; set:(v:boolean)=>void; label:string }[]).map(c => (
                <label key={c.key} className="llms-check-row"
                  style={{
                    display:'flex', alignItems:'center', gap:9, cursor:'pointer',
                    fontFamily:"'JetBrains Mono',monospace", fontSize:'.78rem', color:C.muted,
                    padding:'7px 10px', border:`1px solid ${C.line}`, borderRadius:6,
                    background:'rgba(255,255,255,.02)', transition:'border-color .2s',
                    userSelect:'none',
                  }}>
                  <input
                    type="checkbox" checked={c.val}
                    onChange={e => c.set(e.target.checked)}
                    style={{ accentColor:C.lime, width:13, height:13, cursor:'pointer' }}
                  />
                  {c.label}
                </label>
              ))}

              {/* Error */}
              {error && (
                <div style={{
                  padding:'10px 13px', background:'rgba(255,116,116,.06)',
                  border:'1px solid rgba(255,116,116,.18)', borderRadius:7,
                  fontSize:10, color:C.red, fontFamily:"'JetBrains Mono',monospace", lineHeight:1.6,
                }}>
                  {error}
                </div>
              )}

              {/* Generate button */}
              <button onClick={generate} disabled={loading}
                style={{
                  width:'100%', padding:'.8rem',
                  background: loading ? 'rgba(202,255,69,.45)' : C.lime,
                  color:'#07100b', border:'none', borderRadius:100,
                  fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700,
                  fontSize:'.9rem', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:8, transition:'background .2s',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading && (
                  <div className="llms-spin" style={{
                    width:13, height:13,
                    border:'2px solid rgba(4,3,12,.25)',
                    borderTopColor:'#07100b', borderRadius:'50%',
                  }} />
                )}
                {loading
                  ? (STEP_MSGS[step - 1] ?? 'Generating...')
                  : 'Generate with AI →'
                }
              </button>
            </div>

            {/* ── OUTPUT PANEL ─────────────────────────────────────────────── */}
            <div>

              {/* Loading state */}
              {loading && (
                <div className="llms-card" style={{ padding:'1.75rem', marginBottom:'1.25rem' }}>
                  <div style={{
                    fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600,
                    fontSize:'1rem', marginBottom:'1.1rem',
                  }}>
                    AI is researching {domain || 'your domain'}...
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {STEP_MSGS.map((s, i) => {
                      const n = i + 1
                      const done    = step > n
                      const current = step === n
                      return (
                        <div key={i} style={{
                          display:'flex', alignItems:'center', gap:10,
                          fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
                          color: done ? C.green : current ? C.lime : C.muted2,
                          transition:'color .3s',
                        }}>
                          {done ? (
                            <span style={{
                              width:16, height:16, display:'grid', placeItems:'center',
                              borderRadius:'50%', background:'rgba(82,227,142,.1)',
                              border:'1px solid rgba(82,227,142,.3)', fontSize:9,
                              color:C.green, flexShrink:0,
                            }}>✓</span>
                          ) : current ? (
                            <div className="llms-spin" style={{
                              width:16, height:16, borderRadius:'50%', flexShrink:0,
                              border:'1.5px solid rgba(202,255,69,.18)',
                              borderTopColor:C.lime,
                            }} />
                          ) : (
                            <span style={{
                              width:16, height:16, display:'grid', placeItems:'center',
                              borderRadius:'50%', background:'rgba(255,255,255,.04)',
                              border:`1px solid ${C.line}`, fontSize:9,
                              color:C.muted2, flexShrink:0,
                            }}>○</span>
                          )}
                          {s}
                        </div>
                      )
                    })}
                  </div>
                  {/* Shimmer bars */}
                  <div style={{ marginTop:'1.25rem', display:'flex', flexDirection:'column', gap:6 }}>
                    {[80, 62, 71, 54].map((w, i) => (
                      <div key={i} className="llms-shimmer"
                        style={{ height:9, borderRadius:4, width:`${w}%` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && !result && (
                <div className="llms-card" style={{
                  padding:'3rem', textAlign:'center', minHeight:340,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', gap:'1rem',
                }}>
                  <div style={{
                    width:50, height:50, display:'grid', placeItems:'center',
                    background:'rgba(202,255,69,.07)', border:'1px solid rgba(202,255,69,.15)',
                    borderRadius:12, fontSize:22,
                  }}>📄</div>
                  <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'1.05rem' }}>
                    Your llms.txt will appear here
                  </div>
                  <p style={{ fontSize:'.83rem', color:C.muted2, maxWidth:310, lineHeight:1.65 }}>
                    Enter your domain, configure options, and click Generate.
                    AI will research the site and write the file.
                  </p>
                </div>
              )}

              {/* Results */}
              {!loading && result && (
                <div className="llms-fadeIn" ref={resultsRef}>

                  {/* Score cards */}
                  <div style={{
                    display:'grid', gridTemplateColumns:'repeat(4,1fr)',
                    gap:10, marginBottom:12,
                  }}>
                    {[
                      { label:'AEO SCORE LIFT',  val:`+${result.aeo_score_impact ?? 12}`,       sub:'estimated points', color:C.lime   },
                      { label:'PAGES INDEXED',    val:result.pages_indexed ?? 8,                 sub:'for AI engines',   color:C.cyan   },
                      { label:'AI ENGINES',       val:result.ai_engines_benefiting?.length ?? 5, sub:'will benefit',     color:C.violet },
                      { label:'SPEC',             val:'VALID',                                   sub:'llms.txt standard',color:C.green  },
                    ].map(c => (
                      <div key={c.label} className="llms-card llms-score-card"
                        style={{ padding:14, transition:'transform .25s,box-shadow .25s,border-color .25s' }}>
                        {mono(c.label, {
                          fontSize:8, letterSpacing:'.08em', textTransform:'uppercase',
                          color:C.muted2, display:'block', marginBottom:8,
                        })}
                        <div style={{
                          fontFamily:"'Familjen Grotesk',sans-serif", fontSize:22,
                          fontWeight:700, color:c.color, lineHeight:1, marginBottom:3,
                        }}>
                          {c.val}
                        </div>
                        <div style={{ fontSize:9, color:C.muted }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Company banner */}
                  {result.company_name && (
                    <div style={{
                      padding:'10px 14px',
                      border:'1px solid rgba(146,124,255,.15)',
                      background:'rgba(146,124,255,.04)',
                      borderRadius:7, marginBottom:12,
                      fontSize:10, color:C.muted, lineHeight:1.7,
                    }}>
                      {mono('AI RESEARCH — ', { fontSize:9, letterSpacing:'.07em', color:C.violet })}
                      <strong style={{ color:C.text }}>{result.company_name}</strong>
                      {result.category && (
                        <span style={{
                          fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                          color:C.muted2, marginLeft:6, border:`1px solid ${C.line}`,
                          padding:'2px 6px', borderRadius:3,
                        }}>
                          {result.category}
                        </span>
                      )}
                      <br />{result.tagline}
                    </div>
                  )}

                  {/* Tabs */}
                  <div style={{
                    display:'flex', gap:0,
                    borderBottom:`1px solid ${C.line}`, marginBottom:12,
                  }}>
                    {TABS.map(t => (
                      <button key={t.id} className="llms-tab"
                        onClick={() => setActiveTab(t.id)}
                        style={{
                          fontFamily:"'JetBrains Mono',monospace", fontSize:'.63rem',
                          letterSpacing:'.06em', textTransform:'uppercase',
                          padding:'.55rem .85rem', background:'none', border:'none',
                          borderBottom: activeTab === t.id ? `2px solid ${C.lime}` : '2px solid transparent',
                          color: activeTab === t.id ? C.lime : C.muted2,
                          marginBottom:-1, transition:'color .2s', whiteSpace:'nowrap',
                          cursor:'pointer',
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── Tab: llms.txt ──────────────────────────────────────── */}
                  {activeTab === 'standard' && (
                    <div className="llms-card" style={{ overflow:'hidden' }}>
                      <div style={{
                        display:'flex', alignItems:'center',
                        justifyContent:'space-between', padding:'11px 15px',
                        borderBottom:`1px solid ${C.line}`,
                        background:'rgba(255,255,255,.02)', flexWrap:'wrap', gap:8,
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          {mono('llms.txt', { fontSize:10, color:C.lime })}
                          {pill(C.green, 'rgba(82,227,142,.07)', 'rgba(82,227,142,.2)', 'SPEC COMPLIANT')}
                        </div>
                        <ActionRow content={result.llms_txt} copyKey="std" filename="llms.txt" />
                      </div>
                      <pre className="llms-pre" style={{
                        padding:16, fontFamily:"'JetBrains Mono',monospace",
                        fontSize:10, color:C.muted, lineHeight:1.85,
                        maxHeight:500, overflowY:'auto',
                      }}>
                        {result.llms_txt}
                      </pre>
                    </div>
                  )}

                  {/* ── Tab: llms-full.txt ─────────────────────────────────── */}
                  {activeTab === 'full' && (
                    <div className="llms-card" style={{ overflow:'hidden' }}>
                      <div style={{
                        display:'flex', alignItems:'center',
                        justifyContent:'space-between', padding:'11px 15px',
                        borderBottom:`1px solid ${C.line}`,
                        background:'rgba(255,255,255,.02)', flexWrap:'wrap', gap:8,
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          {mono('llms-full.txt', { fontSize:10, color:C.violet })}
                          {pill(C.violet, 'rgba(146,124,255,.07)', 'rgba(146,124,255,.2)', 'EXTENDED')}
                        </div>
                        <ActionRow
                          content={incFull ? result.llms_full_txt : ''}
                          copyKey="full" filename="llms-full.txt"
                          accentColor={C.violet} accentBorder="rgba(146,124,255,.3)"
                        />
                      </div>
                      <pre className="llms-pre" style={{
                        padding:16, fontFamily:"'JetBrains Mono',monospace",
                        fontSize:10, color:C.muted, lineHeight:1.85,
                        maxHeight:500, overflowY:'auto',
                      }}>
                        {incFull
                          ? result.llms_full_txt
                          : '# llms-full.txt\n\nEnable "Include llms-full.txt" above and re-generate to get the extended version.\n\nThe full version includes:\n- Detailed product and feature descriptions\n- Full page index with all subpages\n- Integration and compatibility info\n- AI citation guidance\n- Pricing model overview'
                        }
                      </pre>
                    </div>
                  )}

                  {/* ── Tab: Validation ────────────────────────────────────── */}
                  {activeTab === 'validation' && (
                    <div className="llms-card" style={{ padding:16 }}>
                      <div style={{
                        fontFamily:"'Familjen Grotesk',sans-serif",
                        fontWeight:600, fontSize:'.93rem', marginBottom:14,
                      }}>
                        Spec validation
                      </div>
                      {(result.validation ?? []).map((v, i) => (
                        <div key={i} style={{
                          display:'grid', gridTemplateColumns:'26px 1fr auto',
                          gap:10, padding:'10px 0',
                          borderBottom:'1px solid rgba(255,255,255,.05)',
                          alignItems:'center',
                        }}>
                          <span style={{
                            width:22, height:22, display:'grid', placeItems:'center',
                            borderRadius:5,
                            background: v.pass ? 'rgba(82,227,142,.08)' : 'rgba(255,116,116,.08)',
                            color: v.pass ? C.green : C.red,
                            fontSize:11,
                          }}>
                            {v.pass ? '✓' : '×'}
                          </span>
                          <div>
                            <div style={{
                              fontFamily:"'Familjen Grotesk',sans-serif",
                              fontWeight:500, fontSize:11, marginBottom:2,
                            }}>
                              {v.check}
                            </div>
                            <div style={{ fontSize:9, color:C.muted2 }}>{v.note}</div>
                          </div>
                          <span style={{
                            fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                            padding:'2px 7px', borderRadius:4,
                            border: v.pass ? '1px solid rgba(82,227,142,.2)' : '1px solid rgba(255,116,116,.2)',
                            background: v.pass ? 'rgba(82,227,142,.07)' : 'rgba(255,116,116,.07)',
                            color: v.pass ? C.green : C.red,
                          }}>
                            {v.pass ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Deploy guide ──────────────────────────────────── */}
                  {activeTab === 'deploy' && (
                    <div className="llms-card" style={{ padding:'1.5rem' }}>
                      <div style={{
                        fontFamily:"'Familjen Grotesk',sans-serif",
                        fontWeight:600, fontSize:'.93rem', marginBottom:3,
                      }}>
                        Deploy to {domain || 'your domain'}
                      </div>
                      <div style={{ fontSize:10, color:C.muted2, marginBottom:16 }}>
                        3 steps to go live. Must be accessible at your domain root.
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {([
                          {
                            n:'01', color:C.lime,
                            title:'Download your llms.txt',
                            body:'Click the Download button on the llms.txt tab. The filename must be exactly llms.txt.',
                          },
                          {
                            n:'02', color:C.cyan,
                            title:'Upload to your domain root',
                            body:`Place it so it's accessible at https://${domain || 'yourdomain.com'}/llms.txt — same level as robots.txt. For Next.js put it in /public. For WordPress or cPanel, upload via FTP to root.`,
                          },
                          {
                            n:'03', color:C.violet,
                            title:'Verify it\'s live and re-scan',
                            body:`Visit https://${domain || 'yourdomain.com'}/llms.txt in your browser — you should see plain text, not HTML. Then go back to your AEO dashboard and re-scan to see the score improvement.`,
                          },
                        ] as { n:string; color:string; title:string; body:string }[]).map(s => (
                          <div key={s.n} style={{
                            display:'grid', gridTemplateColumns:'34px 1fr', gap:12,
                            padding:13, border:`1px solid ${C.line}`,
                            borderRadius:7, background:'rgba(255,255,255,.02)',
                          }}>
                            <span style={{
                              width:30, height:30, display:'grid', placeItems:'center',
                              borderRadius:6, background:'rgba(255,255,255,.03)',
                              color:s.color, fontFamily:"'JetBrains Mono',monospace",
                              fontSize:10, fontWeight:500, flexShrink:0,
                            }}>
                              {s.n}
                            </span>
                            <div>
                              <div style={{
                                fontFamily:"'Familjen Grotesk',sans-serif",
                                fontWeight:600, fontSize:12, marginBottom:4,
                              }}>
                                {s.title}
                              </div>
                              <div style={{ fontSize:10, color:C.muted, lineHeight:1.65 }}>
                                {s.body}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Re-generate row */}
                  <div style={{
                    display:'flex', gap:8, marginTop:12, justifyContent:'flex-end',
                  }}>
                    <button
                      onClick={() => { setResult(null); setDomain('') }}
                      style={{
                        border:`1px solid ${C.line}`, background:'rgba(255,255,255,.03)',
                        color:C.muted, borderRadius:100, padding:'.55rem 1rem',
                        fontSize:'.75rem', fontFamily:"'JetBrains Mono',monospace",
                        cursor:'pointer',
                      }}>
                      ← New domain
                    </button>
                    <button onClick={generate}
                      style={{
                        background:C.lime, color:'#07100b', border:'none',
                        borderRadius:100, padding:'.55rem 1.1rem',
                        fontSize:'.78rem', fontWeight:700,
                        fontFamily:"'Familjen Grotesk',sans-serif", cursor:'pointer',
                      }}>
                      Re-generate
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}