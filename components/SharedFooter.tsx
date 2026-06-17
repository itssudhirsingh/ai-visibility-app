// components/SharedFooter.tsx
// SSR Server Component — no 'use client' needed

import Link from 'next/link'
import Logo from '@/components/logo'

// ─── Site map data ─────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    heading: 'Free Tools',
    links: [
      { label: 'llms.txt Generator',   href: '/llms-txt-generator',      badge: 'FREE' },
      { label: 'BLUF Templates',       href: '/bluf-templates', badge: 'FREE' },
      { label: 'AEO Guide',            href: '/aeo-guide',                badge: 'FREE'   },
      { label: 'Robots.txt Generator',   href: '/robots-txt-generator',                badge: 'FREE'   },
    ],
  },
  {
    heading: 'Pro Features',
    links: [
      { label: 'AI Visibility Dashboard', href: '/dashboard',          badge: 'Free' },
      { label: 'Prompt Tracker',          href: '/dashboard',  badge: 'Free' },
      { label: 'Brand Monitor',           href: '/dashboard',    badge: 'Free' },
      { label: 'Competitor Analysis',     href: '/dashboard',  badge: 'Free' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog',       href: '/blog',      badge: null },
      { label: 'Changelog',  href: '/changelog', badge: null },
      { label: 'About',      href: '/about',     badge: null },
      { label: 'Contact',    href: '/contact',   badge: null },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '/privacy', badge: null },
      { label: 'Terms of Service',  href: '/terms',   badge: null },
    ],
  },
]

// AI engines listed at the bottom
const AI_ENGINES = [
  { name: 'ChatGPT',    color: '#52e38e' },
  { name: 'Perplexity', color: '#45e4ff' },
  { name: 'Claude',     color: '#927cff' },
  { name: 'Gemini',     color: '#ffc45c' },
  { name: 'Grok',       color: '#caff45' },
  { name: 'AI Mode',    color: '#ff7cb7' },
]

const YEAR = new Date().getFullYear()

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SharedFooter() {
  return (
    <footer style={{
      borderTop:   '1px solid rgba(220,235,255,.08)',
      background:  'linear-gradient(180deg, #03060c 0%, #04080f 100%)',
      padding:     '4rem 0 2rem',
      marginTop:   'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Top row: brand + engine coverage */}
        <div style={{
          display:         'grid',
          gridTemplateColumns: '1fr auto',
          gap:             '2rem',
          marginBottom:    '3rem',
          alignItems:      'start',
        }}>
          {/* Brand block */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
      
              <div>
                <div style={{
                  fontFamily: "'Familjen Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize:   16,
                  color:      '#f5f8ff',
                }}>
                  <Logo size="lg" variant="full" href="/" />

                </div>
              </div>
            </Link>

            <p style={{
              fontSize:   11,
              color:      'rgba(220,233,255,.45)',
              lineHeight: 1.75,
              maxWidth:   320,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Track, optimise, and grow your brand presence across AI search engines.
              Built for SEO and AEO professionals.
            </p>
          </div>

          {/* AI engine coverage pills */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      8,
              color:         'rgba(220,233,255,.35)',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              marginBottom:  10,
            }}>
              Tracks visibility in
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {AI_ENGINES.map(e => (
                <span key={e.name} style={{
                  fontFamily:  "'JetBrains Mono', monospace",
                  fontSize:    9,
                  color:       e.color,
                  border:      `1px solid ${e.color}30`,
                  background:  `${e.color}0a`,
                  padding:     '3px 9px',
                  borderRadius:100,
                  whiteSpace:  'nowrap',
                }}>
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(220,235,255,.07)', marginBottom: '3rem' }} />

        {/* Site map columns */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '2rem',
          marginBottom:        '3rem',
        }}>
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <div style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      9,
                color:         'rgba(220,233,255,.35)',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom:  14,
              }}>
                {col.heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map((link, i) => (
                  /* ✅ FIXED: Corrected single quotes to template literal backticks */
                  <div key={`${link.href}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Link href={link.href}
                      style={{
                        fontFamily:    "'JetBrains Mono', monospace",
                        fontSize:      11,
                        color:         'rgba(220,233,255,.55)',
                        textDecoration:'none',
                        transition:    'color .2s',
                        lineHeight:    1.4,
                      }}
                      className="footer-link"
                    >
                      {link.label}
                    </Link>
                    {link.badge && (
                      <span style={{
                        fontFamily:  "'JetBrains Mono', monospace",
                        fontSize:    7,
                        padding:     '1px 5px',
                        borderRadius:3,
                        background:  link.badge === 'FREE'
                          ? 'rgba(82,227,142,.08)'
                          : 'rgba(146,124,255,.08)',
                        border: link.badge === 'FREE'
                          ? '1px solid rgba(82,227,142,.2)'
                          : '1px solid rgba(146,124,255,.2)',
                        color: link.badge === 'FREE' ? '#52e38e' : '#927cff',
                        flexShrink: 0,
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(220,235,255,.07)', marginBottom: '1.5rem' }} />

        {/* Bottom bar */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          flexWrap:        'wrap',
          gap:             12,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   9,
            color:      'rgba(220,233,255,.28)',
          }}>
            © {YEAR} NotionCue. Built for AI-era SEO professionals.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[
              { label: 'Privacy',  href: '/resources/privacy' },
              { label: 'Terms',    href: '/resources/terms' },
              { label: 'Contact',  href: '/resources/contact' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      9,
                  color:         'rgba(220,233,255,.32)',
                  textDecoration:'none',
                  transition:    'color .2s',
                }}
                className="footer-legal-link"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hover styles */}
      <style>{`
        .footer-link:hover       { color: #f5f8ff !important }
        .footer-legal-link:hover { color: rgba(220,233,255,.65) !important }

        @media(max-width: 768px) {
          footer > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          footer > div > div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
          footer > div > div[style*="text-align: right"] {
            text-align: left !important;
          }
          footer > div > div[style*="justify-content: flex-end"] {
            justify-content: flex-start !important;
          }
        }

        @media(max-width: 480px) {
          footer > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}