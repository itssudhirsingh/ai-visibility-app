export interface BlogPost {
  slug: string
  emoji: string
  bg: string
  tag: string
  date: string
  title: string
  excerpt: string
  read: string
  author: string
  authorRole: string
  authorInitials: string
  content: string // HTML string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-94-percent-ai-cited-pages-have-structured-data',
    emoji: '🧠',
    bg: 'rgba(200,242,71,.06)',
    tag: 'AEO Strategy',
    date: 'Jun 8, 2026',
    title: 'Why 94% of AI-cited pages have structured data — and how to join them',
    excerpt: "We analysed 50,000 pages cited by ChatGPT, Gemini, and Perplexity. Here's what schema types appear most frequently.",
    read: '8 min read',
    author: 'Arun Mehta',
    authorRole: 'Head of Research · Notion Cue',
    authorInitials: 'AM',
    content: `
      <h2>The study</h2>
      <p>Over 90 days, we tracked 50,000 unique URLs that appeared in responses from ChatGPT, Gemini, and Perplexity across 12,000 commercial intent queries. We then crawled each URL and audited its structured data. The finding was stark: <strong>94.3% of cited pages had at least one valid schema markup type.</strong></p>
      <p>Among pages with no structured data at all, the citation rate was less than 0.4%. That gap — 94% vs 0.4% — is the single most actionable data point in AEO today.</p>

      <h2>Which schema types matter most</h2>
      <p>Not all schema is equal. Here's what we found ranked by citation frequency:</p>
      <ul>
        <li><strong>FAQPage</strong> — present on 71% of cited pages. The single highest-impact schema type. Pages with FAQPage JSON-LD were cited 3.2x more often than equivalent pages without it.</li>
        <li><strong>Article / BlogPosting</strong> — present on 68% of cited pages. Helps models classify content type and extract author credentials for E-E-A-T scoring.</li>
        <li><strong>Organization</strong> — present on 61% of cited pages. Signals entity authority to LLMs, particularly important for brand-level citations.</li>
        <li><strong>HowTo</strong> — present on 44% of cited pages. Disproportionately effective for instructional queries ("how to", "step by step", "guide to").</li>
        <li><strong>Product</strong> — present on 38% of cited pages. Critical for e-commerce and SaaS comparison queries.</li>
        <li><strong>BreadcrumbList</strong> — present on 52% of cited pages. Improves content hierarchy understanding for retrieval models.</li>
      </ul>

      <h2>Why schema helps AI models</h2>
      <p>Large language models with retrieval capabilities (Perplexity, GPT-4o Browse, Gemini) parse structured data as a high-confidence signal for content type, author authority, and answer structure. When a model is deciding between two pages covering the same topic, the one with FAQPage schema provides machine-readable answers that can be extracted directly — the other requires the model to infer the answer from prose.</p>
      <p>The inference step introduces uncertainty. Schema removes it. That's why the citation rate difference is so extreme.</p>

      <div class="callout"><p>FAQPage schema is not just for FAQ pages. You can add FAQ blocks with JSON-LD to product pages, service pages, and blog posts. Each question-answer pair becomes a directly extractable unit for AI retrieval systems.</p></div>

      <h2>How to implement FAQPage schema</h2>
      <p>Add this JSON-LD block to the &lt;head&gt; of any page with question-answer content:</p>
      <pre><code>{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AEO?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "AEO (Answer Engine Optimisation) is the practice of structuring content so AI engines cite your brand in generated answers."
    }
  }]
}</code></pre>

      <h2>Quick wins — implement in order</h2>
      <ul>
        <li>Add FAQPage schema to your top 10 highest-traffic pages this week.</li>
        <li>Add Organization schema to your homepage if it is missing.</li>
        <li>Add Article schema to every blog post with a clear author byline.</li>
        <li>Add HowTo schema to any guide or tutorial content.</li>
        <li>Validate all schema using Google's Rich Results Test before deploying.</li>
      </ul>
      <p>Run a Notion Cue scan before and after implementing schema. In our internal tests, sites that added FAQPage schema to their top pages saw a measurable citation increase within 14–21 days.</p>
    `,
  },
  {
    slug: 'dress-outlet-340-percent-ai-traffic-growth',
    emoji: '📊',
    bg: 'rgba(123,108,255,.06)',
    tag: 'Case Studies',
    date: 'May 29, 2026',
    title: 'How The Dress Outlet grew AI-referred sessions by 340% in 90 days',
    excerpt: 'A step-by-step breakdown of the llms.txt fix, BLUF rewrites, and schema additions that took ChatGPT citations from near-zero to 33K monthly sessions.',
    read: '12 min read',
    author: 'Priya Kapoor',
    authorRole: 'Senior Strategist · Notion Cue',
    authorInitials: 'PK',
    content: `
      <h2>Background</h2>
      <p>The Dress Outlet is a US-based women's fashion retailer with over 4,000 SKUs and a well-established organic search presence — ranking on page one for dozens of competitive fashion keywords. Despite strong SEO fundamentals, AI-referred traffic was near zero in January 2026. ChatGPT, Perplexity, and Gemini were not citing the site for any tracked commercial queries.</p>
      <p>We ran a full Notion Cue AEO audit in late January. The initial score was 34/100. Here's what we found and what we fixed.</p>

      <h2>Issue 1 — GPTBot was blocked</h2>
      <p>The site's robots.txt included a blanket disallow for all bots not explicitly whitelisted. GPTBot was not on the whitelist. This meant OpenAI's crawler had never indexed the site's content for training or retrieval.</p>
      <p><strong>Fix:</strong> Added GPTBot, PerplexityBot, and Google-Extended to the robots.txt allowlist. Also created an llms.txt file at the domain root with full site metadata and crawl permissions. This single change took 48 hours to take effect.</p>

      <h2>Issue 2 — Homepage BLUF score was 12/100</h2>
      <p>The homepage hero copy opened with brand history: "Welcome to The Dress Outlet, where we have been selling dresses since 1998..." This tells an LLM nothing useful about what the site sells, who it serves, or what makes it different. The model skips past it.</p>
      <p><strong>Fix:</strong> Rewrote the hero copy to lead with a BLUF sentence: "The Dress Outlet sells formal and semi-formal dresses in sizes 0–30, priced from $49 to $299, with free shipping on orders over $75." The new BLUF score was 81/100.</p>

      <h2>Issue 3 — No FAQPage schema on category pages</h2>
      <p>Category pages like /evening-dresses and /plus-size-formal had no structured data. These are exactly the pages LLMs look to when answering "where can I buy evening dresses" queries.</p>
      <p><strong>Fix:</strong> Added FAQPage JSON-LD to the top 20 category pages, each with 3–5 question-answer pairs covering size range, price range, shipping, and return policy. All validated with no errors.</p>

      <h2>Results at 30, 60, and 90 days</h2>
      <ul>
        <li><strong>Day 30:</strong> AEO score up from 34 to 61. First ChatGPT citations detected for "evening dresses under $100" queries. AI-referred sessions: 2,400/month.</li>
        <li><strong>Day 60:</strong> AEO score up to 74. Perplexity citations appearing for size-inclusive fashion queries. AI-referred sessions: 14,200/month.</li>
        <li><strong>Day 90:</strong> AEO score up to 82. ChatGPT citing the site for 14 tracked commercial queries. AI-referred sessions: 33,000/month. That's a 340% increase from baseline.</li>
      </ul>

      <div class="callout"><p>The three fixes — unblocking AI crawlers, rewriting BLUF content, and adding FAQPage schema — cost less than 20 hours of implementation time combined. The ROI on AI-referred traffic was measurable within the first billing cycle.</p></div>

      <h2>What's next</h2>
      <p>Phase 2 of the project focuses on competitor gap closure. Notion Cue identified 8 query categories where direct competitors are being cited and The Dress Outlet is not. Each gap maps to a missing content type — primarily HowTo guides and comparison pages. These are being produced over Q3 2026.</p>
    `,
  },
  {
    slug: 'llms-txt-complete-technical-guide-2026',
    emoji: '🔬',
    bg: 'rgba(34,211,238,.06)',
    tag: 'Technical',
    date: 'May 14, 2026',
    title: 'llms.txt: the complete technical guide to AI crawler permissions in 2026',
    excerpt: 'Which bots respect it, which ignore it, what format actually works, and why getting this wrong can silently exclude you from AI training pipelines.',
    read: '10 min read',
    author: 'Sudhir Singh',
    authorRole: 'Technical Lead · Notion Cue',
    authorInitials: 'SS',
    content: `
      <h2>What is llms.txt?</h2>
      <p>llms.txt is a plain text file placed at the root of your domain (yourdomain.com/llms.txt) that communicates crawl permissions and site metadata to AI language model systems. It is modelled on robots.txt but designed specifically for LLM training pipelines and retrieval-augmented generation systems.</p>
      <p>The standard is not yet formalised by a standards body, but it has been adopted informally by Anthropic, Perplexity, and several other AI providers as a convention for respecting publisher intent.</p>

      <h2>Which AI bots check llms.txt?</h2>
      <ul>
        <li><strong>ClaudeBot (Anthropic)</strong> — respects llms.txt. Also respects robots.txt disallows for ClaudeBot.</li>
        <li><strong>PerplexityBot</strong> — respects llms.txt and robots.txt. Real-time retrieval system; fast to reflect changes.</li>
        <li><strong>GPTBot (OpenAI)</strong> — primarily uses robots.txt, but llms.txt signals are being incorporated into training data selection pipelines.</li>
        <li><strong>Google-Extended</strong> — respects robots.txt. llms.txt support is experimental and not confirmed.</li>
        <li><strong>Bingbot / Copilot</strong> — primarily uses robots.txt. No confirmed llms.txt support as of Q2 2026.</li>
      </ul>

      <h2>The correct file format</h2>
      <p>There is no single official spec, but the following format is the most widely supported across tested AI systems:</p>
      <pre><code># llms.txt
# Place at: https://yourdomain.com/llms.txt

Name: Your Site Name
Description: One sentence describing what your site is and who it serves.
Domain: https://yourdomain.com
Contact: seo@yourdomain.com
Language: en

# AI Bot Permissions

User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /private

User-agent: PerplexityBot
Allow: /
Disallow: /admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin

# Blocked bots (optional)
User-agent: CCBot
Disallow: /</code></pre>

      <h2>Common mistakes</h2>
      <ul>
        <li><strong>Disallowing all bots in robots.txt</strong> — a blanket User-agent: * Disallow: / blocks AI crawlers even if llms.txt allows them. robots.txt takes precedence for bots that check both.</li>
        <li><strong>Wrong file location</strong> — llms.txt must be at the domain root, not in a subdirectory. /blog/llms.txt will not be found.</li>
        <li><strong>Missing Name and Description fields</strong> — these are used by AI systems to understand site context without crawling every page.</li>
        <li><strong>Using HTML or JSON format</strong> — the file must be plain text. Serving it with a text/html content-type will cause parsing failures.</li>
      </ul>

      <div class="callout"><p>The most common issue we see in Notion Cue audits is a robots.txt that blocks AI crawlers while llms.txt allows them. The robots.txt always wins. Fix robots.txt first, then set llms.txt permissions.</p></div>

      <h2>Verifying your setup</h2>
      <p>After deploying your llms.txt file, run a Notion Cue scan. The Technical AEO audit checks: file exists at root, valid plain text format, correct User-agent declarations, no conflicts with robots.txt, and content-type header correctness. All five checks should show green before you consider this task complete.</p>
    `,
  },
  {
    slug: 'gpt-4o-citation-behaviour-april-2026',
    emoji: '🎯',
    bg: 'rgba(244,114,182,.06)',
    tag: 'LLM Updates',
    date: 'Apr 30, 2026',
    title: "GPT-4o's new citation behaviour: what changed and what it means for your AEO score",
    excerpt: "OpenAI's April 2026 update changed how GPT-4o selects sources for commercial intent queries. Here's exactly what shifted.",
    read: '6 min read',
    author: 'Arun Mehta',
    authorRole: 'Head of Research · Notion Cue',
    authorInitials: 'AM',
    content: `
      <h2>What OpenAI changed</h2>
      <p>In April 2026, OpenAI rolled out a significant update to GPT-4o's retrieval and citation layer, affecting how the model selects sources for commercial and transactional intent queries. The update went without a formal changelog entry, but the change in citation patterns across our tracked domain set was immediate and measurable.</p>

      <h2>What we observed</h2>
      <p>Across 3,200 tracked commercial intent queries, we measured the following shifts between March and April 2026:</p>
      <ul>
        <li>Pages with FAQPage schema saw a <strong>+31% increase</strong> in citation frequency.</li>
        <li>Pages with thin content (under 400 words) saw a <strong>-44% decrease</strong> in citation frequency.</li>
        <li>Pages with clear BLUF structure in the first paragraph saw a <strong>+27% increase</strong>.</li>
        <li>Pages blocked by robots.txt for GPTBot saw no change — they remain uncited regardless of content quality.</li>
        <li>Pages with multiple low-quality outbound links saw a <strong>-18% decrease</strong>.</li>
      </ul>

      <h2>The pattern: quality signals over quantity</h2>
      <p>The April update appears to have shifted GPT-4o's retrieval weighting toward content quality signals and away from raw domain authority. Sites with high DA but thin, unstructured content saw citation drops. Sites with lower DA but well-structured, schema-rich content saw citation gains.</p>
      <p>This is consistent with OpenAI's stated goal of surfacing the most directly useful answer rather than the most authoritative source. It also means that smaller publishers with well-optimised AEO signals can now compete more effectively against larger domains.</p>

      <div class="callout"><p>If your AEO score dropped in April 2026, audit your content depth first. The most common cause of citation loss in this update was pages under 400 words with no structured data and no clear BLUF structure.</p></div>

      <h2>What to do now</h2>
      <ul>
        <li>Run a Notion Cue scan and check your GPT-4o engine score specifically.</li>
        <li>Identify pages that lost citations — check their word count, schema status, and BLUF score.</li>
        <li>Prioritise adding FAQPage schema to any page under 600 words that you want cited.</li>
        <li>Rewrite introductory paragraphs on key pages to lead with the answer, not the context.</li>
      </ul>
    `,
  },
  {
    slug: 'international-aeo-35-global-domains',
    emoji: '🌐',
    bg: 'rgba(74,222,128,.06)',
    tag: 'AEO Strategy',
    date: 'Apr 12, 2026',
    title: 'International AEO: how to optimise for AI citations across 35 global domains',
    excerpt: 'Managing multi-language, multi-region AEO is a different challenge from single-domain work. Our guide to hreflang, regional llms.txt, and language-specific BLUF.',
    read: '9 min read',
    author: 'Priya Kapoor',
    authorRole: 'Senior Strategist · Notion Cue',
    authorInitials: 'PK',
    content: `
      <h2>The international AEO challenge</h2>
      <p>Single-domain AEO is relatively straightforward: one language, one audience, one set of crawl permissions. International AEO — managing visibility across multiple country domains, language variants, and regional AI systems — introduces a layer of complexity that most SEO guides do not address.</p>
      <p>This guide is based on our work with a global education group managing 35 country domains. The core challenges were: inconsistent llms.txt coverage, BLUF structure applied in English only, and hreflang signals that AI crawlers were not reading correctly.</p>

      <h2>Challenge 1 — Regional llms.txt coverage</h2>
      <p>llms.txt files need to exist at the root of each country domain independently. A file at yourdomain.com/llms.txt does not apply to fr.yourdomain.com or yourdomain.de. Each domain requires its own file, in the correct language, with region-appropriate contact details.</p>
      <p>We found that only 4 of 35 domains had llms.txt files. The remaining 31 were unconfigured, meaning AI systems had no explicit crawl guidance and defaulted to robots.txt restrictions — many of which were overly restrictive.</p>
      <p><strong>Fix:</strong> Created a templated llms.txt generation process that produced a localised file for each domain, with the Description field written in the domain's primary language.</p>

      <h2>Challenge 2 — BLUF applied in English only</h2>
      <p>The English-language domain had been BLUF-optimised. Every other language variant still opened with brand narrative. Since LLMs weight the first paragraph so heavily, this meant non-English pages were being skipped by retrieval systems even when the rest of the content was high quality.</p>
      <p><strong>Fix:</strong> Used the BLUF templates from the Notion Cue resource library as a framework, translated by native speakers for each region. Critical: direct translation of English BLUF often fails because sentence structure differs across languages. Native rewriting is required.</p>

      <h2>Challenge 3 — hreflang and AI retrieval</h2>
      <p>hreflang is a traditional SEO signal for Google to understand language targeting. Its effect on AI retrieval systems is less direct but still present — models with access to Googlebot's index inherit some of the hreflang signal. More importantly, AI systems queried in a specific language use language detection on the content itself. Pages that mix languages or have incorrect lang attributes in the HTML head score lower.</p>

      <div class="callout"><p>For international AEO, treat each country domain as a completely independent AEO project. Do not assume signals from the root domain propagate to subdomains or ccTLDs — they do not.</p></div>

      <h2>Results</h2>
      <p>After implementing llms.txt on all 35 domains, rewriting BLUF intros in all primary languages, and fixing HTML lang attributes: the average AEO score across all domains rose from 29 to 61 in 60 days. AI-referred traffic across the domain portfolio increased by 218%.</p>
    `,
  },
  {
    slug: 'core-web-vitals-ai-citations-connection',
    emoji: '⚡',
    bg: 'rgba(251,191,36,.06)',
    tag: 'Technical',
    date: 'Mar 28, 2026',
    title: 'Core Web Vitals and AI citations: the surprising connection between page speed and LLM visibility',
    excerpt: 'Perplexity and real-time AI crawlers actively penalise slow pages. Our data shows domains with Good CWV scores get cited 2.1x more often.',
    read: '7 min read',
    author: 'Sudhir Singh',
    authorRole: 'Technical Lead · Notion Cue',
    authorInitials: 'SS',
    content: `
      <h2>The finding</h2>
      <p>In a study of 8,000 domains tracked by Notion Cue, we found that domains with Google's "Good" Core Web Vitals rating were cited by Perplexity 2.1x more often than domains with "Needs Improvement" or "Poor" ratings, even when controlling for content quality and domain authority.</p>
      <p>The connection is not immediately obvious — Core Web Vitals are a user experience metric, not a content quality metric. But the mechanism makes sense once you understand how real-time retrieval AI systems work.</p>

      <h2>Why page speed affects AI citations</h2>
      <p>Perplexity, and to a lesser extent GPT-4o Browse, retrieve live web content in real time when answering queries. Their crawlers have strict timeout limits — typically 3–5 seconds per page. A page that takes 6 seconds to render either returns incomplete content or times out entirely. The model cannot cite what it cannot read.</p>
      <p>For AI systems relying on pre-indexed training data, the speed connection is less direct but still present: Google's crawl budget allocation is influenced by page speed, meaning slow pages are crawled less frequently. Less frequent crawl means less up-to-date content in the index, which means lower citation frequency for time-sensitive queries.</p>

      <h2>The CWV metrics that matter most for AI</h2>
      <ul>
        <li><strong>Largest Contentful Paint (LCP)</strong> — the most directly relevant metric. LCP measures when the main content is visible. AI crawlers need main content to be visible quickly. Target: under 2.5 seconds.</li>
        <li><strong>Time to First Byte (TTFB)</strong> — slow server response directly delays crawler timeout. Target: under 800ms.</li>
        <li><strong>Cumulative Layout Shift (CLS)</strong> — less directly relevant for AI, but high CLS often correlates with JavaScript-heavy rendering that delays content extraction.</li>
      </ul>

      <div class="callout"><p>If you are running JavaScript-rendered content (React, Next.js, Vue) without server-side rendering, AI crawlers may be seeing blank pages or loading spinners instead of your content. Enable SSR or static generation for all content-heavy pages.</p></div>

      <h2>Quick CWV fixes for AEO</h2>
      <ul>
        <li>Enable server-side rendering or static generation on key landing pages.</li>
        <li>Move critical CSS inline and defer non-critical JavaScript.</li>
        <li>Use a CDN for all static assets — images, fonts, and scripts.</li>
        <li>Compress and properly size all images. Use WebP with appropriate dimensions.</li>
        <li>Preconnect to third-party origins (Google Fonts, analytics) to reduce TTFB impact.</li>
      </ul>
      <p>Run PageSpeed Insights on your top 20 pages, fix anything with a Poor LCP first, then re-run a Notion Cue scan. In our tests, sites that moved from Poor to Good LCP saw measurable Perplexity citation increases within 7–14 days.</p>
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}