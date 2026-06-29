// lib/schema.ts — central JSON-LD schema builders for NotionCue
// One source of truth. Every page imports a builder from here.

export const SITE = {
  name: 'Notion Cue',
  legalName: 'Notion Cue',
  url: 'https://notioncue.com',
  // NOTE: add the actual file at /public/logo.png (512x512 recommended).
  logo: 'https://notioncue.com/logo.png',
  email: 'hello@notioncue.com',
  founder: 'Sudhir Singh',
  sameAs: [
    'https://twitter.com/notioncue',
    'https://linkedin.com/in/sudhir-ks',
  ],
  description:
    'Track how often your website gets cited by ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Get your AEO score in 30 seconds.',
}

// Stable @id anchors so nodes can reference each other (helps AI/Google
// build one connected graph instead of isolated blobs).
const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

/* ────────────────────────────────────────────────────────────
   GLOBAL — emitted once from app/layout.tsx (covers every page)
   ──────────────────────────────────────────────────────────── */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE.logo,
    },
    description: SITE.description,
    email: SITE.email,
    founder: {
      '@type': 'Person',
      name: SITE.founder,
    },
    sameAs: SITE.sameAs,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/ai-visibility-tool?url={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/* ────────────────────────────────────────────────────────────
   BREADCRUMBS — every non-home page
   crumbs: [{ name, path }]  e.g. [{name:'BLUF Builder', path:'/bluf-builder'}]
   "Home" is prepended automatically.
   ──────────────────────────────────────────────────────────── */

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  const items = [{ name: 'Home', path: '/' }, ...crumbs]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path === '/' ? '' : c.path}`,
    })),
  }
}

/* ────────────────────────────────────────────────────────────
   TOOL PAGES — free web apps
   Uses SoftwareApplication (Google's supported type) with the
   WebApplication subtype + offers $0 so it reads as a free tool.
   ──────────────────────────────────────────────────────────── */

export function softwareAppSchema(opts: {
  name: string
  description: string
  path: string
  category?: string // e.g. 'SEO', 'BusinessApplication'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    applicationCategory: opts.category || 'BusinessApplication',
    applicationSubCategory: 'SEO / AEO Tool',
    operatingSystem: 'Web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': ORG_ID },
    isAccessibleForFree: true,
  }
}

/* ────────────────────────────────────────────────────────────
   ARTICLE / GUIDE pages
   ──────────────────────────────────────────────────────────── */

export function articleSchema(opts: {
  headline: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
  author?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}${opts.path}` },
    author: { '@type': 'Person', name: opts.author || SITE.founder },
    publisher: { '@id': ORG_ID },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.image ? { image: opts.image } : {}),
  }
}

/* ────────────────────────────────────────────────────────────
   COLLECTION / INDEX pages (blog list, resources, tag pages)
   items: [{ name, path }]
   ──────────────────────────────────────────────────────────── */

export function collectionSchema(opts: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: `${SITE.url}${it.path}`,
      })),
    },
  }
}

/* ────────────────────────────────────────────────────────────
   GENERIC info pages + typed variants (about / contact / legal)
   ──────────────────────────────────────────────────────────── */

export function webPageSchema(opts: {
  name: string
  description: string
  path: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.type || 'WebPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
  }
}

/* ────────────────────────────────────────────────────────────
   FAQ — reuse your existing FAQ arrays
   faqs: [{ q, a }]
   ──────────────────────────────────────────────────────────── */

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}