'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'llms.txt Generator', href: '/llms-text-generator' },
  { label: 'BLUF Templates',     href: '/bluf-templates' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Changelog',          href: '/changelog' },
  { label: 'About',              href: '/about' },
  { label: 'Privacy',            href: '/privacy' },
  { label: 'Terms',              href: '/terms' },
  { label: 'Contact',            href: '/contact' },
]

const TIMELINE = [
  {
    date: 'Feb 2026', v: 'v1.0 — Public launch', color: '#caff45',
    desc: 'Launched with ChatGPT, Gemini, and Claude citation tracking. AEO score (0–100) across 3 LLMs. Free tier: 1 domain per day. Reached 400 users in the first two weeks without paid acquisition.',
    tools: ['AI Visibility Scanner', 'AEO Score Dashboard'],
  },
  {
    date: 'Mar 2026', v: 'v1.1 — Perplexity + Copilot', color: '#45e4ff',
    desc: 'Expanded to 5 LLMs after user requests for Perplexity and Bing Copilot coverage. Added sentiment analysis and the first technical audit module: llms.txt validation and robots.txt AI-bot checking.',
    tools: ['llms.txt Validator', 'Robots.txt Generator', 'Sentiment Analysis'],
  },
  {
    date: 'Apr 2026', v: 'v1.2 — Competitor benchmarking', color: '#927cff',
    desc: "Added competitor tracking: up to 10 domains, side-by-side AEO scores, and citation gap analysis showing queries where competitors appear but you don't. Claude integration for natural-language report summaries.",
    tools: ['Competitor Benchmarking', 'Citation Gap Analysis', 'AI Answer Gap Finder'],
  },
  {
    date: 'May 2026', v: 'v1.3 — E-E-A-T Radar + Schema', color: '#ffc45c',
    desc: 'Released the E-E-A-T Audit with per-pillar radar chart scoring. Schema markup validator checking 12 schema types. Topic Cluster Map for content architecture. Agency plan with white-label PDF exports.',
    tools: ['E-E-A-T Checker', 'Schema Markup Generator', 'Topic Cluster Map'],
  },
  {
    date: 'Jun 2026', v: 'v1.4 — Grok + AI Acquisition', color: '#52e38e',
    desc: 'Added Grok (xAI) as the 6th tracked LLM. Released the AI Acquisition Report showing session-level data from AI-referred traffic. BLUF Optimizer now generates 3 rewrite variations. Scan speed improved 40% through parallel LLM probing.',
    tools: ['BLUF Builder', 'AI Page Speed Analyser', 'AI Visibility Heatmap', 'AI Readability Checker'],
  },
]

const TEAM = [
  {
    initials: 'SS', name: 'Sudhir Singh', role: 'Founder & Technical Lead',
    gradient: 'linear-gradient(135deg, #927cff, #caff45)',
    bio: '12 years in SEO across e-commerce, global education, and healthcare. Built Notion Cue after spending a year watching clients rank on Google but disappear completely from ChatGPT and Perplexity answers. Leads product, engineering, and technical SEO research.',
    links: [{ label: 'LinkedIn', href: 'https://linkedin.com/in/sudhir-ks' }, { label: 'Blog', href: '/blog' }],
  },
  {
    initials: 'AM', name: 'Arun Mehta', role: 'Head of Research',
    gradient: 'linear-gradient(135deg, #45e4ff, #927cff)',
    bio: "Former data scientist at a Fortune 500 media group. Leads Notion Cue's LLM citation research, including the structured data correlation study across 50,000 URLs that underpins the AEO scoring model.",
    links: [{ label: 'Research', href: '/blog' }],
  },
  {
    initials: 'PK', name: 'Priya Kapoor', role: 'Senior Strategist',
    gradient: 'linear-gradient(135deg, #ffc45c, #52e38e)',
    bio: "AEO strategist with a background in international SEO across 35 global domains. Runs client strategy, writes the AEO playbooks published in the blog, and led the case study showing 340% AI-referred session growth for The Dress Outlet.",
    links: [{ label: 'Case Studies', href: '/blog' }],
  },
]

const TOOLS = [
  { name: 'AI Visibility Scanner',    tag: 'Core',          color: '#caff45' },
  { name: 'AI Answer Gap Finder',     tag: 'Strategy',      color: '#927cff' },
  { name: 'E-E-A-T Checker',          tag: 'Authority',     color: '#45e4ff' },
  { name: 'BLUF Builder',             tag: 'Content',       color: '#ffc45c' },
  { name: 'Topic Cluster Map',        tag: 'Strategy',      color: '#52e38e' },
  { name: 'Schema Markup Generator',  tag: 'Technical',     color: '#927cff' },
  { name: 'AI Page Speed Analyser',   tag: 'Technical',     color: '#45e4ff' },
  { name: 'AI Readability Checker',   tag: 'Content',       color: '#caff45' },
  { name: 'llms.txt Generator',       tag: 'Technical',     color: '#52e38e' },
  { name: 'llms.txt Validator',       tag: 'Technical',     color: '#ffc45c' },
  { name: 'Robots.txt Generator',     tag: 'Technical',     color: 'rgba(255,255,255,.4)' },
  { name: 'AI Visibility Heatmap',    tag: 'Intelligence',  color: '#45e4ff' },
  { name: 'BLUF Templates',           tag: 'Content',       color: '#927cff' },
  { name: 'Competitor Benchmarking',  tag: 'Intelligence',  color: '#52e38e' },
]

const EEAT = [
  { label: 'Experience',      items: 'Case studies, original data, first-hand accounts' },
  { label: 'Expertise',       items: 'Author credentials, topic depth, citation sources' },
  { label: 'Authoritativeness', items: 'Backlink profile, brand mentions, domain age' },
  { label: 'Trust',           items: 'HTTPS, schema coverage, contact info, privacy policy' },
]

const PRESS = [
  { outlet: 'Search Engine Journal', quote: 'The most complete AEO tracking platform available today.' },
  { outlet: 'Moz Blog',              quote: 'Notion Cue does for AI search what Google Search Console did for organic.' },
  { outlet: 'Ahrefs Blog',           quote: 'Recommended for any SEO team that wants to understand their AI citation footprint.' },
]

export default function AboutPage() {
  const router = useRouter()
  const path   = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--card:#100e22;--card2:#0d0b1e;
          --border:rgba(255,255,255,.07);--border-h:rgba(255,255,255,.14);
          --text:#ede9ff;--muted:rgba(255,255,255,.78);--muted2:rgba(255,255,255,.45);
          --accent:#caff45;--violet:#927cff;--cyan:#45e4ff;--amber:#ffc45c;--green:#52e38e;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button,a{cursor:pointer;font-family:inherit}
        button:focus,a:focus{outline:none}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        .sl{font-family:'JetBrains Mono',monospace;font-size:.63rem;letter-spacing:.16em;text-transform:uppercase;color:var(--violet);display:block;margin-bottom:.75rem}
        .sec{padding:3.5rem 0;border-bottom:1px solid var(--border)}
        .card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem}
        .vrow{padding:1.1rem 0;border-bottom:1px solid var(--border)}
        .vrow:last-child{border-bottom:none}
        .pill{display:inline-flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:4px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);white-space:nowrap}
        .tc{display:grid;grid-template-columns:1fr 1fr;gap:3rem}
        .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .pg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .tc-inner,.sg-inner,.tg-inner,.pg-inner{display:contents}
        @media(max-width:900px){.sg{grid-template-columns:1fr 1fr !important}.tg{grid-template-columns:1fr 1fr !important}.pg{grid-template-columns:1fr 1fr !important}}
        @media(max-width:680px){.tc{grid-template-columns:1fr !important}.sg{grid-template-columns:1fr 1fr !important}.tg{grid-template-columns:1fr !important}.pg{grid-template-columns:1fr !important}.hero-h1{font-size:2.2rem !important}.outer{padding:0 1.25rem !important}}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--border)',padding:'0 2rem',display:'flex',gap:0,overflowX:'auto',scrollbarWidth:'none' as const}}>
          {SUB_NAV.map(n=>(
            <button key={n.href} onClick={()=>router.push(n.href)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.6rem 1rem',background:'none',border:'none',borderBottom:path===n.href?'2px solid var(--accent)':'2px solid transparent',color:path===n.href?'var(--accent)':'rgba(255,255,255,.42)',whiteSpace:'nowrap',transition:'all .2s'}}>
              {n.label}
            </button>
          ))}
        </div>

        <div className="outer" style={{maxWidth:'1040px',margin:'0 auto',padding:'0 2.5rem'}}>

          {/* HERO */}
          <div style={{padding:'5.5rem 0 3.5rem',borderBottom:'1px solid var(--border)'}}>
            <span className="sl">Founded Feb 2026 · Bootstrapped · London</span>
            <h1 className="hero-h1" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.2rem,5vw,4rem)',lineHeight:1.0,letterSpacing:'-.03em',marginBottom:'1.25rem',maxWidth:'700px'}}>
              We built the tool<br/><span style={{color:'var(--accent)'}}>we couldn't find.</span>
            </h1>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.82,maxWidth:'560px',marginBottom:'1.25rem'}}>
              Notion Cue started in late 2025 as an internal project: an SEO team trying to understand why their clients ranked on Google but disappeared completely from ChatGPT, Perplexity, and Gemini answers. No existing tool tracked this. So we built one.
            </p>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.82,maxWidth:'560px'}}>
              We went public in February 2026 with three LLMs, one scan tool, and a free tier. Five months later: 14 tools, 6 LLMs, 3,400 SEO practitioners using it weekly, and zero venture funding.
            </p>
          </div>

          {/* STATS */}
          <div className="sg sec">
            {[
              {val:'3,400+', label:'SEO professionals using Notion Cue'},
              {val:'2.1M',   label:'Scans run since Feb 2026'},
              {val:'6',      label:'LLMs tracked in every scan'},
              {val:'14',     label:'Tools — all free to use'},
            ].map((s,i)=>(
              <div key={i} className="card" style={{textAlign:'center'}}>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'2.1rem',lineHeight:1,color:'var(--accent)',letterSpacing:'-.02em',marginBottom:'.45rem'}}>{s.val}</div>
                <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.5}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* WHAT WE DO */}
          <div className="sec">
            <span className="sl">What we do</span>
            <div className="tc">
              <div>
                <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.7rem',lineHeight:1.15,letterSpacing:'-.02em',marginBottom:'1rem'}}>Answer Engine Optimisation — measured, not guessed</h2>
                <p style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.82,marginBottom:'1rem'}}>SEO tells you where you rank on Google. Notion Cue tells you whether ChatGPT, Perplexity, Gemini, Grok, Copilot, and Claude cite you when buyers ask questions in your category.</p>
                <p style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.82,marginBottom:'1rem'}}>We fire thousands of niche prompts across all six engines, extract citation patterns, and translate them into an AEO score with a prioritised fix list. Every recommendation maps to a specific signal that moves the score.</p>
                <p style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.82}}>The scoring methodology is documented publicly. We don't score on vibes.</p>
              </div>
              <div className="card">
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>14 tools — all free</div>
                {TOOLS.map((t,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem 0',borderBottom:i<TOOLS.length-1?'1px solid var(--border)':'none'}}>
                    <span style={{fontSize:'.82rem',color:'rgba(255,255,255,.8)'}}>{t.name}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.05em',textTransform:'uppercase',color:t.color,opacity:.85}}>{t.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="sec">
            <span className="sl">Product timeline</span>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',letterSpacing:'-.02em',marginBottom:'2.25rem'}}>Feb 2026 to today</h2>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:'5px',top:'8px',bottom:'8px',width:'1px',background:'rgba(255,255,255,.06)'}} />
              <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
                {TIMELINE.map((e,i)=>(
                  <div key={i} style={{display:'flex',gap:'1.75rem',alignItems:'flex-start'}}>
                    <div style={{width:12,height:12,borderRadius:'50%',flexShrink:0,marginTop:6,background:e.color,boxShadow:`0 0 0 3px rgba(255,255,255,.06)`}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'.45rem',flexWrap:'wrap' as const}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',color:e.color}}>{e.date}</span>
                        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',color:'var(--text)'}}>{e.v}</span>
                      </div>
                      <p style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.78,marginBottom:'.7rem'}}>{e.desc}</p>
                      <div style={{display:'flex',flexWrap:'wrap' as const,gap:'6px'}}>
                        {e.tools.map((t,j)=><span key={j} className="pill">{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TEAM */}
          <div className="sec">
            <span className="sl">Team</span>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',letterSpacing:'-.02em',marginBottom:'.65rem'}}>Built by practitioners</h2>
            <p style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.78,maxWidth:'520px',marginBottom:'2rem'}}>Everyone on the Notion Cue team has spent years doing SEO for real clients. We didn't design this from the outside looking in.</p>
            <div className="tg">
              {TEAM.map((m,i)=>(
                <div key={i} className="card" style={{transition:'border-color .2s',borderRadius:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'1rem'}}>
                    <div style={{width:46,height:46,borderRadius:'50%',flexShrink:0,background:m.gradient,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',fontWeight:500,color:'#fff'}}>{m.initials}</div>
                    <div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',color:'var(--text)'}}>{m.name}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.06em',textTransform:'uppercase',color:'var(--muted2)',marginTop:'3px'}}>{m.role}</div>
                    </div>
                  </div>
                  <p style={{fontSize:'.84rem',color:'var(--muted)',lineHeight:1.78,marginBottom:'1rem'}}>{m.bio}</p>
                  <div style={{display:'flex',gap:'8px'}}>
                    {m.links.map((l,j)=>(
                      <Link key={j} href={l.href} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.06em',textTransform:'uppercase',color:'var(--violet)',border:'1px solid rgba(146,124,255,.22)',borderRadius:100,padding:'4px 11px',textDecoration:'none'}}>{l.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* METHODOLOGY + EEAT */}
          <div className="sec">
            <span className="sl">Methodology</span>
            <div className="tc">
              <div>
                <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',letterSpacing:'-.02em',marginBottom:'1rem'}}>How the AEO score works</h2>
                {[
                  {title:'Citation detection',desc:'We fire 1,000+ intent-matched prompts per domain across all 6 LLMs. We track direct mentions, paraphrased references, and linked citations separately. Prompts are calibrated per industry category.'},
                  {title:'Signal scoring',desc:'The AEO score weights 14 signals: structured data coverage, E-E-A-T indicators, BLUF quality, page speed, llms.txt configuration, robots.txt bot permissions, content depth, internal link structure, and citation recency.'},
                  {title:'Benchmarking',desc:'Scores are contextualised against domains in the same category. A 72 in SaaS means something different from a 72 in healthcare. The benchmark cohort updates monthly.'},
                  {title:'Research foundation',desc:'The model is grounded in 50,000 URLs studied for structured data correlation, 90-day longitudinal citation tracking across 35 industries, and weekly LLM behaviour audits.'},
                ].map((s,i)=>(
                  <div key={i} className="vrow">
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.93rem',marginBottom:'.3rem',color:'var(--text)'}}>{s.title}</div>
                    <div style={{fontSize:'.84rem',color:'var(--muted)',lineHeight:1.78}}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <div className="card">
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>E-E-A-T signals we check</div>
                  {EEAT.map((e,i)=>(
                    <div key={i} style={{padding:'.65rem 0',borderBottom:i<EEAT.length-1?'1px solid var(--border)':'none'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'.25rem'}}>{e.label}</div>
                      <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.6}}>{e.items}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(202,255,69,.04)',border:'1px solid rgba(202,255,69,.15)',borderRadius:'14px',padding:'1.5rem'}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'.75rem'}}>Research published</div>
                  {[
                    'Why 94% of AI-cited pages have structured data',
                    'Core Web Vitals and AI citations: the connection',
                    'International AEO across 35 global domains',
                    "GPT-4o citation behaviour: what changed in Apr 2026",
                  ].map((t,i)=>(
                    <Link key={i} href="/blog" style={{display:'block',fontSize:'.82rem',color:'rgba(255,255,255,.72)',textDecoration:'none',padding:'.5rem 0',borderBottom:i<3?'1px solid rgba(255,255,255,.06)':'none',lineHeight:1.55}}>→ {t}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VALUES */}
          <div className="sec">
            <span className="sl">How we operate</span>
            <div className="tc">
              <div>
                {[
                  {title:'Bootstrapped, not venture-backed',desc:"No investors means no pressure to monetise your data, grow at all costs, or hit an exit timeline. Revenue comes from subscriptions. If Notion Cue doesn't help you, you cancel. That's the only accountability we want."},
                  {title:'Transparent methodology',desc:"The AEO scoring model is documented publicly. We show confidence intervals. We flag when a data point is estimated versus measured. If we can't back a claim with data, we don't make it."},
                  {title:'Practitioner-first',desc:"Every tool was built because a working SEO professional needed it. Features don't get added because they look impressive on a pricing page. They get added when someone on the team can't do their job without them."},
                ].map((v,i)=>(
                  <div key={i} className="vrow">
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'.35rem',color:'var(--text)'}}>{v.title}</div>
                    <div style={{fontSize:'.87rem',color:'var(--muted)',lineHeight:1.78}}>{v.desc}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{height:'fit-content'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>What we track about you</div>
                {[
                  {item:'Scan results',      note:'Stored per account, never shared'},
                  {item:'Email address',     note:'For account access only'},
                  {item:'Usage metrics',     note:'Aggregate, anonymised'},
                  {item:'Your domain data',  note:'Never sold or shared'},
                ].map((r,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'.6rem 0',borderBottom:i<3?'1px solid var(--border)':'none',gap:'1rem'}}>
                    <span style={{fontSize:'.84rem',color:'var(--text)'}}>{r.item}</span>
                    <span style={{fontSize:'.72rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--muted2)',textAlign:'right' as const}}>{r.note}</span>
                  </div>
                ))}
                <p style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.72,marginTop:'1.1rem',paddingTop:'1.1rem',borderTop:'1px solid var(--border)'}}>We don't run ads. We don't do affiliate marketing. We don't use your scan data to train models or sell to third parties.</p>
              </div>
            </div>
          </div>

          {/* PRESS */}
          <div className="sec">
            <span className="sl">As seen in</span>
            <div className="pg">
              {PRESS.map((p,i)=>(
                <div key={i} style={{background:'var(--card2)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.25rem 1.5rem'}}>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',color:'var(--accent)',marginBottom:'.6rem'}}>{p.outlet}</div>
                  <p style={{fontSize:'.84rem',color:'var(--muted)',lineHeight:1.65,fontStyle:'italic'}}>"{p.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{padding:'4rem 0 5.5rem',textAlign:'center' as const}}>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.7rem',letterSpacing:'-.02em',marginBottom:'.75rem'}}>Check your AEO score — free</h2>
            <p style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2rem',maxWidth:'400px',margin:'0 auto 2rem'}}>Paste your domain. See how visible you are across all 6 LLMs in 30 seconds.</p>
            <Link href="/ai-visibility-tool" style={{display:'inline-flex',alignItems:'center',gap:'8px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.93rem',padding:'12px 28px',borderRadius:100,background:'var(--accent)',color:'#04030c',textDecoration:'none'}}>
              Run free scan →
            </Link>
          </div>

        </div>
        <SharedFooter />
      </div>
    </>
  )
}