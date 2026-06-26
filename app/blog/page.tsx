// app/blog/page.tsx

import Link from 'next/link'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import { BLOG_POSTS, BLOG_TAGS } from './posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI SEO Research, guides and case studies',
  description: 'Research, case studies, and technical guides on Answer Engine Optimisation and AI SEO visibility.',
}

const TAG_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'AEO Strategy': { text: '#927cff', bg: 'rgba(146,124,255,.08)', border: 'rgba(146,124,255,.2)' },
  'Case Studies': { text: '#45e4ff', bg: 'rgba(69,228,255,.08)',  border: 'rgba(69,228,255,.2)'  },
  'Technical':    { text: '#52e38e', bg: 'rgba(82,227,142,.08)',  border: 'rgba(82,227,142,.2)'  },
  'LLM Updates':  { text: '#ffc45c', bg: 'rgba(255,196,92,.08)',  border: 'rgba(255,196,92,.2)'  },
}

const TOPIC_ACCENT: Record<string, string> = {
  'AEO Strategy': 'rgba(146,124,255,.25)',
  'Case Studies': 'rgba(69,228,255,.25)',
  'Technical':    'rgba(82,227,142,.25)',
  'LLM Updates':  'rgba(255,196,92,.25)',
}

const READ_BAR_COLOR: Record<string, string> = {
  'AEO Strategy': '#927cff',
  'Case Studies': '#45e4ff',
  'Technical':    '#52e38e',
  'LLM Updates':  '#ffc45c',
}

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { text: '#caff45', bg: 'rgba(202,255,69,.08)', border: 'rgba(202,255,69,.18)' }
}

// Encode read time as a percentage of 15 min for the reading bar
function readPercent(read: string): number {
  const n = parseInt(read)
  return Math.min(Math.round((n / 15) * 100), 100)
}

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'llms.txt Generator', href: '/llms-text-generator' },
  { label: 'Robots.txt',         href: '/robots-txt' },
  { label: 'BLUF Templates',     href: '/bluf-templates' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Changelog',         href: '/changelog' },
  { label: 'About',              href: '/about' },
]

// Suggested posts — these can be manually curated or derived from BLOG_POSTS
const SUGGESTED = BLOG_POSTS.slice(1, 5)

// Topic counts — derive from your data
const TOPICS = BLOG_TAGS.map(tag => ({
  tag,
  count: BLOG_POSTS.filter(p => p.tag === tag).length,
  icon: {
    'AEO Strategy': '🎯',
    'Case Studies': '🔬',
    'Technical': '⚙️',
    'LLM Updates': '🤖',
  }[tag] ?? '📄',
}))

export default function BlogIndexPage() {
  const featured = BLOG_POSTS[0]
  const rest     = BLOG_POSTS.slice(1)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Epilogue:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#03060c;--surface:#090f1a;--surface2:#0d1828;
          --line:rgba(220,235,255,.07);--line2:rgba(220,235,255,.14);
          --text:#f0f4ff;--muted:rgba(210,225,255,.6);--muted2:rgba(200,220,255,.35);
          --lime:#caff45;--lime-dim:rgba(202,255,69,.08);--lime-border:rgba(202,255,69,.18);
          --cyan:#45e4ff;--violet:#927cff;--amber:#ffc45c;
          --meta:rgba(210,225,255,.55);
        }
        html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:Epilogue,sans-serif;font-weight:300}
        body{background-image:linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px);background-size:48px 48px}
        a{color:inherit;text-decoration:none}
        .tag{display:inline-flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.07em;text-transform:uppercase;padding:3px 8px;border-radius:3px;white-space:nowrap}
        .subnav-link{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.07em;text-transform:uppercase;padding:10px 14px;color:var(--muted2);border-bottom:2px solid transparent;white-space:nowrap;display:inline-block;transition:all .2s}
        .subnav-link:hover{color:var(--muted)}
        .subnav-link.active{color:var(--lime);border-bottom-color:var(--lime)}
        .pill{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px;display:inline-block}
        .featured-card{display:grid;grid-template-columns:1fr 260px;border:1px solid var(--line2);border-radius:12px;overflow:hidden;background:linear-gradient(145deg,rgba(13,22,40,.97),rgba(7,12,22,.95));transition:border-color .3s,box-shadow .3s}
        .featured-card:hover{border-color:rgba(202,255,69,.22);box-shadow:0 24px 60px rgba(0,0,0,.35)}
        .featured-card:hover .f-title{color:var(--lime)}
        .f-title{transition:color .2s}
        .post-card{background:linear-gradient(155deg,rgba(10,18,34,.97),rgba(6,11,20,.95));border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s,border-color .25s,box-shadow .25s}
        .post-card:hover{transform:translateY(-3px);border-color:rgba(202,255,69,.18);box-shadow:0 16px 40px rgba(0,0,0,.28)}
        .post-card:hover .pc-title{color:var(--lime)}
        .pc-title{transition:color .2s}
        .sug-card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px;display:flex;gap:14px;align-items:flex-start;transition:border-color .2s,background .2s}
        .sug-card:hover{border-color:var(--line2);background:var(--surface2)}
        .sug-card:hover .sug-title{color:var(--lime)}
        .sug-title{transition:color .2s}
        .topic-card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px 16px;transition:border-color .2s,background .2s}
        .topic-card:hover{border-color:var(--line2);background:var(--surface2)}
        .section-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted2);margin-bottom:16px;display:flex;align-items:center;gap:10px}
        .section-label::after{content:'';flex:1;height:1px;background:var(--line)}
        .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--violet),var(--lime));display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:#fff;flex-shrink:0}
        .avatar-sm{width:24px;height:24px;font-size:9px}
        .rbar{height:2px;background:rgba(255,255,255,.06);border-radius:1px;margin:8px 0 12px}
        @media(max-width:900px){.featured-card{grid-template-columns:1fr}.f-aside{display:none}.grid-3{grid-template-columns:1fr 1fr !important}.sug-grid{grid-template-columns:1fr !important}.main-sidebar{grid-template-columns:1fr !important}.topic-strip{grid-template-columns:1fr 1fr !important}}
        @media(max-width:600px){.grid-3{grid-template-columns:1fr !important}.topic-strip{grid-template-columns:1fr !important}.newsletter-inner{flex-direction:column !important}}
      `}</style>

      <div style={{ background:'var(--bg)', minHeight:'100vh', color:'var(--text)' }}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{ position:'sticky', top:65, zIndex:700, background:'rgba(3,6,12,.9)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--line)', padding:'0 3.5rem', display:'flex', gap:0, overflowX:'auto', scrollbarWidth:'none' }}>
          {SUB_NAV.map(n => (
            <Link key={n.href} href={n.href} className={`subnav-link${n.href === '/blog' ? ' active' : ''}`}>{n.label}</Link>
          ))}
        </div>

        <div style={{ maxWidth:1160, margin:'0 auto', padding:'0 28px' }}>

          {/* Hero */}
          <div style={{ padding:'56px 0 40px', borderBottom:'1px solid var(--line)', display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'end' }}>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--violet)', marginBottom:10 }}>AEO research &amp; guides</div>
              <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3.2rem)', lineHeight:.95, letterSpacing:'-.03em', marginBottom:16 }}>
                Research, guides<br /><span style={{ color:'var(--lime)' }}>and case studies.</span>
              </h1>
              <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.75, maxWidth:480 }}>In-depth coverage of AEO strategy, AI citation tracking, technical implementation, and real-world results from client work across 5 LLMs.</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'3rem', color:'var(--lime)', lineHeight:1 }}>{BLOG_POSTS.length}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted2)', marginTop:4 }}>Articles published</div>
            </div>
          </div>

          {/* Filter row */}
          <div style={{ padding:'20px 0', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', borderBottom:'1px solid var(--line)' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--muted2)', letterSpacing:'.1em', textTransform:'uppercase', marginRight:4 }}>Filter</span>
            <Link href="/blog" className="pill" style={{ border:'1px solid var(--lime-border)', background:'var(--lime-dim)', color:'var(--lime)' }}>All posts</Link>
            {BLOG_TAGS.map(tag => {
              const s = tagStyle(tag)
              return (
                <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g,'-')}`} className="pill" style={{ border:`1px solid ${s.border}`, background:s.bg, color:s.text }}>
                  {tag}
                </Link>
              )
            })}
          </div>

          {/* Featured */}
          <div style={{ padding:'36px 0 24px' }}>
            <div className="section-label">Latest post</div>
            <Link href={`/blog/${featured.slug}`}>
              <div className="featured-card">
                <div style={{ padding:36, display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:18 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--bg)', background:'var(--lime)', padding:'2px 7px', borderRadius:2, fontWeight:500 }}>New</span>
                    {(() => { const s = tagStyle(featured.tag); return <span className="tag" style={{ color:s.text, background:s.bg, border:`1px solid ${s.border}` }}>{featured.tag}</span> })()}
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--meta)' }}>{featured.date}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--meta)' }}>· {featured.read}</span>
                  </div>
                  <h2 className="f-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.6rem', lineHeight:1.15, letterSpacing:'-.02em', color:'var(--text)', marginBottom:14 }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.8, marginBottom:24, flex:1 }}>{featured.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:'auto' }}>
                    <div className="avatar">{featured.authorInitials}</div>
                    <div>
                      <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'13px' }}>{featured.author}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--meta)', marginTop:1 }}>{featured.authorRole}</div>
                    </div>
                  </div>
                </div>
                <div className="f-aside" style={{ background:'linear-gradient(160deg,rgba(146,124,255,.06),rgba(202,255,69,.04))', borderLeft:'1px solid var(--line)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28, gap:16 }}>
                  <div style={{ fontSize:'60px', lineHeight:1 }}>{featured.emoji}</div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.8rem', color:'var(--lime)', lineHeight:1 }}>3.2K</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--muted2)', letterSpacing:'.08em', textTransform:'uppercase', marginTop:3 }}>Views this week</div>
                  </div>
                  <div style={{ height:1, background:'var(--line)', width:'100%' }} />
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.8rem', color:'var(--violet)', lineHeight:1 }}>{parseInt(featured.read)}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--muted2)', letterSpacing:'.08em', textTransform:'uppercase', marginTop:3 }}>Min read</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Post grid */}
          <div style={{ paddingBottom:0 }}>
            <div className="section-label">All articles — {BLOG_POSTS.length} posts</div>
            <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {rest.map(post => {
                const s = tagStyle(post.tag)
                const barColor = READ_BAR_COLOR[post.tag] ?? '#caff45'
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display:'block' }}>
                    <article className="post-card">
                      <div style={{ height:110, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'42px', background:post.bg, borderBottom:'1px solid var(--line)', flexShrink:0 }}>
                        {post.emoji}
                      </div>
                      <div style={{ padding:16, display:'flex', flexDirection:'column', flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:10 }}>
                          <span className="tag" style={{ color:s.text, background:s.bg, border:`1px solid ${s.border}` }}>{post.tag}</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--meta)' }}>{post.read}</span>
                        </div>
                        <h3 className="pc-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'15px', lineHeight:1.3, marginBottom:8 }}>
                          {post.title}
                        </h3>
                        <div className="rbar">
                          <div style={{ height:'100%', borderRadius:1, background:barColor, width:`${readPercent(post.read)}%` }} />
                        </div>
                        <p style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.65, flex:1, marginBottom:14 }}>{post.excerpt}</p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div className="avatar avatar-sm">{post.authorInitials}</div>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--meta)' }}>{post.author}</span>
                          </div>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--muted2)' }}>{post.date}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Suggested reading */}
          <div style={{ padding:'40px 0' }}>
            <div className="section-label">Suggested reading</div>
            <div className="main-sidebar" style={{ display:'grid', gridTemplateColumns:'1fr 220px', gap:20, alignItems:'start' }}>
              <div className="sug-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {SUGGESTED.map((post, i) => {
                  const s = tagStyle(post.tag)
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display:'block' }}>
                      <div className="sug-card">
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'22px', fontWeight:300, color:'var(--line2)', lineHeight:1, flexShrink:0, width:28, marginTop:1 }}>
                          0{i + 1}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="sug-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'13px', lineHeight:1.3, color:'var(--text)', marginBottom:5 }}>
                            {post.title}
                          </div>
                          <p style={{ fontSize:'11px', color:'var(--muted)', lineHeight:1.6, marginTop:4 }}>{post.excerpt}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginTop:8 }}>
                            <span className="tag" style={{ color:s.text, background:s.bg, border:`1px solid ${s.border}` }}>{post.tag}</span>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--meta)' }}>{post.read}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {/* Trending topics */}
                <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:10, padding:20 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:14 }}>Trending topics</div>
                  {[['AI Overview', 12], ['Schema Markup', 9], ['BLUF Structure', 7], ['Entity SEO', 6], ['llms.txt', 5]].map(([label, count], i) => (
                    <div key={String(label)} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--muted)', padding:'6px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                      <span style={{ color:'var(--muted2)', width:14, flexShrink:0 }}>0{i + 1}</span>
                      <span style={{ flex:1 }}>{label}</span>
                      <span style={{ color:'var(--violet)' }}>{count}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:10, padding:20 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:10 }}>By the numbers</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[['var(--lime)', BLOG_POSTS.length, 'Articles'], ['var(--violet)', 5, 'LLMs tracked'], ['var(--cyan)', BLOG_TAGS.length, 'Topics'], ['var(--amber)', '8m', 'Avg read']].map(([color, num, lbl]) => (
                      <div key={String(lbl)}>
                        <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.4rem', color:String(color), lineHeight:1 }}>{num}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'var(--muted2)', marginTop:3, textTransform:'uppercase', letterSpacing:'.06em' }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse by topic */}
          <div style={{ paddingBottom:32 }}>
            <div className="section-label">Browse by topic</div>
            <div className="topic-strip" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
              {TOPICS.map(({ tag, count, icon }) => (
                <Link key={tag} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g,'-')}`}>
                  <div className="topic-card">
                    <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
                    <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'13px', color:'var(--text)', marginBottom:4 }}>{tag}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--muted2)' }}>{count} articles</div>
                    <div style={{ height:2, borderRadius:1, background: TOPIC_ACCENT[tag] ?? 'var(--line)', marginTop:12 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div style={{ paddingBottom:48 }}>
            <div style={{ background:'linear-gradient(130deg,rgba(146,124,255,.1),rgba(202,255,69,.05))', border:'1px solid rgba(146,124,255,.2)', borderRadius:12, padding:'36px 40px' }}>
              <div className="newsletter-inner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:32 }}>
                <div>
                  <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.3rem', marginBottom:6 }}>AEO updates, straight to your inbox.</div>
                  <p style={{ fontSize:'13px', color:'var(--muted)' }}>One email per week. LLM citation tracking, algorithm shifts, and what's working across our client portfolio.</p>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <input type="email" placeholder="your@email.com" style={{ background:'rgba(255,255,255,.05)', border:'1px solid var(--line2)', borderRadius:6, padding:'10px 14px', fontSize:'12px', color:'var(--text)', fontFamily:"'JetBrains Mono',monospace", width:200, outline:'none' }} />
                  <button style={{ background:'var(--lime)', color:'var(--bg)', border:'none', borderRadius:6, padding:'10px 18px', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.08em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap' }}>Subscribe</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <SharedFooter />
      </div>
    </>
  )
}