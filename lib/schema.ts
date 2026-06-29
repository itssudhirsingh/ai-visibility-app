/**
 * lib/schema.ts — Advanced JSON-LD schema system for NotionCue
 *
 * Every builder uses @id anchors so Google + AI engines build a single
 * connected entity graph rather than isolated blobs. Every field that
 * schema.org supports and that we have real data for is included.
 *
 * ⚠️  ACTION REQUIRED: add /public/logo.png (512×512 px, square)
 *     and /public/og-image.png (1200×630 px) before deploying.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONSTANTS — single source of truth
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name:        'Notion Cue',
  legalName:   'Notion Cue',
  alternateName: ['NotionCue', 'Notion Cue AEO'],
  url:         'https://notioncue.com',
  logo:        'https://notioncue.com/logo.png',       // ⚠️ add /public/logo.png
  ogImage:     'https://notioncue.com/og-image.png',   // ⚠️ add /public/og-image.png
  email:       'hello@notioncue.com',
  privacyEmail:'privacy@notioncue.com',
  foundingDate:'2026-02',
  founder:     'Sudhir Singh',
  description: 'Track how often your website gets cited by ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Get your AEO score in 30 seconds.',
  keywords:    ['AEO', 'Answer Engine Optimisation', 'AI visibility', 'AI SEO', 'ChatGPT citations', 'llms.txt'],
  sameAs: [
    'https://twitter.com/notioncue',
    'https://www.linkedin.com/company/notioncue',
    'https://www.crunchbase.com/organization/notioncue',
  ],
  founderSameAs: [
    'https://linkedin.com/in/sudhir-ks',
    'https://twitter.com/webmastersudhir',
  ],
  inLanguage:  'en',
  areaServed:  'Worldwide',
}

// Stable @id anchors — referenced across all schemas so engines merge them
export const IDs = {
  org:         `${SITE.url}/#organization`,
  website:     `${SITE.url}/#website`,
  founder:     `${SITE.url}/#founder`,
  logo:        `${SITE.url}/#logo`,
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SUB-OBJECTS (reused across multiple schemas)
// ─────────────────────────────────────────────────────────────────────────────

const logoObject = {
  '@type':        'ImageObject',
  '@id':          IDs.logo,
  url:            SITE.logo,
  contentUrl:     SITE.logo,
  width:          512,
  height:         512,
  caption:        SITE.name,
}

const founderObject = {
  '@type':    'Person',
  '@id':      IDs.founder,
  name:       SITE.founder,
  url:        `${SITE.url}/about`,
  sameAs:     SITE.founderSameAs,
}

const publisherRef  = { '@id': IDs.org }
const websiteRef    = { '@id': IDs.website }

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL — emitted once in app/layout.tsx, covers every page
// ─────────────────────────────────────────────────────────────────────────────

/** Full Organization node with every available real field */
export function organizationSchema() {
  return {
    '@context':      'https://schema.org',
    '@type':         'Organization',
    '@id':           IDs.org,
    name:            SITE.name,
    legalName:       SITE.legalName,
    alternateName:   SITE.alternateName,
    url:             SITE.url,
    logo:            logoObject,
    image:           logoObject,
    description:     SITE.description,
    email:           SITE.email,
    foundingDate:    SITE.foundingDate,
    areaServed:      SITE.areaServed,
    inLanguage:      SITE.inLanguage,
    keywords:        SITE.keywords.join(', '),
    founder:         founderObject,
    employee:        founderObject,     // founder is the known employee
    sameAs:          SITE.sameAs,
    contactPoint: {
      '@type':           'ContactPoint',
      email:             SITE.email,
      contactType:       'customer support',
      availableLanguage: 'English',
      areaServed:        SITE.areaServed,
    },
    address: {
      '@type':           'PostalAddress',
      addressCountry:    'IN',          // India — where Sudhir is based
    },
    knowsAbout: [
      'Answer Engine Optimisation',
      'AI search visibility',
      'Large language model citations',
      'BLUF content structure',
      'llms.txt standard',
      'E-E-A-T signals',
      'Structured data / JSON-LD',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:    'Free AEO Tools',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Visibility Scanner', url: `${SITE.url}/ai-visibility-tool` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'BLUF Builder',          url: `${SITE.url}/bluf-builder` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'llms.txt Generator',    url: `${SITE.url}/llms-text-generator` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Schema Markup Generator', url: `${SITE.url}/ai-schema-markup-generator` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-E-A-T Audit Tool',   url: `${SITE.url}/ai-eeat-checker` } },
      ],
    },
  }
}

/** WebSite node with Sitelinks Searchbox SearchAction */
export function websiteSchema() {
  return {
    '@context':  'https://schema.org',
    '@type':     'WebSite',
    '@id':       IDs.website,
    name:        SITE.name,
    alternateName: SITE.alternateName,
    url:         SITE.url,
    description: SITE.description,
    inLanguage:  SITE.inLanguage,
    publisher:   publisherRef,
    potentialAction: [
      {
        // Sitelinks Searchbox
        '@type':      'SearchAction',
        target: {
          '@type':      'EntryPoint',
          urlTemplate:  `${SITE.url}/ai-visibility-tool?url={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
    copyrightYear:    2026,
    copyrightHolder:  publisherRef,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMBS — every non-home page
// crumbs: [{ name, path }] — Home is prepended automatically
// ─────────────────────────────────────────────────────────────────────────────

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs]
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    '@id':      `${SITE.url}${crumbs[crumbs.length - 1]?.path ?? '/'}#breadcrumb`,
    name:       `${crumbs.map(c => c.name).join(' › ')} — Breadcrumb`,
    itemListElement: all.map((c, i) => ({
      '@type':  'ListItem',
      position: i + 1,
      name:     c.name,
      item: {
        '@type': 'WebPage',
        '@id':   `${SITE.url}${c.path === '/' ? '' : c.path}`,
        url:     `${SITE.url}${c.path === '/' ? '' : c.path}`,
        name:    c.name,
      },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL PAGES — SoftwareApplication (Google's rich result type)
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolSchemaOpts {
  name:         string
  description:  string
  path:         string
  /** Shown in rich results e.g. 'Analyse any domain for AI visibility' */
  abstract?:    string
  /** Additional feature list */
  featureList?: string[]
  screenshot?:  string   // URL to a screenshot — add later when assets exist
}

export function softwareAppSchema(opts: ToolSchemaOpts) {
  const url = `${SITE.url}${opts.path}`
  return {
    '@context':               'https://schema.org',
    '@type':                  ['SoftwareApplication', 'WebApplication'],
    '@id':                    `${url}#software`,
    name:                     opts.name,
    description:              opts.description,
    abstract:                 opts.abstract ?? opts.description,
    url,
    applicationCategory:      'BusinessApplication',
    applicationSubCategory:   'SEO / AEO Tool',
    operatingSystem:          'Any — runs in a web browser',
    browserRequirements:      'Requires JavaScript',
    inLanguage:               SITE.inLanguage,
    isAccessibleForFree:      true,
    offers: {
      '@type':          'Offer',
      '@id':            `${url}#offer`,
      price:            '0',
      priceCurrency:    'USD',
      availability:     'https://schema.org/InStock',
      priceValidUntil:  '2027-12-31',
    },
    publisher:    publisherRef,
    author:       publisherRef,
    provider:     publisherRef,
    isPartOf:     websiteRef,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   url,
    },
    ...(opts.featureList   ? { featureList:  opts.featureList.join(', ') } : {}),
    ...(opts.screenshot    ? { screenshot:   opts.screenshot }              : {}),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POST / ARTICLE
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPostSchemaOpts {
  slug:           string
  title:          string
  excerpt:        string
  date:           string   // display date e.g. "Jun 8, 2026"
  author:         string
  authorRole?:    string
  tag?:           string
  read?:          string   // e.g. "8 min read"
  image?:         string
}

/** Convert "Jun 8, 2026" → "2026-06-08" (ISO 8601) */
function toISO(displayDate: string): string {
  try {
    const d = new Date(displayDate)
    if (isNaN(d.getTime())) return displayDate
    return d.toISOString().split('T')[0]
  } catch {
    return displayDate
  }
}

export function blogPostSchema(post: BlogPostSchemaOpts) {
  const url     = `${SITE.url}/blog/${post.slug}`
  const isoDate = toISO(post.date)

  return {
    '@context':     'https://schema.org',
    '@type':        'BlogPosting',
    '@id':          `${url}#article`,
    headline:       post.title,
    description:    post.excerpt,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   url,
    },
    datePublished:  isoDate,
    dateModified:   isoDate,
    inLanguage:     SITE.inLanguage,
    author: {
      '@type':    'Person',
      name:       post.author,
      ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
      // Link to the org for authors who work for Notion Cue
      ...(post.authorRole?.toLowerCase().includes('notioncue') || post.authorRole?.toLowerCase().includes('notion cue')
        ? { worksFor: publisherRef }
        : {}),
    },
    publisher:      publisherRef,
    isPartOf: {
      '@type': 'Blog',
      '@id':   `${SITE.url}/blog#blog`,
      name:    'Notion Cue Blog',
      url:     `${SITE.url}/blog`,
      publisher: publisherRef,
    },
    ...(post.image    ? { image: { '@type': 'ImageObject', url: post.image, contentUrl: post.image } } : { image: logoObject }),
    ...(post.tag      ? { articleSection: post.tag } : {}),
    ...(post.read     ? { timeRequired:   `PT${post.read.match(/\d+/)?.[0] ?? '5'}M` } : {}),
    keywords:       (post.tag ? [post.tag, ...SITE.keywords] : SITE.keywords).join(', '),
    wordCount:      undefined,  // omit — we don't have this
    copyrightHolder: publisherRef,
    copyrightYear:   new Date(isoDate).getFullYear() || 2026,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE (guide / long-form, not a blog post)
// ─────────────────────────────────────────────────────────────────────────────

export interface ArticleSchemaOpts {
  headline:       string
  description:    string
  path:           string
  datePublished?: string
  dateModified?:  string
  author?:        string
  image?:         string
  keywords?:      string[]
  articleSection?:string
  wordCount?:     number
}

export function articleSchema(opts: ArticleSchemaOpts) {
  const url = `${SITE.url}${opts.path}`
  return {
    '@context':     'https://schema.org',
    '@type':        'Article',
    '@id':          `${url}#article`,
    headline:       opts.headline,
    description:    opts.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage:     SITE.inLanguage,
    author: opts.author
      ? { '@type': 'Person', name: opts.author, worksFor: publisherRef }
      : founderObject,
    publisher:      publisherRef,
    image:          opts.image
      ? { '@type': 'ImageObject', url: opts.image, contentUrl: opts.image }
      : logoObject,
    ...(opts.datePublished  ? { datePublished:   toISO(opts.datePublished) }  : {}),
    ...(opts.dateModified   ? { dateModified:    toISO(opts.dateModified) }   : {}),
    ...(opts.articleSection ? { articleSection:  opts.articleSection }         : {}),
    ...(opts.wordCount      ? { wordCount:       opts.wordCount }              : {}),
    keywords: (opts.keywords ?? SITE.keywords).join(', '),
    isPartOf: websiteRef,
    copyrightHolder: publisherRef,
    copyrightYear:   2026,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION / INDEX pages (blog list, tag pages, resource index)
// ─────────────────────────────────────────────────────────────────────────────

export function collectionSchema(opts: {
  name:         string
  description:  string
  path:         string
  items:        { name: string; path: string }[]
  about?:       string   // e.g. 'Answer Engine Optimisation'
}) {
  const url = `${SITE.url}${opts.path}`
  return {
    '@context':     'https://schema.org',
    '@type':        'CollectionPage',
    '@id':          `${url}#collection`,
    name:           opts.name,
    description:    opts.description,
    url,
    inLanguage:     SITE.inLanguage,
    isPartOf:       websiteRef,
    publisher:      publisherRef,
    ...(opts.about ? { about: { '@type': 'Thing', name: opts.about } } : {}),
    mainEntity: {
      '@type': 'ItemList',
      '@id':   `${url}#list`,
      name:    opts.name,
      numberOfItems: opts.items.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: opts.items.map((it, i) => ({
        '@type':   'ListItem',
        position:  i + 1,
        name:      it.name,
        url:       `${SITE.url}${it.path}`,
        item: {
          '@type': 'WebPage',
          url:     `${SITE.url}${it.path}`,
          name:    it.name,
        },
      })),
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ — reuses the existing { q, a } arrays already on every tool page
// ─────────────────────────────────────────────────────────────────────────────

export function faqSchema(faqs: { q: string; a: string }[], pageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    '@id':      pageUrl ? `${pageUrl}#faq` : undefined,
    ...(pageUrl ? { url: pageUrl, isPartOf: websiteRef } : {}),
    mainEntity: faqs.map((f, i) => ({
      '@type':  'Question',
      '@id':    pageUrl ? `${pageUrl}#faq-q${i + 1}` : undefined,
      position: i + 1,
      name:     f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    f.a,
      },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC WEB PAGE (about, contact, legal, resources)
// ─────────────────────────────────────────────────────────────────────────────

export function webPageSchema(opts: {
  name:         string
  description:  string
  path:         string
  type?:        'WebPage' | 'AboutPage' | 'ContactPage'
  dateModified?: string
  keywords?:    string[]
}) {
  const url = `${SITE.url}${opts.path}`
  return {
    '@context':     'https://schema.org',
    '@type':        opts.type ?? 'WebPage',
    '@id':          `${url}#webpage`,
    name:           opts.name,
    description:    opts.description,
    url,
    inLanguage:     SITE.inLanguage,
    isPartOf:       websiteRef,
    publisher:      publisherRef,
    author:         publisherRef,
    ...(opts.dateModified ? { dateModified: toISO(opts.dateModified) } : {}),
    keywords: (opts.keywords ?? SITE.keywords).join(', '),
    breadcrumb: undefined,   // breadcrumb added separately via breadcrumbSchema
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW-TO — for guide-style tool pages (optional, add when relevant)
// ─────────────────────────────────────────────────────────────────────────────

export function howToSchema(opts: {
  name:         string
  description:  string
  path:         string
  steps:        { name: string; text: string }[]
  totalTime?:   string   // ISO 8601 duration e.g. 'PT2M'
}) {
  const url = `${SITE.url}${opts.path}`
  return {
    '@context':   'https://schema.org',
    '@type':      'HowTo',
    '@id':        `${url}#howto`,
    name:         opts.name,
    description:  opts.description,
    url,
    inLanguage:   SITE.inLanguage,
    publisher:    publisherRef,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({
      '@type':  'HowToStep',
      position: i + 1,
      name:     s.name,
      text:     s.text,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE: bundle multiple schemas for one <JsonLd> call
// ─────────────────────────────────────────────────────────────────────────────

export function toolPageSchema(
  tool:  ToolSchemaOpts,
  faqs:  { q: string; a: string }[],
  crumbs:{ name: string; path: string }[],
) {
  const url = `${SITE.url}${tool.path}`
  return [
    softwareAppSchema(tool),
    faqSchema(faqs, url),
    breadcrumbSchema(crumbs),
  ]
}