// app/blog/[slug]/page.tsx
// SSR Server Component — no 'use client'

import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { blogPostSchema, breadcrumbSchema } from '@/lib/schema'
import Link from 'next/link'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from '../posts'
import ReadingProgress from './ReadingProgress'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = `https://notioncue.com/blog/${post.slug}`
  return {
    title:       `${post.title} — Notion Cue Blog`,
    description: post.excerpt,
    alternates:  { canonical: url },
    openGraph: {
      title:          post.title,
      description:    post.excerpt,
      type:           'article',
      url,
      publishedTime:  post.date,
      authors:        [post.author],
      tags:           [post.tag],
      siteName:       'Notion Cue',
      images: [{
        url:    'https://notioncue.com/og-image.png',
        width:  1200,
        height: 630,
        alt:    post.title,
      }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt,
      site:        '@notioncue',
      images:      ['https://notioncue.com/og-image.png'],
    },
  }
}

const TAG_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'AEO Strategy': { text: '#927cff', bg: 'rgba(146,124,255,.08)', border: 'rgba(146,124,255,.2)' },
  'Case Studies': { text: '#45e4ff', bg: 'rgba(69,228,255,.08)',  border: 'rgba(69,228,255,.2)'  },
  'Technical':    { text: '#52e38e', bg: 'rgba(82,227,142,.08)',  border: 'rgba(82,227,142,.2)'  },
  'LLM Updates':  { text: '#ffc45c', bg: 'rgba(255,196,92,.08)',  border: 'rgba(255,196,92,.2)'  },
}

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { text: '#caff45', bg: 'rgba(202,255,69,.08)', border: 'rgba(202,255,69,.2)' }
}

function readPercent(read: string): number {
  const n = parseInt(read)
  return Math.min(Math.round((n / 16) * 100), 100)
}

const READ_BAR_COLOR: Record<string, string> = {
  'AEO Strategy': '#927cff',
  'Case Studies': '#45e4ff',
  'Technical':    '#52e38e',
  'LLM Updates':  '#ffc45c',
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

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post.slug, post.tag, 4)
  const ts = tagStyle(post.tag)
  const barColor = READ_BAR_COLOR[post.tag] ?? '#caff45'

  return (
    <>
      <JsonLd schema={blogPostSchema({ ...post })} />
      <JsonLd schema={breadcrumbSchema([{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Epilogue:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #03060c;
          --surface: #0a1120;
          --surface2: #0d1828;
          --line: rgba(220,235,255,.09);
          --line2: rgba(220,235,255,.16);
          --text: #eef2ff;
          --prose: rgba(220,232,255,.82);
          --muted: rgba(200,218,255,.58);
          --muted2: rgba(190,210,255,.38);
          --lime: #caff45;
          --lime-dim: rgba(202,255,69,.07);
          --lime-border: rgba(202,255,69,.2);
          --cyan: #45e4ff;
          --violet: #927cff;
          --amber: #ffc45c;
          --green: #52e38e;
          --meta: rgba(210,225,255,.52);
        }

        html, body {
          min-height: 100%;
          background: var(--bg);
          color: var(--text);
          font-family: 'Epilogue', sans-serif;
          font-weight: 300;
          /* Prevent horizontal overflow globally */
          overflow-x: clip;
        }

        body {
          background-image:
            linear-gradient(rgba(255,255,255,.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        a { color: inherit; text-decoration: none; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

        /* ── Reading progress bar ── */
        #read-progress {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 9999;
          pointer-events: none;
        }
        #read-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--violet), var(--lime));
          transition: width .08s linear;
        }

        /* ── Sub-nav ── */
        .subnav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: .07em;
          text-transform: uppercase;
          padding: 10px 14px;
          border-bottom: 2px solid transparent;
          color: var(--muted2);
          white-space: nowrap;
          transition: all .2s;
          display: inline-block;
        }
        .subnav-link:hover { color: var(--muted); }
        .subnav-link.active { border-bottom-color: var(--lime); color: var(--lime); }

        /* ── Tag badge ── */
        .tag {
          display: inline-flex;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: .07em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 3px;
          white-space: nowrap;
        }

        /* ── Prose ── */
        .prose {
          font-size: 1rem;
          line-height: 1.9;
          /* FIX 1: bright enough to read on dark bg */
          color: var(--prose);
          /* FIX 2: prevent prose from overflowing its column */
          min-width: 0;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .prose h2 {
          font-family: 'Familjen Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.45rem;
          letter-spacing: -.02em;
          margin: 3rem 0 .9rem;
          color: var(--text);
          padding-top: 1rem;
          line-height: 1.2;
        }
        .prose h3 {
          font-family: 'Familjen Grotesk', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 2.25rem 0 .6rem;
          color: var(--text);
          line-height: 1.3;
        }
        .prose p { margin-bottom: 1.2rem; }
        .prose ul, .prose ol { padding-left: 1.6rem; margin-bottom: 1.2rem; }
        .prose li { margin-bottom: .5rem; line-height: 1.8; }
        .prose strong { color: var(--text); font-weight: 500; }
        .prose em { color: rgba(220,232,255,.9); font-style: italic; }
        .prose a { color: var(--lime); text-decoration: underline; text-underline-offset: 3px; }
        .prose pre {
          background: rgba(255,255,255,.04);
          border: 1px solid var(--line2);
          border-radius: 8px;
          padding: 1.1rem 1.25rem;
          overflow-x: auto;
          margin: 1.75rem 0;
          /* FIX 3: don't blow out the column */
          max-width: 100%;
        }
        .prose code {
          font-family: 'JetBrains Mono', monospace;
          font-size: .8rem;
          color: var(--cyan);
          line-height: 1.7;
        }
        .prose :not(pre) > code {
          background: rgba(69,228,255,.06);
          border: 1px solid rgba(69,228,255,.14);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: .8rem;
          color: var(--cyan);
        }
        .prose blockquote {
          border-left: 3px solid var(--violet);
          padding: .75rem 0 .75rem 1.25rem;
          margin: 1.75rem 0;
          color: var(--text);
          font-style: italic;
          background: rgba(146,124,255,.04);
          border-radius: 0 6px 6px 0;
        }
        .prose .callout {
          background: rgba(146,124,255,.06);
          border: 1px solid rgba(146,124,255,.18);
          border-radius: 10px;
          padding: 1.1rem 1.4rem;
          margin: 1.75rem 0;
        }
        .prose .callout p { margin: 0; color: var(--text); font-size: .9rem; }

        /* ── Two-column article layout ── */
        .article-outer {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 28px;
          /* FIX 4: never wider than viewport */
          box-sizing: border-box;
          width: 100%;
        }

        .article-layout {
          display: grid;
          /* FIX 5: prose col uses minmax so it shrinks; sidebar fixed at 236px */
          grid-template-columns: minmax(0, 1fr) 236px;
          gap: 52px;
          align-items: start;
        }

        /* ── Sticky sidebar ── */
        .article-sidebar {
          /* FIX 6: sticky requires the grid row to have height > sidebar height */
          position: sticky;
          top: 108px;
          /* FIX 7: min-width 0 prevents blowout */
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          /* FIX 8: don't clip the sidebar content */
          overflow: visible;
        }

        .sidebar-block {
          background: var(--surface);
          border: 1px solid var(--line2);
          border-radius: 10px;
          padding: 16px;
          /* FIX 9: sidebar text must be legible */
          color: var(--text);
        }

        .sidebar-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(220,232,255,.62);
          margin-bottom: 12px;
        }

        /* Progress bar inside sidebar */
        .sidebar-prog-track {
          height: 3px;
          background: rgba(255,255,255,.07);
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        #sidebar-progress {
          height: 100%;
          width: 0%;
          border-radius: 2px;
          transition: width .08s linear;
        }

        /* Sidebar meta rows */
        .sidebar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
        }
        .sidebar-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sidebar-row-label { color: rgba(220,232,255,.62); text-transform: uppercase; letter-spacing: .06em; }
        .sidebar-row-val { color: var(--text); text-align: right; }

        /* Share buttons in sidebar */
        .share-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 8px 0;
          border: 1px solid var(--line2);
          border-radius: 7px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          transition: all .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
        }
        .share-btn:hover { border-color: var(--lime-border); color: var(--lime); }

        /* ── Section label ── */
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--muted2);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--line); }

        /* ── More posts cards ── */
        .more-card {
          background: linear-gradient(155deg, rgba(10,18,34,.97), rgba(6,11,20,.95));
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform .25s, border-color .25s, box-shadow .25s;
          /* FIX 10: cards must not overflow grid cell */
          min-width: 0;
        }
        .more-card:hover {
          transform: translateY(-3px);
          border-color: rgba(202,255,69,.18);
          box-shadow: 0 16px 40px rgba(0,0,0,.28);
        }
        .more-card:hover .mc-title { color: var(--lime); }
        .mc-title { transition: color .2s; }

        /* Reading bar on cards */
        .rbar { height: 2px; background: rgba(255,255,255,.06); border-radius: 1px; margin: 8px 0 10px; }
        .rbar-fill { height: 100%; border-radius: 1px; }

        /* ── Author bio ── */
        .author-bio-card {
          padding: 20px 22px;
          background: var(--surface);
          border: 1px solid var(--line2);
          border-radius: 12px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        /* ── CTA block ── */
        .cta-block {
          padding: 22px 26px;
          background: rgba(202,255,69,.04);
          border: 1px solid var(--lime-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        /* ── Newsletter strip ── */
        .nl-strip {
          background: linear-gradient(130deg, rgba(146,124,255,.09), rgba(202,255,69,.04));
          border: 1px solid rgba(146,124,255,.2);
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .nl-input {
          background: rgba(255,255,255,.05);
          border: 1px solid var(--line2);
          border-radius: 6px;
          padding: 9px 14px;
          font-size: 12px;
          color: var(--text);
          font-family: 'JetBrains Mono', monospace;
          width: 188px;
          outline: none;
        }
        .nl-input::placeholder { color: var(--muted2); }
        .nl-btn {
          background: var(--lime);
          color: #03060c;
          border: none;
          border-radius: 6px;
          padding: 9px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: .07em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        /* ── RESPONSIVE ── */

        /* Tablet: hide sidebar, keep single prose column */
        @media (max-width: 900px) {
          .article-layout {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .article-sidebar {
            display: none !important;
          }
          .more-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .article-outer {
            padding: 0 20px;
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .article-outer {
            padding: 0 16px;
          }
          .more-grid {
            grid-template-columns: 1fr !important;
          }
          .cta-block {
            flex-direction: column;
            align-items: flex-start;
          }
          .nl-strip {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }
          .nl-input {
            width: 100%;
          }
          .nl-form-row {
            flex-direction: column;
            width: 100%;
          }
          .nl-btn {
            width: 100%;
            text-align: center;
          }
          .hero-title {
            font-size: 1.65rem !important;
          }
          .author-bio-card {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Reading progress bar — top of viewport */}
      <div id="read-progress" aria-hidden="true">
        <div id="read-progress-fill" />
      </div>

      {/* Client component handles scroll listeners — no inline scripts */}
      <ReadingProgress tagColor={barColor} />

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{
          position: 'sticky', top: 65, zIndex: 700,
          background: 'rgba(3,6,12,.94)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--line)',
          padding: '0 28px', display: 'flex', gap: 0,
          overflowX: 'auto', scrollbarWidth: 'none' as const,
        }}>
          {SUB_NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`subnav-link${n.href === '/blog' ? ' active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* ── Article hero — constrained to prose width ── */}
        <div className="article-outer">
          <div style={{ paddingTop: 48, paddingBottom: 36, maxWidth: 680 }}>

            {/* Back pill */}
            <Link href="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: 'var(--muted2)', marginBottom: 28,
              border: '1px solid var(--line2)', borderRadius: 100,
              padding: '6px 14px',
            }}>
              ← Blog
            </Link>

            {/* Tag + meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <span className="tag" style={{ color: ts.text, background: ts.bg, border: `1px solid ${ts.border}` }}>
                {post.tag}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--meta)' }}>
                {post.date}
              </span>
              <span style={{ color: 'var(--line2)', fontSize: '10px' }}>·</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--meta)' }}>
                {post.read}
              </span>
            </div>

            {/* Title */}
            <h1 className="hero-title" style={{
              fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700,
              fontSize: 'clamp(1.65rem, 3.5vw, 2.65rem)',
              lineHeight: 1.12, letterSpacing: '-.025em',
              marginBottom: 18, color: 'var(--text)',
            }}>
              {post.title}
            </h1>

            {/* Excerpt */}
            <p
              data-speakable="excerpt"
              style={{
                fontSize: '1.05rem', color: 'rgba(220,232,255,.78)',
                lineHeight: 1.78, marginBottom: 28,
              }}
            >
              {post.excerpt}
            </p>

            {/* Author pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: 'rgba(255,255,255,.025)',
              border: '1px solid var(--line)',
              borderRadius: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--violet), var(--lime))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 500, color: '#fff',
              }}>
                {post.authorInitials}
              </div>
              <div>
                <div style={{ fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>
                  {post.author}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--meta)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {post.authorRole}
                </div>
              </div>
            </div>
          </div>

          {/* Hero banner */}
          <div style={{
            height: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '4.5rem',
            borderRadius: 14,
            background: post.bg,
            border: '1px solid var(--line)',
            marginBottom: 48,
            maxWidth: 680,
          }}>
            {post.emoji}
          </div>
        </div>

        {/* ── Two-column article layout ── */}
        <div className="article-outer">
          <div className="article-layout">

            {/* ── Main prose column ── */}
            <div style={{ minWidth: 0 }}>
              <article
                className="prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Post footer */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--line)' }}>

                {/* Share row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 12, marginBottom: 28,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--muted2)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    Share this post
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="share-btn" style={{ width: 'auto', padding: '8px 14px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share on X
                    </button>
                    <button className="share-btn" style={{ width: 'auto', padding: '8px 14px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      Copy link
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="cta-block" style={{ marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 5, color: 'var(--text)' }}>
                      Check your AEO score
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                      Scan your domain free — get your AI visibility score across 5 LLMs in 30 seconds.
                    </div>
                  </div>
                  <Link href="/ai-visibility-tool" style={{
                    flexShrink: 0,
                    fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700, fontSize: '13px',
                    padding: '10px 20px', borderRadius: 100,
                    background: 'var(--lime)', color: '#03060c',
                    whiteSpace: 'nowrap',
                  }}>
                    Scan my site →
                  </Link>
                </div>

                {/* Author bio */}
                <div className="author-bio-card" style={{ marginBottom: 52 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--violet), var(--lime))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 500, color: '#fff',
                  }}>
                    {post.authorInitials}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 600, fontSize: '15px', marginBottom: 3, color: 'var(--text)' }}>
                      {post.author}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--meta)', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      {post.authorRole}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--prose)', lineHeight: 1.72 }}>
                      Senior SEO and AEO specialist with 12+ years across e-commerce, global education, and healthcare. Building Notion Cue to track brand citations across ChatGPT, Perplexity, Gemini, and AI Overviews.
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Link href="https://linkedin.com/in/sudhir-ks" style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                        color: 'var(--violet)', border: '1px solid rgba(146,124,255,.2)',
                        borderRadius: 100, padding: '4px 11px',
                        textTransform: 'uppercase', letterSpacing: '.06em',
                      }}>LinkedIn</Link>
                      <Link href="https://notioncue.com" style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                        color: 'var(--lime)', border: '1px solid var(--lime-border)',
                        borderRadius: 100, padding: '4px 11px',
                        textTransform: 'uppercase', letterSpacing: '.06em',
                      }}>Notion Cue</Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Sticky sidebar ── */}
            <aside className="article-sidebar">

              {/* Reading progress */}
              <div className="sidebar-block">
                <div className="sidebar-label">Reading progress</div>
                <div className="sidebar-prog-track">
                  <div
                    id="sidebar-progress"
                    style={{ background: `linear-gradient(90deg, var(--violet), ${barColor})` }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(220,232,255,.62)' }}>Start</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(220,232,255,.62)' }}>{post.read}</span>
                </div>
              </div>

              {/* Post meta */}
              <div className="sidebar-block">
                <div className="sidebar-label">About this post</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {([
                    ['Read time', post.read],
                    ['Published', post.date],
                    ['Author', post.author.split(' ')[0]],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="sidebar-row">
                      <span className="sidebar-row-label">{label}</span>
                      <span className="sidebar-row-val">{value}</span>
                    </div>
                  ))}
                  <div className="sidebar-row">
                    <span className="sidebar-row-label">Category</span>
                    <span className="tag" style={{ color: ts.text, background: ts.bg, border: `1px solid ${ts.border}`, fontSize: '8px', padding: '2px 6px' }}>
                      {post.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="sidebar-block">
                <div className="sidebar-label">Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span className="tag" style={{ color: ts.text, background: ts.bg, border: `1px solid ${ts.border}` }}>
                    {post.tag}
                  </span>
                  <span className="tag" style={{ color: 'var(--lime)', background: 'var(--lime-dim)', border: '1px solid var(--lime-border)' }}>
                    AEO
                  </span>
                  <span className="tag" style={{ color: 'rgba(220,232,255,.68)', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(220,235,255,.18)' }}>
                    2025
                  </span>
                </div>
              </div>

              {/* Share */}
              <div className="sidebar-block">
                <div className="sidebar-label">Share</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <button className="share-btn">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </button>
                  <button className="share-btn">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Copy link
                  </button>
                </div>
              </div>

              {/* Mini CTA */}
              <div style={{
                background: 'rgba(202,255,69,.05)',
                border: '1px solid var(--lime-border)',
                borderRadius: 10, padding: 16,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--lime)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 7 }}>
                  Free tool
                </div>
                <div style={{ fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 600, fontSize: '13px', marginBottom: 6, lineHeight: 1.3, color: 'var(--text)' }}>
                  Check your AEO score
                </div>
                <p style={{ fontSize: '11px', color: 'var(--prose)', lineHeight: 1.65, marginBottom: 12 }}>
                  See how visible your brand is across 5 LLMs — free scan, 30 seconds.
                </p>
                <Link href="/ai-visibility-tool" style={{
                  display: 'block', textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                  letterSpacing: '.08em', textTransform: 'uppercase',
                  padding: '9px', borderRadius: 6,
                  background: 'var(--lime)', color: '#03060c', fontWeight: 500,
                }}>
                  Scan my site →
                </Link>
              </div>

            </aside>
          </div>
        </div>

        {/* ── More from the blog ── */}
        {related.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--line)',
            marginTop: 56, paddingTop: 44, paddingBottom: 60,
          }}>
            <div className="article-outer">

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div className="section-label" style={{ marginBottom: 0, flex: 1 }}>
                  More from the blog
                </div>
                <Link href="/blog" style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                  letterSpacing: '.07em', textTransform: 'uppercase',
                  color: 'var(--muted2)', border: '1px solid var(--line)',
                  borderRadius: 100, padding: '6px 14px', marginLeft: 16,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  View all →
                </Link>
              </div>

              {/* 4-col grid */}
              <div className="more-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
                {related.map(p => {
                  const rs = tagStyle(p.tag)
                  const pBarColor = READ_BAR_COLOR[p.tag] ?? '#caff45'
                  return (
                    <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', minWidth: 0 }}>
                      <div className="more-card">
                        <div style={{
                          height: 88,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '34px',
                          background: p.bg,
                          borderBottom: '1px solid var(--line)',
                          flexShrink: 0,
                        }}>
                          {p.emoji}
                        </div>
                        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 7 }}>
                            <span className="tag" style={{ color: rs.text, background: rs.bg, border: `1px solid ${rs.border}`, fontSize: '9px', padding: '2px 6px' }}>
                              {p.tag}
                            </span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--meta)' }}>
                              {p.read}
                            </span>
                          </div>
                          <h3 className="mc-title" style={{
                            fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 600,
                            fontSize: '14px', lineHeight: 1.3,
                            color: 'var(--text)', marginBottom: 6,
                          }}>
                            {p.title}
                          </h3>
                          <div className="rbar">
                            <div className="rbar-fill" style={{ width: `${readPercent(p.read)}%`, background: pBarColor }} />
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--prose)', lineHeight: 1.65, flex: 1, marginBottom: 10 }}>
                            {p.excerpt}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg, var(--violet), var(--lime))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', fontWeight: 500, color: '#fff',
                            }}>
                              {p.authorInitials}
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--meta)' }}>
                              {p.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Newsletter strip */}
              <div className="nl-strip">
                <div>
                  <div style={{ fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, color: 'var(--text)' }}>
                    Get AEO updates weekly.
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Citation shifts, algorithm changes, and what's actually working.
                  </p>
                </div>
                <div className="nl-form-row" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <input type="email" placeholder="your@email.com" className="nl-input" />
                  <button className="nl-btn">Subscribe</button>
                </div>
              </div>

            </div>
          </div>
        )}

        <SharedFooter />
      </div>
    </>
  )
}