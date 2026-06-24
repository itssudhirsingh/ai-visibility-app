// app/resources/blog/page.tsx
// SSR — no 'use client'. Reads posts at build/request time.

import Link from 'next/link'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import { BLOG_POSTS, BLOG_TAGS } from './posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI SEO Research, guides and case studies',
  description: 'Research, case studies, and technical guides on Answer Engine Optimisation and AI SEO visibility.',
}

// Tag colour map — add new tags here as you create them
const TAG_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'AEO Strategy': { text: '#927cff', bg: 'rgba(146,124,255,.08)', border: 'rgba(146,124,255,.2)' },
  'Case Studies': { text: '#45e4ff', bg: 'rgba(69,228,255,.08)',  border: 'rgba(69,228,255,.2)'  },
  'Technical':    { text: '#52e38e', bg: 'rgba(82,227,142,.08)',  border: 'rgba(82,227,142,.2)'  },
  'LLM Updates':  { text: '#ffc45c', bg: 'rgba(255,196,92,.08)',  border: 'rgba(255,196,92,.2)'  },
}

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { text: '#caff45', bg: 'rgba(202,255,69,.08)', border: 'rgba(202,255,69,.2)' }
}

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

export default function BlogIndexPage() {
  const featured = BLOG_POSTS[0]
  const rest     = BLOG_POSTS.slice(1)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#03060c;--card:#090f1a;
          --line:rgba(220,235,255,.09);--line2:rgba(220,235,255,.18);
          --text:#f5f8ff;--muted:rgba(230,239,255,.65);--muted2:rgba(220,233,255,.38);
          --lime:#caff45;--cyan:#45e4ff;--violet:#927cff;
          --meta:rgba(220,233,255,.72);
        }
        html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:Epilogue,sans-serif;font-weight:300}
        body{background-image:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px);background-size:48px 48px}
        a{color:inherit;text-decoration:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}

        .blog-card{
          background:linear-gradient(145deg,rgba(13,22,38,.95),rgba(7,12,22,.93));
          border:1px solid var(--line);border-radius:10px;overflow:hidden;
          transition:transform .25s,border-color .25s,box-shadow .25s;
          display:flex;flex-direction:column;
        }
        .blog-card:hover{
          transform:translateY(-3px);
          border-color:rgba(202,255,69,.2);
          box-shadow:0 20px 50px rgba(0,0,0,.3);
        }
        .blog-card:hover .card-title{color:var(--lime)}
        .card-title{transition:color .2s}

        .featured-card{
          background:linear-gradient(145deg,rgba(13,22,38,.95),rgba(7,12,22,.93));
          border:1px solid var(--line);border-radius:12px;overflow:hidden;
          display:grid;grid-template-columns:1fr 360px;
          transition:border-color .25s,box-shadow .25s;
        }
        .featured-card:hover{
          border-color:rgba(202,255,69,.22);
          box-shadow:0 24px 60px rgba(0,0,0,.35);
        }
        .featured-card:hover .featured-title{color:var(--lime)}
        .featured-title{transition:color .2s}

        .subnav-link{
          font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.06em;
          text-transform:uppercase;padding:.55rem 1rem;border-bottom:2px solid transparent;
          color:var(--muted);white-space:nowrap;transition:all .2s;display:inline-block;
        }
        .subnav-link:hover{color:var(--text)}
        .subnav-link.active{border-bottom-color:var(--lime);color:var(--lime)}

        @media(max-width:900px){
          .featured-card{grid-template-columns:1fr !important}
          .featured-banner{display:none}
          .grid-3{grid-template-columns:1fr 1fr !important}
        }
        @media(max-width:600px){
          .grid-3{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{ background:'var(--bg)', minHeight:'100vh', color:'var(--text)' }}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{
          position:'sticky', top:65, zIndex:700,
          background:'rgba(3,6,12,.9)', backdropFilter:'blur(16px)',
          borderBottom:'1px solid var(--line)',
          padding:'.55rem 3.5rem', display:'flex', gap:0, overflowX:'auto',
        }}>
          {SUB_NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`subnav-link${n.href === '/resources/blog' ? ' active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2.5rem' }}>

          {/* ── Hero ── */}
          <div style={{ padding:'5rem 0 3.5rem', borderBottom:'1px solid var(--line)' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.67rem', letterSpacing:'.18em', textTransform:'uppercase', color:VAR_VIOLET, marginBottom:10 }}>
              AEOvision Blog
            </div>
            <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'clamp(2.2rem,5vw,4rem)', lineHeight:.95, letterSpacing:'-.03em', marginBottom:'1rem' }}>
              Research, guides<br /><span style={{ color:'var(--lime)' }}>and case studies</span>
            </h1>
            <p style={{ fontSize:'1rem', color:'var(--muted)', lineHeight:1.75, maxWidth:520, marginBottom:'2rem' }}>
              In-depth coverage of AEO strategy, AI citation tracking, technical implementation, and real-world results from our client work.
            </p>
            {/* Tag filters — static links for SSR */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Link href="/resources/blog"
                style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', padding:'5px 12px', borderRadius:100, border:'1px solid var(--lime)', background:'rgba(202,255,69,.08)', color:'var(--lime)' }}>
                All posts
              </Link>
              {BLOG_TAGS.map(tag => {
                const s = tagStyle(tag)
                return (
                  <Link key={tag} href={`/resources/blog/tag/${tag.toLowerCase().replace(/\s+/g,'-')}`}
                    style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', padding:'5px 12px', borderRadius:100, border:`1px solid ${s.border}`, background:s.bg, color:s.text }}>
                    {tag}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── Featured post ── */}
          <div style={{ padding:'3rem 0 2rem' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:'1.25rem' }}>
              Latest post
            </div>
            <Link href={`/resources/blog/${featured.slug}`}>
              <div className="featured-card">
                <div style={{ padding:'2.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem', flexWrap:'wrap' }}>
                    {(() => { const s = tagStyle(featured.tag); return (
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', letterSpacing:'.08em', textTransform:'uppercase', color:s.text, background:s.bg, border:`1px solid ${s.border}`, padding:'3px 9px', borderRadius:4 }}>
                        {featured.tag}
                      </span>
                    )})()}
                    {/* ── UPDATED: featured meta colour ── */}
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', color:'var(--meta)' }}>{featured.date}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', color:'var(--meta)' }}>· {featured.read}</span>
                  </div>
                  <h2 className="featured-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.6rem', lineHeight:1.15, letterSpacing:'-.02em', marginBottom:'1rem', color:'var(--text)' }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize:'.92rem', color:'var(--muted)', lineHeight:1.75, marginBottom:'1.75rem' }}>
                    {featured.excerpt}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,var(--violet),var(--lime))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {featured.authorInitials}
                    </div>
                    <div>
                      {/* ── UPDATED: featured author name and role colour ── */}
                      <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'.85rem', color:'var(--text)' }}>{featured.author}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', color:'var(--meta)' }}>{featured.authorRole}</div>
                    </div>
                  </div>
                </div>
                <div className="featured-banner" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', background:featured.bg, borderLeft:'1px solid var(--line)' }}>
                  {featured.emoji}
                </div>
              </div>
            </Link>
          </div>

          {/* ── Post grid ── */}
          <div style={{ paddingBottom:'5rem' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:'1.25rem' }}>
              All posts — {BLOG_POSTS.length} articles
            </div>
            <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
              {rest.map(post => {
                const s = tagStyle(post.tag)
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display:'block' }}>
                    <article className="blog-card">
                      {/* Banner */}
                      <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', background:post.bg, borderBottom:'1px solid var(--line)', flexShrink:0 }}>
                        {post.emoji}
                      </div>
                      {/* Body */}
                      <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', flex:1, gap:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'.75rem', flexWrap:'wrap' }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', letterSpacing:'.08em', textTransform:'uppercase', color:s.text, background:s.bg, border:`1px solid ${s.border}`, padding:'2px 7px', borderRadius:3 }}>
                            {post.tag}
                          </span>
                          {/* ── UPDATED: card read time colour ── */}
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', color:'var(--meta)' }}>{post.read}</span>
                        </div>
                        <h3 className="card-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'.95rem', lineHeight:1.3, marginBottom:'.7rem', color:'var(--text)' }}>
                          {post.title}
                        </h3>
                        {/* ── UPDATED: excerpt colour ── */}
                        <p style={{ fontSize:'.8rem', color:'var(--muted)', lineHeight:1.65, flex:1, marginBottom:'1.1rem' }}>
                          {post.excerpt}
                        </p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                            <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,var(--violet),var(--lime))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.58rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                              {post.authorInitials}
                            </div>
                            {/* ── UPDATED: card author name and date colour ── */}
                            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', color:'var(--meta)' }}>{post.author}</span>
                          </div>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', color:'var(--meta)' }}>{post.date}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}

// TypeScript helper — avoids repeating the string
const VAR_VIOLET = 'var(--violet)'