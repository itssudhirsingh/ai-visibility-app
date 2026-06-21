'use client'
import { usePathname } from 'next/navigation'

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'Cluster Map',           href: '/topic-cluster-generator' },
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

export default function SubNavClient() {
  const path = usePathname()

  return (
    <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'.6rem 3.5rem',display:'flex',gap:0,overflowX:'auto',marginTop:'65px'}}>
      {SUB_NAV.map(n=>(
        <a key={n.href} href={n.href} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.55rem 1rem',background:'none',border:'none',borderBottom:path===n.href?'2px solid #c8f247':'2px solid transparent',color:path===n.href?'#c8f247':'rgba(255,255,255,0.75)',whiteSpace:'nowrap',transition:'all .2s',textDecoration:'none',display:'inline-block'}}>
          {n.label}
        </a>
      ))}
    </div>
  )
}