// app/resources/blog/[slug]/page.tsx
// SSR Server Component — no 'use client'

import { notFound }     from 'next/navigation'
import Link             from 'next/link'
import SharedHeader     from '@/components/SharedHeader'
import SharedFooter     from '@/components/SharedFooter'
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from '../posts'
import type { Metadata } from 'next'

// ─── Static params — pre-renders all posts at build time ──────────────────────
export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

// ─── SEO metadata per post ────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title:       `${post.title} — NotionCue Blog`,
    description: post.excerpt,
    openGraph: {
      title:         post.title,
      description:   post.excerpt,
      type:          'article',
      publishedTime: post.date,
    },
  }
}

// ─── Tag colour map ───────────────────────────────────────────────────────────
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

// ─── Page component ───────────────────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related  = getRelatedPosts(post.slug, post.tag, 2)
  const ts       = tagStyle(post.tag)

  // Article JSON-LD structured data for AI citation
  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'BlogPosting',
    headline:         post.title,
    description:      post.excerpt,
    datePublished:    post.date,
    author: {
      '@type': 'Person',
      name:    post.author,
      jobTitle:post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name:    'NotionCue',
      url:     'https://notioncue.com',
    },
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#03060c;--card:#090f1a;
          --line:rgba(220,235,255,.09);--line2:rgba(220,235,255,.18);
          --text:#f5f8ff;--muted:rgba(230,239,255,.65);--muted2:rgba(220,233,255,.38);
          --lime:#caff45;--cyan:#45e4ff;--violet:#927cff;--green:#52e38e;
        }
        html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:Epilogue,sans-serif;font-weight:300}
        body{background-image:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px);background-size:48px 48px}
        a{color:inherit;text-decoration:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}

        /* Prose styles */
        .prose{font-size:.97rem;line-height:1.85;color:var(--muted)}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.75rem 0 .85rem;color:var(--text)}
        .prose h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.1rem;margin:2rem 0 .5rem;color:var(--text)}
        .prose p{margin-bottom:1.1rem}
        .prose ul,.prose ol{padding-left:1.6rem;margin-bottom:1.1rem}
        .prose li{margin-bottom:.45rem;line-height:1.75}
        .prose strong{color:var(--text);font-weight:500}
        .prose a{color:var(--lime)}
        .prose pre{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:8px;padding:1.1rem 1.25rem;overflow-x:auto;margin:1.5rem 0}
        .prose code{font-family:'JetBrains Mono',monospace;font-size:.78rem;color:var(--cyan);line-height:1.7}
        .prose .callout{background:rgba(146,124,255,.06);border:1px solid rgba(146,124,255,.18);border-radius:10px;padding:1.1rem 1.4rem;margin:1.75rem 0}
        .prose .callout p{margin:0;color:var(--text);font-size:.9rem}

        .subnav-link{
          font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.06em;
          text-transform:uppercase;padding:.55rem 1rem;border-bottom:2px solid transparent;
          color:var(--muted);white-space:nowrap;transition:all .2s;display:inline-block;
        }
        .subnav-link:hover{color:var(--text)}
        .subnav-link.active{border-bottom-color:var(--lime);color:var(--lime)}

        .related-card{
          background:linear-gradient(145deg,rgba(13,22,38,.95),rgba(7,12,22,.93));
          border:1px solid var(--line);border-radius:10px;overflow:hidden;
          transition:transform .25s,border-color .25s,box-shadow .25s;
        }
        .related-card:hover{transform:translateY(-3px);border-color:rgba(202,255,69,.2);box-shadow:0 20px 50px rgba(0,0,0,.3)}
        .related-card:hover .related-title{color:var(--lime)}
        .related-title{transition:color .2s}

        .share-btn{
          font-family:'Familjen Grotesk',sans-serif;font-size:.75rem;font-weight:600;
          padding:.45rem .9rem;border:1px solid var(--line);border-radius:100px;
          background:rgba(255,255,255,.03);color:var(--muted);cursor:pointer;transition:all .2s;
        }
        .share-btn:hover{border-color:var(--line2);color:var(--text)}

        @media(max-width:768px){
          .related-grid{grid-template-columns:1fr !important}
          .hero-content{padding:3rem 1.5rem 2rem !important}
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
              className={`subnav-link${n.href === '/blog' ? ' active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* ── ARTICLE ── */}
        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 2.5rem' }}>
          <div className="hero-content" style={{ padding:'5rem 0 3rem' }}>

            {/* Back */}
            <Link href="/blog"
              style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.08em', color:'var(--muted)', marginBottom:'2rem' }}>
              ← Back to blog
            </Link>

            {/* Tag + meta */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem', flexWrap:'wrap' }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', letterSpacing:'.08em', textTransform:'uppercase', color:ts.text, background:ts.bg, border:`1px solid ${ts.border}`, padding:'3px 9px', borderRadius:4 }}>
                {post.tag}
              </span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', color:'var(--muted2)' }}>{post.date}</span>
              <span style={{ color:'var(--muted2)', fontSize:'.65rem' }}>·</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', color:'var(--muted2)' }}>{post.read}</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'clamp(1.8rem,4vw,3rem)', lineHeight:1.1, letterSpacing:'-.02em', marginBottom:'1.25rem', color:'var(--text)' }}>
              {post.title}
            </h1>

            {/* Excerpt */}
            <p style={{ fontSize:'1.05rem', color:'var(--muted)', lineHeight:1.75, marginBottom:'2rem' }}>
              {post.excerpt}
            </p>

            {/* Author card */}
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'1rem 1.25rem', background:'rgba(255,255,255,.03)', border:'1px solid var(--line)', borderRadius:10 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,var(--violet),var(--lime))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                {post.authorInitials}
              </div>
              <div>
                <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'.9rem' }}>{post.author}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem', color:'var(--muted2)' }}>{post.authorRole}</div>
              </div>
            </div>
          </div>

          {/* Hero emoji banner */}
          <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', borderRadius:14, marginBottom:'3rem', background:post.bg, border:'1px solid var(--line)' }}>
            {post.emoji}
          </div>

          {/* Article body */}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ paddingBottom:'4rem', borderBottom:'1px solid var(--line)', marginBottom:'3rem' }}
          />

          {/* Share + CTA */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', marginBottom:'4rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem', color:'var(--muted2)' }}>Found this useful?</div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="share-btn">Share on X</button>
                <button className="share-btn">Copy link</button>
              </div>
            </div>

            {/* CTA block */}
            <div style={{ padding:'1.75rem', background:'rgba(202,255,69,.04)', border:'1px solid rgba(202,255,69,.18)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.5rem', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'1rem', marginBottom:'.35rem' }}>
                  Check your own AEO score
                </div>
                <div style={{ fontSize:'.82rem', color:'var(--muted)', lineHeight:1.5 }}>
                  Scan your domain free — get your AI visibility score in 30 seconds.
                </div>
              </div>
              <Link href="/dashboard"
                style={{ flexShrink:0, fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'.82rem', padding:'.65rem 1.35rem', borderRadius:100, background:'var(--lime)', color:'#03060c', whiteSpace:'nowrap' }}>
                Scan my site →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div style={{ borderTop:'1px solid var(--line)', padding:'4rem 2.5rem', maxWidth:1200, margin:'0 auto' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:'1.5rem' }}>
              More from the blog
            </div>
            <div className="related-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.25rem' }}>
              {related.map(p => {
                const rs = tagStyle(p.tag)
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display:'block' }}>
                    <div className="related-card">
                      <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', borderBottom:'1px solid var(--line)', background:p.bg }}>
                        {p.emoji}
                      </div>
                      <div style={{ padding:'1.25rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'.6rem' }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', letterSpacing:'.08em', textTransform:'uppercase', color:rs.text, background:rs.bg, border:`1px solid ${rs.border}`, padding:'2px 7px', borderRadius:3 }}>
                            {p.tag}
                          </span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem', color:'var(--muted2)' }}>{p.read}</span>
                        </div>
                        <div className="related-title" style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:600, fontSize:'.95rem', lineHeight:1.25, color:'var(--text)' }}>
                          {p.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <SharedFooter />
      </div>
    </>
  )
}