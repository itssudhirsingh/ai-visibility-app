// components/SharedFooter.tsx
// SSR Server Component — no 'use client' needed

import Link from 'next/link'
import Logo from '@/components/logo'

// ─── All tools ─────────────────────────────────────────────────────────────────
const TOOLS = [
  { label: 'AI Visibility Tool',         href: '/dashboard',                    icon: '📊', badge: 'Free',  free: false },
  { label: 'AI Topical Cluster Map',     href: '/topic-cluster-generator',      icon: '🎯', badge: 'Free',  free: false },
  { label: 'llms.txt Generator',         href: '/llms-text-generator',          icon: '📄', badge: 'FREE',  free: true  },
  { label: 'Robots.txt Generator',       href: '/robots-txt',                   icon: '🤖', badge: 'FREE',  free: true  },
  { label: 'AI BLUF Templates',          href: '/bluf-templates',               icon: '⚡', badge: 'FREE',  free: true  },
  { label: 'AI BLUF Generator',          href: '/bluff-builder',                icon: '⚡', badge: 'FREE',  free: true  },
  { label: 'AI E-E-A-T Checker',         href: '/ai-eeat-checker',              icon: '🏅', badge: 'FREE',  free: true  },
  { label: 'AI Page Speed Analyser',     href: '/ai-page-speed-analysis-tools', icon: '🚀', badge: 'FREE',  free: true  },
  { label: 'AI Readability Checker',     href: '/ai-readability-checker',       icon: '📖', badge: 'FREE',  free: true  },
  { label: 'AI Schema Markup Generator', href: '/ai-schema-markup-generator',   icon: '🧩', badge: 'FREE',  free: true  },
]

const RESOURCES = [
  { label: 'AEO Guide',  href: '/aeo-guide'  },
  { label: 'Blog',       href: '/blog'        },
  { label: 'Changelog',  href: '/changelog'   },
  { label: 'About',      href: '/about'       },
  { label: 'Contact',    href: '/contact'     },
]

const LEGAL = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms'   },
]

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
      borderTop:  '1px solid rgba(220,235,255,.07)',
      background: 'linear-gradient(180deg,#030710 0%,#020509 100%)',
      marginTop:  'auto',
    }}>

      {/* ── Tools band ─────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(220,235,255,.07)',
        padding:      '3rem 0',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>

          {/* Section label */}
          <div style={{
            display:       'flex',
            alignItems:    'center',
            gap:           12,
            marginBottom:  '1.75rem',
          }}>
            <div style={{
              fontFamily:    "'JetBrains Mono',monospace",
              fontSize:      9,
              color:         'rgba(202,255,69,.6)',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
            }}>
              All Tools
            </div>
            <div style={{ flex:1, height:1, background:'rgba(220,235,255,.06)' }} />
            <div style={{
              fontFamily:    "'JetBrains Mono',monospace",
              fontSize:      9,
              color:         'rgba(220,233,255,.25)',
              letterSpacing: '.08em',
            }}>
              {TOOLS.length} tools available
            </div>
          </div>

          {/* Tools grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap:                 6,
          }}>
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="sf-tool-card"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            9,
                  padding:        '10px 12px',
                  borderRadius:   8,
                  border:         '1px solid rgba(220,235,255,.07)',
                  background:     'rgba(255,255,255,.02)',
                  textDecoration: 'none',
                  transition:     'border-color .2s, background .2s',
                }}
              >
                <span style={{
                  fontSize:    15,
                  width:       26,
                  height:      26,
                  display:     'grid',
                  placeItems:  'center',
                  flexShrink:  0,
                  background:  'rgba(255,255,255,.03)',
                  borderRadius:5,
                  border:      '1px solid rgba(220,235,255,.07)',
                }}>
                  {tool.icon}
                </span>
                <div style={{ minWidth:0 }}>
                  <div style={{
                    fontFamily:   "'Familjen Grotesk',sans-serif",
                    fontWeight:   600,
                    fontSize:     11,
                    color:        '#dce9ff',
                    lineHeight:   1.3,
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {tool.label}
                  </div>
                  <span style={{
                    fontFamily:  "'JetBrains Mono',monospace",
                    fontSize:    7,
                    padding:     '1px 5px',
                    borderRadius:3,
                    marginTop:   3,
                    display:     'inline-block',
                    background:  tool.free ? 'rgba(82,227,142,.08)'  : 'rgba(146,124,255,.08)',
                    border:      tool.free ? '1px solid rgba(82,227,142,.2)' : '1px solid rgba(146,124,255,.2)',
                    color:       tool.free ? '#52e38e' : '#927cff',
                  }}>
                    {tool.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer body ────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'3rem 2rem 2rem' }}>

        {/* Top row */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap:                 '3rem',
          marginBottom:        '3rem',
          alignItems:          'start',
        }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:14 }}>
              <Logo size="lg" variant="full" href="/" />
            </Link>

            <p style={{
              fontSize:   11,
              color:      'rgba(220,233,255,.4)',
              lineHeight: 1.8,
              maxWidth:   300,
              fontFamily: "'JetBrains Mono',monospace",
              margin:     '0 0 20px',
            }}>
              Track, optimise, and grow your brand presence across AI search engines.
              Built for SEO and AEO professionals.
            </p>

            {/* Engine pills */}
            <div style={{ marginBottom:8 }}>
              <div style={{
                fontFamily:    "'JetBrains Mono',monospace",
                fontSize:      8,
                color:         'rgba(220,233,255,.3)',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom:  8,
              }}>
                Tracks visibility in
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {AI_ENGINES.map(e => (
                  <span key={e.name} style={{
                    fontFamily:  "'JetBrains Mono',monospace",
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

          {/* Resources */}
          <div>
            <div style={{
              fontFamily:    "'JetBrains Mono',monospace",
              fontSize:      9,
              color:         'rgba(220,233,255,.3)',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              marginBottom:  16,
              paddingBottom: 10,
              borderBottom:  '1px solid rgba(220,235,255,.06)',
            }}>
              Resources
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {RESOURCES.map(link => (
                <Link key={link.href} href={link.href} className="sf-link"
                  style={{
                    fontFamily:    "'JetBrains Mono',monospace",
                    fontSize:      11,
                    color:         'rgba(220,233,255,.5)',
                    textDecoration:'none',
                    transition:    'color .2s',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           7,
                  }}>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(202,255,69,.4)', flexShrink:0 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal + CTA */}
          <div>
            <div style={{
              fontFamily:    "'JetBrains Mono',monospace",
              fontSize:      9,
              color:         'rgba(220,233,255,.3)',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              marginBottom:  16,
              paddingBottom: 10,
              borderBottom:  '1px solid rgba(220,235,255,.06)',
            }}>
              Legal
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:28 }}>
              {LEGAL.map(link => (
                <Link key={link.href} href={link.href} className="sf-link"
                  style={{
                    fontFamily:    "'JetBrains Mono',monospace",
                    fontSize:      11,
                    color:         'rgba(220,233,255,.5)',
                    textDecoration:'none',
                    transition:    'color .2s',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           7,
                  }}>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(220,233,255,.2)', flexShrink:0 }} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA block */}
            <div style={{
              padding:      '16px',
              borderRadius: 10,
              border:       '1px solid rgba(202,255,69,.15)',
              background:   'rgba(202,255,69,.04)',
            }}>
              <div style={{
                fontFamily:   "'Familjen Grotesk',sans-serif",
                fontWeight:   700,
                fontSize:     13,
                color:        '#f5f8ff',
                marginBottom: 5,
              }}>
                Start for free
              </div>
              <div style={{
                fontFamily:   "'JetBrains Mono',monospace",
                fontSize:     9,
                color:        'rgba(220,233,255,.4)',
                marginBottom: 14,
                lineHeight:   1.7,
              }}>
                Analyse your AI visibility in under 60 seconds.
              </div>
              <Link href="/dashboard" className="sf-cta"
                style={{
                  display:       'inline-block',
                  fontFamily:    "'Familjen Grotesk',sans-serif",
                  fontWeight:    700,
                  fontSize:      11,
                  color:         '#07100b',
                  background:    '#caff45',
                  padding:       '8px 16px',
                  borderRadius:  100,
                  textDecoration:'none',
                  whiteSpace:    'nowrap',
                  boxShadow:     '0 0 18px rgba(202,255,69,.16)',
                  transition:    'box-shadow .2s',
                }}>
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(220,235,255,.07)', marginBottom:'1.5rem' }} />

        {/* Bottom bar */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            12,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize:   9,
            color:      'rgba(220,233,255,.25)',
          }}>
            © {YEAR} NotionCue. Built for AI-era SEO professionals.
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms',   href: '/terms'   },
              { label: 'Contact', href: '/contact'  },
            ].map(l => (
              <Link key={l.href} href={l.href} className="sf-legal-link"
                style={{
                  fontFamily:    "'JetBrains Mono',monospace",
                  fontSize:      9,
                  color:         'rgba(220,233,255,.28)',
                  textDecoration:'none',
                  transition:    'color .2s',
                }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hover & responsive styles */}
      <style>{`
        .sf-link:hover       { color: #f5f8ff !important }
        .sf-legal-link:hover { color: rgba(220,233,255,.65) !important }
        .sf-cta:hover        { box-shadow: 0 0 28px rgba(202,255,69,.35) !important }
        .sf-tool-card:hover  {
          border-color: rgba(202,255,69,.18) !important;
          background:   rgba(202,255,69,.03) !important;
        }
        .sf-tool-card:hover > span {
          border-color: rgba(202,255,69,.15) !important;
        }

        @media (max-width: 1024px) {
          .sf-tools-grid { grid-template-columns: repeat(3,1fr) !important }
        }
        @media (max-width: 768px) {
          .sf-tools-grid   { grid-template-columns: repeat(2,1fr) !important }
          .sf-main-grid    { grid-template-columns: 1fr !important }
        }
        @media (max-width: 480px) {
          .sf-tools-grid { grid-template-columns: 1fr !important }
        }
      `}</style>
    </footer>
  )
}