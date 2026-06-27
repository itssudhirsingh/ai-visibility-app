// app/blog/tag/[tag]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import { BLOG_POSTS, BLOG_TAGS } from '../../posts'

// Slugify a tag the same way the index page links it: lowercase, spaces → hyphens
function slugifyTag(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

// Resolve a URL slug back to the real tag label (or undefined if no match)
function tagFromSlug(slug: string) {
  return BLOG_TAGS.find(t => slugifyTag(t) === slug)
}

const TAG_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'AEO Strategy': { text: '#927cff', bg: 'rgba(146,124,255,.08)', border: 'rgba(146,124,255,.2)' },
  'Case Studies': { text: '#45e4ff', bg: 'rgba(69,228,255,.08)',  border: 'rgba(69,228,255,.2)'  },
  'Technical':    { text: '#52e38e', bg: 'rgba(82,227,142,.08)',  border: 'rgba(82,227,142,.2)'  },
  'LLM Updates':  { text: '#ffc45c', bg: 'rgba(255,196,92,.08)',  border: 'rgba(255,196,92,.2)'  },
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
  { label: 'Changelog',          href: '/changelog' },
  { label: 'About',              href: '/about' },
]

// Pre-render a static page for every tag at build time
export function generateStaticParams() {
  return BLOG_TAGS.map(tag => ({ tag: slugifyTag(tag) }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag: tagSlug } = await params
  const tag = tagFromSlug(tagSlug)
  if (!tag) return { title: 'Tag not found' }
  return {
    title: `${tag} — AI SEO articles & guides`,
    description: `All articles tagged ${tag}: research, case studies, and technical guides on Answer Engine Optimisation.`,
    alternates: {
      canonical: `https://notioncue.com/blog/tag/${tagSlug}`,
    },
  }
}

export default async function BlogTagPage(
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag: tagSlug } = await params
  const tag = tagFromSlug(tagSlug)

  // Unknown tag → 404
  if (!tag) notFound()

  const posts = BLOG_POSTS.filter(p => p.tag === tag)
  const accent = tagStyle(tag)

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
        .post-card{background:linear-gradient(155deg,rgba(10,18,34,.97),rgba(6,11,20,.95));border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s,border-color .25s,box-shadow .25s}
        .post-card:hover{transform:translateY(-3px);border-color:rgba(202,255,69,.18);box-shadow:0 16px 40px rgba(0,0,0,.28)}
        .post-card:hover .pc-title{color:var(--lime)}
        .pc-title{transition:color .2s}
        .section-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted2);margin-bottom:16px;display:flex;align-items:center;gap:10px}
        .section-label::after{content:'';flex:1;height:1px;background:var(--line)}
        .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--violet),var(--lime));display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:#fff;flex-shrink:0}
        .avatar-sm{width:24px;height:24px;font-size:9px}
        .rbar{height:2px;background:rgba(255,255,255,.06);border-radius:1px;margin:8px 0 12px}
        @media(max-width:900px){.grid-3{grid-template-columns:1fr 1fr !important}}
        @media(max-width:600px){.grid-3{grid-template-columns:1fr !important}}
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
          <div style={{ padding:'56px 0 32px', borderBottom:'1px solid var(--line)' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'.18em', textTransform:'uppercase', color:accent.text, marginBottom:14 }}>
              <Link href="/blog" style={{ color:'var(--muted2)' }}>Blog</Link> / Tag
            </div>
            <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3rem)', lineHeight:1, letterSpacing:'-.03em', marginBottom:16 }}>
              <span style={{ color:accent.text }}>{tag}</span>
            </h1>
            <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.75, maxWidth:480 }}>
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged {tag}.
            </p>
          </div>

          {/* Filter row */}
          <div style={{ padding:'20px 0', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', borderBottom:'1px solid var(--line)' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'var(--muted2)', letterSpacing:'.1em', textTransform:'uppercase', marginRight:4 }}>Filter</span>
            <Link href="/blog" className="pill" style={{ border:'1px solid var(--line2)', background:'transparent', color:'var(--muted)' }}>All posts</Link>
            {BLOG_TAGS.map(t => {
              const s = tagStyle(t)
              const active = t === tag
              return (
                <Link
                  key={t}
                  href={`/blog/tag/${slugifyTag(t)}`}
                  className="pill"
                  style={{
                    border:`1px solid ${s.border}`,
                    background: active ? s.text : s.bg,
                    color: active ? 'var(--bg)' : s.text,
                    fontWeight: active ? 600 : 300,
                  }}
                >
                  {t}
                </Link>
              )
            })}
          </div>

          {/* Post grid */}
          <div style={{ padding:'36px 0 48px' }}>
            <div className="section-label">{tag} — {posts.length} posts</div>
            {posts.length === 0 ? (
              <div style={{ padding:'48px 0', textAlign:'center', color:'var(--muted2)', fontFamily:"'JetBrains Mono',monospace", fontSize:'12px' }}>
                No articles in this topic yet. <Link href="/blog" style={{ color:'var(--lime)' }}>Browse all posts →</Link>
              </div>
            ) : (
              <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {posts.map(post => {
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
            )}
          </div>

        </div>

        <SharedFooter />
      </div>
    </>
  )
}