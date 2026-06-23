// ─────────────────────────────────────────────────────────────────────────────
// app/blog/posts.ts
//
// HOW TO ADD A NEW POST:
//   1. Copy any existing object inside BLOG_POSTS.
//   2. Change slug, title, excerpt, date, content, etc.
//   3. slug must be URL-safe lowercase with hyphens only (no spaces).
//   4. content is an HTML string — use the helper tags: <h2>, <h3>, <p>,
//      <ul>/<li>, <strong>, <pre><code>, <div class="callout"><p>...</p></div>
//   5. Save. The index page and post page auto-update — no other files to touch.
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug:           string   // URL: /resources/blog/[slug]
  emoji:          string   // hero banner emoji
  bg:             string   // hero banner background CSS colour
  tag:            string   // category label shown on cards
  date:           string   // display date e.g. "Jun 8, 2026"
  title:          string
  excerpt:        string   // 1–2 sentence summary shown on card and in SEO desc
  read:           string   // e.g. "8 min read"
  author:         string
  authorRole:     string
  authorInitials: string   // 2 chars for avatar fallback
  content:        string   // HTML body — see helper tags above
}

// ─── ALL POSTS ───────────────────────────────────────────────────────────────
// Newest first — the index page renders them in this order.

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // POST 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'why-94-percent-ai-cited-pages-have-structured-data',
    emoji:          '🧠',
    bg:             'rgba(200,242,71,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 8, 2026',
    title:          'Why 94% of AI-cited pages have structured data — and how to join them',
    excerpt:        "We analysed 50,000 pages cited by ChatGPT, Gemini, and Perplexity. Here's what schema types appear most frequently.",
    read:           '8 min read',
    author:         'Arun Mehta',
    authorRole:     'Head of Research · NotionCue',
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
<p>Run an NotionCue scan before and after implementing schema. In our internal tests, sites that added FAQPage schema to their top pages saw a measurable citation increase within 14–21 days.</p>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'dress-outlet-340-percent-ai-traffic-growth',
    emoji:          '📊',
    bg:             'rgba(123,108,255,.06)',
    tag:            'Case Studies',
    date:           'May 29, 2026',
    title:          'How The Dress Outlet grew AI-referred sessions by 340% in 90 days',
    excerpt:        'A step-by-step breakdown of the llms.txt fix, BLUF rewrites, and schema additions that took ChatGPT citations from near-zero to 33K monthly sessions.',
    read:           '12 min read',
    author:         'Priya Kapoor',
    authorRole:     'Senior Strategist · NotionCue',
    authorInitials: 'PK',
    content: `
<h2>Background</h2>
<p>The Dress Outlet is a US-based women's fashion retailer with over 4,000 SKUs and a well-established organic search presence — ranking on page one for dozens of competitive fashion keywords. Despite strong SEO fundamentals, AI-referred traffic was near zero in January 2026.</p>
<p>We ran a full NotionCue AEO audit in late January. The initial score was 34/100. Here's what we found and what we fixed.</p>

<h2>Issue 1 — GPTBot was blocked</h2>
<p>The site's robots.txt included a blanket disallow for all bots not explicitly whitelisted. GPTBot was not on the whitelist. This meant OpenAI's crawler had never indexed the site's content for training or retrieval.</p>
<p><strong>Fix:</strong> Added GPTBot, PerplexityBot, and Google-Extended to the robots.txt allowlist. Also created an llms.txt file at the domain root. This single change took 48 hours to take effect.</p>

<h2>Issue 2 — Homepage BLUF score was 12/100</h2>
<p>The homepage hero copy opened with brand history: "Welcome to The Dress Outlet, where we have been selling dresses since 1998..." This tells an LLM nothing useful about what the site sells, who it serves, or what makes it different.</p>
<p><strong>Fix:</strong> Rewrote the hero copy to lead with a BLUF sentence: "The Dress Outlet sells formal and semi-formal dresses in sizes 0–30, priced from $49 to $299, with free shipping on orders over $75." The new BLUF score was 81/100.</p>

<h2>Issue 3 — No FAQPage schema on category pages</h2>
<p>Category pages like /evening-dresses had no structured data. These are exactly the pages LLMs look to when answering "where can I buy evening dresses" queries.</p>
<p><strong>Fix:</strong> Added FAQPage JSON-LD to the top 20 category pages, each with 3–5 question-answer pairs covering size range, price range, shipping, and return policy.</p>

<h2>Results at 30, 60, and 90 days</h2>
<ul>
  <li><strong>Day 30:</strong> AEO score up from 34 to 61. First ChatGPT citations detected. AI-referred sessions: 2,400/month.</li>
  <li><strong>Day 60:</strong> AEO score up to 74. Perplexity citations appearing. AI-referred sessions: 14,200/month.</li>
  <li><strong>Day 90:</strong> AEO score up to 82. AI-referred sessions: 33,000/month. A 340% increase from baseline.</li>
</ul>

<div class="callout"><p>The three fixes — unblocking AI crawlers, rewriting BLUF content, and adding FAQPage schema — cost less than 20 hours of implementation time combined.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'llms-txt-complete-technical-guide-2026',
    emoji:          '🔬',
    bg:             'rgba(34,211,238,.06)',
    tag:            'Technical',
    date:           'May 14, 2026',
    title:          'llms.txt: the complete technical guide to AI crawler permissions in 2026',
    excerpt:        'Which bots respect it, which ignore it, what format actually works, and why getting this wrong can silently exclude you from AI training pipelines.',
    read:           '10 min read',
    author:         'Sudhir Singh',
    authorRole:     'Technical Lead · NotionCue',
    authorInitials: 'SS',
    content: `
<h2>What is llms.txt?</h2>
<p>llms.txt is a plain text file placed at the root of your domain that communicates crawl permissions and site metadata to AI language model systems. It is modelled on robots.txt but designed specifically for LLM training pipelines and retrieval-augmented generation systems.</p>

<h2>Which AI bots check llms.txt?</h2>
<ul>
  <li><strong>ClaudeBot (Anthropic)</strong> — respects llms.txt and robots.txt.</li>
  <li><strong>PerplexityBot</strong> — respects llms.txt and robots.txt. Real-time retrieval; fast to reflect changes.</li>
  <li><strong>GPTBot (OpenAI)</strong> — primarily uses robots.txt; llms.txt signals incorporated into training data selection.</li>
  <li><strong>Google-Extended</strong> — respects robots.txt. llms.txt support experimental.</li>
  <li><strong>Bingbot / Copilot</strong> — primarily robots.txt. No confirmed llms.txt support as of Q2 2026.</li>
</ul>

<h2>The correct file format</h2>
<pre><code># llms.txt
Name: Your Site Name
Description: One sentence describing what your site is and who it serves.
Domain: https://yourdomain.com
Contact: seo@yourdomain.com
Language: en

User-agent: GPTBot
Allow: /
Disallow: /admin

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /</code></pre>

<h2>Common mistakes</h2>
<ul>
  <li><strong>Disallowing all bots in robots.txt</strong> — robots.txt takes precedence. Fix robots.txt first.</li>
  <li><strong>Wrong file location</strong> — must be at domain root, not in a subdirectory.</li>
  <li><strong>Missing Name and Description fields</strong> — these are used by AI systems to understand site context.</li>
  <li><strong>Using HTML or JSON format</strong> — must be plain text, served as text/plain.</li>
</ul>

<div class="callout"><p>The most common issue in NotionCue audits is a robots.txt that blocks AI crawlers while llms.txt allows them. The robots.txt always wins. Fix robots.txt first, then set llms.txt permissions.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 4
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'gpt-4o-citation-behaviour-april-2026',
    emoji:          '🎯',
    bg:             'rgba(244,114,182,.06)',
    tag:            'LLM Updates',
    date:           'Apr 30, 2026',
    title:          "GPT-4o's new citation behaviour: what changed and what it means for your AEO score",
    excerpt:        "OpenAI's April 2026 update changed how GPT-4o selects sources for commercial intent queries. Here's exactly what shifted.",
    read:           '6 min read',
    author:         'Arun Mehta',
    authorRole:     'Head of Research · NotionCue',
    authorInitials: 'AM',
    content: `
<h2>What OpenAI changed</h2>
<p>In April 2026, OpenAI rolled out a significant update to GPT-4o's retrieval and citation layer, affecting how the model selects sources for commercial and transactional intent queries.</p>

<h2>What we observed</h2>
<p>Across 3,200 tracked commercial intent queries, we measured the following shifts between March and April 2026:</p>
<ul>
  <li>Pages with FAQPage schema saw a <strong>+31% increase</strong> in citation frequency.</li>
  <li>Pages with thin content (under 400 words) saw a <strong>-44% decrease</strong>.</li>
  <li>Pages with clear BLUF structure in the first paragraph saw a <strong>+27% increase</strong>.</li>
  <li>Pages blocked by robots.txt for GPTBot saw no change — uncited regardless of content quality.</li>
  <li>Pages with multiple low-quality outbound links saw a <strong>-18% decrease</strong>.</li>
</ul>

<h2>The pattern: quality signals over quantity</h2>
<p>The April update shifted GPT-4o's retrieval weighting toward content quality signals and away from raw domain authority. Sites with high DA but thin, unstructured content saw citation drops. Sites with lower DA but well-structured, schema-rich content saw citation gains.</p>

<div class="callout"><p>If your AEO score dropped in April 2026, audit your content depth first. The most common cause of citation loss in this update was pages under 400 words with no structured data and no clear BLUF structure.</p></div>

<h2>What to do now</h2>
<ul>
  <li>Run an NotionCue scan and check your GPT-4o engine score specifically.</li>
  <li>Identify pages that lost citations — check word count, schema status, and BLUF score.</li>
  <li>Prioritise adding FAQPage schema to any page under 600 words you want cited.</li>
  <li>Rewrite introductory paragraphs on key pages to lead with the answer, not the context.</li>
</ul>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 5
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'international-aeo-35-global-domains',
    emoji:          '🌐',
    bg:             'rgba(74,222,128,.06)',
    tag:            'AEO Strategy',
    date:           'Apr 12, 2026',
    title:          'International AEO: how to optimise for AI citations across 35 global domains',
    excerpt:        'Managing multi-language, multi-region AEO is a different challenge from single-domain work. Our guide to hreflang, regional llms.txt, and language-specific BLUF.',
    read:           '9 min read',
    author:         'Priya Kapoor',
    authorRole:     'Senior Strategist · NotionCue',
    authorInitials: 'PK',
    content: `
<h2>The international AEO challenge</h2>
<p>Single-domain AEO is relatively straightforward: one language, one audience, one set of crawl permissions. International AEO — managing visibility across multiple country domains, language variants, and regional AI systems — introduces a layer of complexity that most SEO guides do not address.</p>

<h2>Challenge 1 — Regional llms.txt coverage</h2>
<p>llms.txt files need to exist at the root of each country domain independently. A file at yourdomain.com/llms.txt does not apply to fr.yourdomain.com or yourdomain.de. Each domain requires its own file, in the correct language, with region-appropriate contact details.</p>
<p>We found that only 4 of 35 domains had llms.txt files. The remaining 31 were unconfigured, meaning AI systems had no explicit crawl guidance.</p>
<p><strong>Fix:</strong> Created a templated llms.txt generation process that produced a localised file for each domain, with the Description field written in the domain's primary language.</p>

<h2>Challenge 2 — BLUF applied in English only</h2>
<p>The English-language domain had been BLUF-optimised. Every other language variant still opened with brand narrative. Since LLMs weight the first paragraph so heavily, non-English pages were being skipped by retrieval systems even when the rest of the content was high quality.</p>
<p><strong>Fix:</strong> Used the BLUF templates from the NotionCue resource library as a framework, translated by native speakers for each region. Direct translation of English BLUF often fails — native rewriting is required.</p>

<h2>Challenge 3 — hreflang and AI retrieval</h2>
<p>hreflang is a traditional SEO signal for Google to understand language targeting. AI systems queried in a specific language use language detection on the content itself — pages that mix languages or have incorrect lang attributes in the HTML head score lower.</p>

<div class="callout"><p>For international AEO, treat each country domain as a completely independent AEO project. Signals from the root domain do not propagate to subdomains or ccTLDs.</p></div>

<h2>Results</h2>
<p>After implementing llms.txt on all 35 domains, rewriting BLUF intros in all primary languages, and fixing HTML lang attributes: average AEO score across all domains rose from 29 to 61 in 60 days. AI-referred traffic across the domain portfolio increased by 218%.</p>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 6
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'core-web-vitals-ai-citations-connection',
    emoji:          '⚡',
    bg:             'rgba(251,191,36,.06)',
    tag:            'Technical',
    date:           'Mar 28, 2026',
    title:          'Core Web Vitals and AI citations: the surprising connection between page speed and LLM visibility',
    excerpt:        'Perplexity and real-time AI crawlers actively penalise slow pages. Our data shows domains with Good CWV scores get cited 2.1x more often.',
    read:           '7 min read',
    author:         'Sudhir Singh',
    authorRole:     'Technical Lead · NotionCue',
    authorInitials: 'SS',
    content: `
<h2>The finding</h2>
<p>In a study of 8,000 domains tracked by NotionCue, we found that domains with Google's "Good" Core Web Vitals rating were cited by Perplexity 2.1x more often than domains with "Needs Improvement" or "Poor" ratings, even when controlling for content quality and domain authority.</p>

<h2>Why page speed affects AI citations</h2>
<p>Perplexity, and to a lesser extent GPT-4o Browse, retrieve live web content in real time when answering queries. Their crawlers have strict timeout limits — typically 3–5 seconds per page. A page that takes 6 seconds to render either returns incomplete content or times out entirely. The model cannot cite what it cannot read.</p>

<h2>The CWV metrics that matter most for AI</h2>
<ul>
  <li><strong>Largest Contentful Paint (LCP)</strong> — the most directly relevant metric. AI crawlers need main content visible quickly. Target: under 2.5 seconds.</li>
  <li><strong>Time to First Byte (TTFB)</strong> — slow server response directly delays crawler timeout. Target: under 800ms.</li>
  <li><strong>Cumulative Layout Shift (CLS)</strong> — high CLS often correlates with JavaScript-heavy rendering that delays content extraction.</li>
</ul>

<div class="callout"><p>If you are running JavaScript-rendered content (React, Next.js, Vue) without server-side rendering, AI crawlers may be seeing blank pages. Enable SSR or static generation for all content-heavy pages.</p></div>

<h2>Quick CWV fixes for AEO</h2>
<ul>
  <li>Enable server-side rendering or static generation on key landing pages.</li>
  <li>Move critical CSS inline and defer non-critical JavaScript.</li>
  <li>Use a CDN for all static assets — images, fonts, and scripts.</li>
  <li>Compress and properly size all images. Use WebP with appropriate dimensions.</li>
  <li>Preconnect to third-party origins (Google Fonts, analytics) to reduce TTFB impact.</li>
</ul>
<p>Run PageSpeed Insights on your top 20 pages, fix anything with a Poor LCP first, then re-run an NotionCue scan. Sites that moved from Poor to Good LCP saw measurable Perplexity citation increases within 7–14 days.</p>
`,
  },

// ─────────────────────────────────────────────────────────────────────────
  // POST 7 — How AI Crawlers Index Your Site
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'how-ai-crawlers-index-your-site',
    emoji:          '🤖',
    bg:             'rgba(200,242,71,.06)',
    tag:            'Technical',
    date:           'Jun 23, 2026',
    title:          'How AI Crawlers Index Your Site (And Why Your robots.txt May Be the Problem)',
    excerpt:        'Before your content reaches ChatGPT, Perplexity, or Claude as a cited answer, a bot has to fetch your page. Most sites are blocking the wrong bots without knowing it.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Before any of your AEO content work pays off, a bot has to fetch your page first.</p>
<p>No crawl, no citation. It does not matter how well your content answers the question. If GPTBot or PerplexityBot cannot reach the page, they cannot use it. I keep seeing the same pattern: teams put real work into structuring content for AI answers, adding FAQs, fixing schema, reformatting headings — then the citations still do not come, and nobody knows why. Usually it is because the crawlers were blocked before they ever reached the content. Nothing in GA4 shows it. It just stays quiet.</p>

<h2>The Three Types of AI Crawler (and They Are Not Interchangeable)</h2>
<p>Most people treat AI crawlers as a single category. They are three distinct things, and the distinction matters for how you set up robots.txt.</p>
<p><strong>Training crawlers</strong> are the bulk collectors. GPTBot (OpenAI) and ClaudeBot (Anthropic) crawl the web to improve future model versions. Blocking them keeps your content out of training datasets but has no direct effect on whether ChatGPT or Claude cites you in live answers today.</p>
<p><strong>Retrieval and search crawlers</strong> are what actually drive live citations. OAI-SearchBot powers ChatGPT Search. Claude-SearchBot feeds Anthropic's retrieval pipeline. PerplexityBot indexes pages that Perplexity cites with live links. These are the bots you need to allow if you want to show up in AI-generated answers.</p>
<p><strong>On-demand fetchers</strong> work differently again. ChatGPT-User and Claude-User fire when a real user asks something that needs a current page. They visit one URL, in real time, because a person triggered it. A lot of robots.txt configs accidentally catch these alongside the bulk bots.</p>
<p>You can block training crawlers and allow retrieval crawlers at the same time. OpenAI documents this explicitly. Block GPTBot to stay out of training data, allow OAI-SearchBot to keep your pages in ChatGPT answers. Two decisions, two separate directives.</p>

<h2>AI Crawlers Do Not Run JavaScript</h2>
<p>Most brand sites render content client-side. React, Next.js, Vue. A browser executes JavaScript, fills the DOM, and a user sees the full page. AI crawlers skip that step.</p>
<p>Vercel published analysis of how GPTBot and ClaudeBot interact with Next.js applications. Both crawlers fetch JavaScript files but do not execute them. They read the raw HTML the server sends. If your main content only exists after JavaScript runs, those crawlers get an empty container.</p>
<p>Gemini is the one exception. Every other major AI crawler works from initial HTML only. If you are running a React SPA with client-side data fetching, a significant portion of your content is invisible to GPTBot and PerplexityBot right now. Server-side rendering or static generation for key pages fixes this.</p>

<h2>What Your robots.txt Should Actually Say</h2>
<p>Here is a clean starting point for a brand that wants AI search visibility while keeping content out of training datasets:</p>
<pre><code># Retrieval and search crawlers — allow for citations
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

# Training crawlers — block to stay out of training data
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

# Standard search — leave these open
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml</code></pre>
<p>Each user-agent needs its own directive. ClaudeBot and Claude-SearchBot are independently controllable — blocking ClaudeBot does not affect Claude-SearchBot. OpenAI follows the same pattern: block GPTBot, allow OAI-SearchBot, and both decisions hold independently.</p>

<h2>Three Checks to Run Now</h2>
<ul>
  <li><strong>Fetch your key pages as plain HTML.</strong> Run <code>curl -A "GPTBot" https://yourdomain.com/your-page/</code> and read what comes back. If the content you want AI to cite is not in that output, JavaScript is hiding it.</li>
  <li><strong>Test your robots.txt against each bot individually.</strong> Look specifically for wildcard Disallow rules that may be catching retrieval bots you want to allow.</li>
  <li><strong>Connect crawl activity to citation data.</strong> A bot visiting your page and that page appearing in an AI answer are two separate events. The NotioncCue AI Crawler Audit links crawl frequency data to citation tracking across ChatGPT, Perplexity, Claude, and Google AI Overviews.</li>
</ul>

<h2>The Blocker Nobody Checks: CDN and WAF Rules</h2>
<p>robots.txt is not the only layer that can stop AI crawlers. CDN and WAF configurations run before robots.txt is ever checked. AI crawlers operate from US-based cloud infrastructure. Firewall rules targeting "unknown bots" or "datacenter IPs" catch them as collateral damage. Cloudflare's Bot Fight Mode does this regularly.</p>
<p>If your logs show zero AI crawler traffic and your robots.txt is clean, check your WAF and CDN bot management settings. The fix is allowlisting specific user-agent strings at that layer, not just in robots.txt.</p>

<div class="callout"><p>Run the NotioncCue AI Crawler Audit to see which crawlers are accessing your site, which pages are being ignored, and where citation gaps are costing you AI search visibility.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 8 — Your llms.txt File
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'llms-txt-what-it-actually-does',
    emoji:          '📄',
    bg:             'rgba(123,108,255,.06)',
    tag:            'Technical',
    date:           'Jun 22, 2026',
    title:          'Your llms.txt File Probably Isn\'t Doing What You Think',
    excerpt:        'Three major studies, 300,000+ domains analysed, and one finding: llms.txt does not directly move AI citation rates. Here is what it is actually good for.',
    read:           '8 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>There is a version of this file that does something useful. There is also a version that takes thirty minutes to build, sits at your domain root untouched, and accomplishes nothing. Most sites have the second version.</p>
<p>llms.txt got a lot of attention in 2024 as the AEO community started treating it like a shortcut to AI citation visibility. The pitch was simple: write a plain text file pointing AI crawlers to your best pages, and they start citing you more. That pitch was wrong, or at least wrong about the causal direction.</p>

<h2>What the File Actually Is</h2>
<p>llms.txt is a plain Markdown file you place at the root of your domain at <code>yourdomain.com/llms.txt</code>. Its job is to give AI systems a clean, curated summary of your site without them having to parse JavaScript, navigate menus, or guess which pages matter.</p>
<p>The spec at llmstxt.org defines a specific structure. Every valid file starts with an H1 containing the site or project name. Immediately after, a blockquote summary explains what the site does. Then optional H2 sections organise links to key pages, each with a short description.</p>
<pre><code># NotioncCue

> AEO tracking platform that monitors brand citations across ChatGPT, Perplexity, Claude, and Google AI Overviews, with an llms.txt generator and prompt-level visibility dashboard.

## Core Tools

- [AI Citation Tracker](/tracker): Track how often and where your brand is cited across five AI engines.
- [llms.txt Generator](/llms-generator): Build a spec-compliant llms.txt file based on your actual crawl and citation data.
- [AI Crawler Audit](/crawler-audit): See which AI bots are fetching your pages and which are being blocked.

## Optional

- [Changelog](/changelog): Recent product updates and new features.</code></pre>

<h2>The Evidence on Whether It Works</h2>
<p>Several independent studies now exist on this question, and the consensus is fairly clear.</p>
<ul>
  <li>SE Ranking analysed 300,000 domains and found no correlation between having an llms.txt file and AI citation frequency.</li>
  <li>Generix Marketing ran 2,139 prompt checks across ChatGPT, Claude, and Perplexity against 2,500 of the world's most visited websites and found only a 1.27x over-representation — likely explained by stronger overall technical SEO on sites that bother to publish the file.</li>
  <li>Ahrefs published a study in June 2026 across 137,000 sites and found that 97% of llms.txt files received zero requests in May. No bots. No humans. Nothing.</li>
</ul>
<p>Google stated explicitly in its May 2026 generative AI optimisation guide that no special files, markup, or Markdown are needed to appear in Google Search or AI Overviews.</p>

<h2>Where It Actually Has Value</h2>
<p>Two reasons hold up. First, some AI-powered coding tools and browser agents do parse the file — Cursor, Claude Code, and similar tools. If your site serves developers or technical users, the file is actually read by a meaningful audience. Second, the file costs very little if built correctly. A clean, accurate llms.txt takes an afternoon and requires no maintenance beyond updating it when your site structure changes materially.</p>

<div class="callout"><p>The mistake is treating llms.txt as a citation lever. It is not. It is infrastructure, and low-priority infrastructure at that. Build your file once the fundamentals are solid — crawler access, schema, content freshness, entity signals.</p></div>

<h2>The Five Mistakes That Make the File Useless</h2>
<ul>
  <li><strong>The H1 is a tagline, not a name.</strong> "The world's most powerful AEO platform" is not a name. "NotioncCue" is. Positioning copy belongs in the blockquote.</li>
  <li><strong>The blockquote is vague.</strong> "We help businesses grow online" could describe ten thousand companies. Write it for a system that is categorising your site, not a human skimming a homepage.</li>
  <li><strong>Pages are listed that should not be there.</strong> llms.txt is a curated directory, not a sitemap. Thin pages, archived content, and old campaign landing pages should not be in it.</li>
  <li><strong>The file is outdated.</strong> An llms.txt with last year's product names or discontinued features is worse than no file — it creates a misinformation problem.</li>
  <li><strong>It is blocked by the CDN.</strong> Verify your file returns an HTTP 200. <code>curl -I https://yourdomain.com/llms.txt</code> takes five seconds and confirms it.</li>
</ul>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 9 — AI Citation Decay
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'ai-citation-decay-why-it-happens',
    emoji:          '📉',
    bg:             'rgba(34,211,238,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 21, 2026',
    title:          'Your Page Ranked Last Month. AI Stopped Citing It This Month. Here Is Why.',
    excerpt:        'Google Analytics shows nothing wrong. The page still ranks. But your brand has vanished from AI-generated answers. This is citation decay, and it is the AEO problem most teams find out about six months too late.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Google Analytics shows nothing wrong. The page still ranks. Backlinks are intact. Traffic from search is steady. But run the same prompts you ran three months ago through ChatGPT, Perplexity, or Claude, and your brand is gone from the answers. A competitor is there instead.</p>
<p>This is citation decay, and it is the AEO problem most teams find out about six months too late.</p>

<h2>What Citation Decay Actually Looks Like</h2>
<p>AI citation loss does not announce itself. The first sign most teams notice is that AI-driven referral traffic quietly stops growing, then starts falling. By then the decay has usually been running for weeks. The pattern is consistent: a page cited weekly in March is down to monthly by August and gone from AI answers by year end. The page looks healthy in every traditional metric.</p>
<p>Ahrefs confirmed this clearly. AI Overview citation overlap with Google's top 10 dropped from 76% in mid-2025 to 38% by early 2026. Ranking in traditional search no longer predicts citation in AI answers. The two channels are diverging fast.</p>

<h2>Why AI Engines Drop Pages They Used to Cite</h2>
<p>There are four main causes.</p>
<p><strong>Recency signals.</strong> AI retrieval systems weight content freshness heavily because freshness is a proxy for accuracy. When an engine finds two pages covering the same topic, the one updated more recently tends to win the citation slot. Amsive's 2026 benchmarks show 50% of AI citations going to content updated in the past 13 weeks. AirOps reports a citation penalty of more than 3x for content older than three months without any update. The freshness signal is sent through <code>dateModified</code> in your Article JSON-LD schema, the <code>lastmod</code> field in your XML sitemap, and any visible "last updated" label in the page body.</p>
<p><strong>Stale statistics and outdated claims.</strong> A page anchored to a 2023 statistic loses citation share to a page anchored to a 2025 or 2026 equivalent, even when the underlying claim has not changed. AI systems cross-reference claims against multiple sources. When your key statistic has been superseded by newer data published elsewhere, the engine starts preferring the page with the current number.</p>
<p><strong>Vocabulary drift.</strong> If your page uses 2022 terminology and the query uses 2026 terminology, the embedding distance between your content and the query can grow large enough that your page never surfaces as a candidate. AI search injects the current year into queries about 28% of the time.</p>
<p><strong>A competitor published something better.</strong> When a competitor publishes a thorough, well-structured page on a topic you own, AI engines often rotate within days. Citation share is not a permanent position.</p>

<div class="callout"><p>Citation decay accelerates itself. When your brand stops appearing in AI answers, you start losing the community mentions that come from AI-driven discovery. Fewer external mentions reduce AI engines' confidence in your brand as a credible source. Less confidence means further citation loss. Brands that catch a drop in week two spend a few weeks recovering. Those who find it six months later are dealing with a much bigger hole.</p></div>

<h2>How to Fix It: The Content Refresh Sequence</h2>
<ul>
  <li><strong>Update the statistics first.</strong> Find every data point on the page. If it cites a study or statistic from more than eighteen months ago, replace it with a current equivalent.</li>
  <li><strong>Refresh the dateModified signal.</strong> Update your Article JSON-LD schema so dateModified reflects the actual update date. Update lastmod in your sitemap and republish.</li>
  <li><strong>Add or expand the direct answer block.</strong> Every key section should open with a direct, self-contained answer in the first forty to sixty words.</li>
  <li><strong>Audit your vocabulary.</strong> Update the language to match how the topic is discussed today.</li>
  <li><strong>Add or expand FAQ schema.</strong> FAQPage schema remains one of the highest-impact structured data signals for AI citation.</li>
  <li><strong>Re-promote the page externally.</strong> A refreshed page will not automatically recover its citation share. Update internal links pointing to it and share it in relevant communities.</li>
</ul>
<p>The NotioncCue Citation Tracker runs your tracked prompts across all five major engines on a weekly cadence. When your citation rate drops on a tracked prompt, you see it in the dashboard before you see it in traffic.</p>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 10 — AEO Prompt Tracking Strategy
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'aeo-prompt-tracking-strategy',
    emoji:          '🎯',
    bg:             'rgba(244,114,182,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 20, 2026',
    title:          'How to Build a Prompt Tracking Strategy That Actually Tells You Something',
    excerpt:        'Most teams count brand mentions, call it a metric, and wonder why nothing improves. Prompt tracking is not keyword rank tracking with a different interface. Here is how to build a set that produces signal.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Most teams setting up AI search tracking make the same mistake early on. They build a list of prompts that feel relevant, run them through one tool, count how many times the brand shows up, and treat that number as a performance metric. That number means almost nothing on its own.</p>
<p>Prompt tracking is not keyword rank tracking with a different interface. The underlying system behaves differently, the outputs are non-deterministic, and the data only becomes useful when you know what you are actually trying to measure and why.</p>

<h2>Why Prompt Tracking Is Harder Than Keyword Tracking</h2>
<p>Run the same prompt twice in the same session and you may get different sources cited, different brands mentioned, and different framing of the same information. Research on local queries in Google AI Mode found that only 35% of domains repeat across two consecutive runs of the same prompt.</p>
<p>AI systems also do not retrieve against the raw prompt you enter. They rewrite it. What happens under the hood is query fan-out: the system breaks one complex prompt into several simpler sub-queries, retrieves content for each, and synthesises a combined answer. Your content earns citations at the sub-query level, not at the level of the full prompt the user typed.</p>

<h2>The Seven Prompt Types Worth Tracking</h2>
<ul>
  <li><strong>Problem-aware prompts.</strong> The buyer is naming the issue. "Why is my brand not showing up in AI answers?" These reveal whether your content appears at the start of the research journey.</li>
  <li><strong>Category-learning prompts.</strong> "What is answer engine optimisation?" "How does AEO differ from SEO?" If your content does not appear here, you are invisible during the research phase that shapes how buyers evaluate everything else.</li>
  <li><strong>Comparison prompts.</strong> "Best tools for tracking AI citations in 2026." These are high-value. A brand that consistently appears in comparison answers has a measurable advantage.</li>
  <li><strong>Competitor-alternative prompts.</strong> "Alternatives to [Competitor X] for AI visibility tracking." Buyers who are already considering a specific competitor are a step away from a decision.</li>
  <li><strong>Objection prompts.</strong> "Is AEO actually worth it for a small business?" Buyers at this stage are checking objections before committing.</li>
  <li><strong>Implementation prompts.</strong> "How do I set up an llms.txt file?" These drive citation of technical content, documentation, and how-to guides.</li>
  <li><strong>Branded prompts.</strong> "What is NotioncCue?" Track these separately. They tell you whether AI systems have an accurate picture of your brand, not whether you appear in the category conversation.</li>
</ul>

<h2>What to Measure Beyond Brand Mentions</h2>
<ul>
  <li><strong>Presence rate.</strong> Over ten runs of the same prompt in one week, how many times does your brand appear? A brand with a 70% presence rate is in a much stronger position than one with 30%, even though both technically "appeared."</li>
  <li><strong>Citation vs. mention.</strong> A citation is a named source with a link. A mention is a reference by name without a link. Both matter, but differently.</li>
  <li><strong>Mention position.</strong> Being named first in an AI answer is different from being named fifth in a list of alternatives.</li>
  <li><strong>Competitor share of voice.</strong> Who is appearing on the prompts where you are not? This turns absence data into content direction.</li>
</ul>

<div class="callout"><p>Every prompt where you are consistently absent is a content brief. The question in the prompt is the brief. The answer engine is telling you that the content currently on your site does not satisfactorily answer that question for a citation.</p></div>

<h2>How Many Prompts to Track</h2>
<p>For a single product or service, ten to fifteen well-chosen prompts covering each of the types above is enough to establish a baseline and detect meaningful shifts. You need at least seven to ten prompts per topic cluster for the numbers to be statistically meaningful. Expand the prompt set only when you have a genuine new buyer segment, a new product, or a new geography — not to capture wording variations of prompts already in your set.</p>
<p>The NotioncCue Prompt Tracker runs your selected prompts across ChatGPT, Perplexity, Claude, Google AI Overviews, and Gemini on a weekly cadence, so you see trends rather than single-session noise.</p>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 11 — JSON-LD Schema for AEO
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'json-ld-schema-aeo-types-that-move-citation-rates',
    emoji:          '🧩',
    bg:             'rgba(74,222,128,.06)',
    tag:            'Technical',
    date:           'Jun 19, 2026',
    title:          'JSON-LD Schema for AEO: The Types That Actually Move Citation Rates',
    excerpt:        'Pages with well-implemented structured data earn AI citations at 2.8x the rate of unstructured equivalents. Here are the five schema types that drive that gap, in priority order, with copy-paste JSON-LD for each.',
    read:           '10 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Schema markup does not guarantee AI citations. Nothing does. But pages with well-implemented structured data earn citations at measurably higher rates than equivalent pages without it. AirOps research from 2026 puts pages with clean structured data at 2.8 times the citation rate of poorly structured equivalents.</p>
<p>Two things changed in 2026 worth knowing before implementation. HowTo rich results were deprecated by Google in January 2026 — the JSON-LD type is still valid and AI engines still parse it, but SERP rich results are gone. FAQPage rich results were removed from standard Google Search on 7 May 2026, completing a restriction started in 2023. FAQPage JSON-LD is still valid and AI retrieval crawlers still parse it. Do not remove FAQPage markup from your site because of this change.</p>

<h2>1. Organisation Schema (Sitewide — Do This First)</h2>
<p>Organisation schema defines your brand as an entity. The <code>sameAs</code> array is what makes this high-leverage for AEO. Linking your brand to its external profiles teaches AI knowledge graphs to recognise and accurately describe your brand.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://notioncue.com/#organization",
  "name": "NotioncCue",
  "url": "https://notioncue.com",
  "description": "AEO tracking platform that monitors brand citations across ChatGPT, Perplexity, Claude, and Google AI Overviews.",
  "sameAs": [
    "https://www.linkedin.com/company/notioncue",
    "https://twitter.com/notioncue"
  ]
}</code></pre>

<h2>2. Article Schema (Every Blog Post and Content Page)</h2>
<p>Article schema signals editorial credibility. The <code>dateModified</code> property is the most under-used and highest-value field. AI retrieval systems use it as one of the primary freshness signals when comparing two pages on the same topic.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title Here",
  "datePublished": "2026-06-01",
  "dateModified": "2026-06-23",
  "author": {
    "@type": "Person",
    "name": "Sudhir Singh",
    "sameAs": "https://www.linkedin.com/in/sudhir-ks"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://notioncue.com/#organization"
  }
}</code></pre>

<h2>3. FAQPage Schema (Any Page With a Q&A Section)</h2>
<p>FAQPage is the schema type most directly aligned with how AI retrieval works. Keep each <code>acceptedAnswer.text</code> between 40 and 80 words — short enough to be pulled directly into an AI-generated response, long enough to be substantive. Write questions in natural language matching how people actually type into ChatGPT.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is answer engine optimisation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer engine optimisation (AEO) is the practice of structuring content so AI systems like ChatGPT, Perplexity, Claude, and Google AI Overviews can extract and cite it in generated answers. It differs from traditional SEO in that it targets AI-generated responses rather than positions on a search results page."
      }
    }
  ]
}</code></pre>

<h2>4. Person Schema (Author Pages)</h2>
<p>Author credibility is an E-E-A-T signal that AI systems use when deciding whether to cite a source. The <code>knowsAbout</code> array tells AI systems which topics to associate with this author.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://notioncue.com/about/#person",
  "name": "Sudhir Singh",
  "jobTitle": "Senior SEO and AEO Specialist",
  "sameAs": ["https://www.linkedin.com/in/sudhir-ks"],
  "knowsAbout": [
    "Answer Engine Optimisation",
    "AI Search Visibility",
    "Technical SEO",
    "AI Citation Tracking"
  ]
}</code></pre>

<h2>5. BreadcrumbList Schema (All Content Pages)</h2>
<p>BreadcrumbList schema tells AI crawlers where a page sits within your site's information architecture. A page on AI citation tracking that sits within a structured AEO content cluster is more authoritative on that topic than a standalone page with no structural context.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://notioncue.com"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://notioncue.com/blog"},
    {"@type": "ListItem", "position": 3, "name": "JSON-LD Schema for AEO", "item": "https://notioncue.com/blog/json-ld-schema-aeo"}
  ]
}</code></pre>

<div class="callout"><p>Validate every page before publishing using Google's Rich Results Test at search.google.com/test/rich-results. After publishing, Perplexity typically responds within days because it retrieves at query time. ChatGPT and Claude can take four to twelve weeks for training and index updates.</p></div>
`,
  },
// ─────────────────────────────────────────────────────────────────────────
  // POST 12 — Off-Site AEO Signals
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'off-site-aeo-signals-third-party-citations',
    emoji:          '🌐',
    bg:             'rgba(200,242,71,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 18, 2026',
    title:          'Off-Site AEO: Why 68% of AI Citations Come From Sources You Do Not Own',
    excerpt:        'A content strategy living entirely on your own domain has a structural ceiling. Reddit, review platforms, Wikipedia, and editorial coverage are where AI engines do most of their sourcing.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Most AEO content focuses on your own site — what is on the page, how the schema is structured, how fast it loads, whether the crawler can get in. That work matters. But 68% of AI citations in 2026 come from sources you do not control.</p>
<p>Third-party mentions, community discussions, review platforms, editorial coverage, Wikipedia entries, and forum threads are where AI engines do a large share of their sourcing. A brand with perfect on-site AEO and no off-site presence is still invisible for most of the prompts where buyers make decisions.</p>

<h2>Why AI Engines Weight Third-Party Sources Heavily</h2>
<p>AI retrieval systems do not take your word for what your brand is. They build a picture from across the web. When ChatGPT, Perplexity, or Claude assembles an answer mentioning your brand, it draws from a layered graph of sources. Your own domain is one layer. What others say about you on Reddit, in reviews, in editorial articles, in industry forums is a separate layer. That second layer functions as corroboration.</p>
<p>This is particularly visible at the comparison and recommendation stage. When a buyer asks "what are the best AEO tracking tools in 2026," the AI engine is not primarily pulling from vendor websites. It is pulling from review threads, comparison articles, and community recommendations. Your product page is unlikely to be in that answer regardless of how well it is structured.</p>

<h2>Reddit: 40% Citation Rate, One Genuine Problem</h2>
<p>Reddit is cited in 40.1% of AI answers across major platforms, making it the most frequently cited source in AI-generated responses. Google's $60 million annual licensing deal with Reddit gives it real-time access to forum content for AI training and retrieval. Profound's data confirmed Reddit as the most cited domain across both Google AI Overviews and Perplexity between August 2024 and June 2025.</p>
<p>This makes Reddit genuinely important for AEO. It also makes it one of the most mishandled channels in the space. In June 2026, 404 Media reported that companies in the peptide and HRT space had flooded subreddits with coordinated posts designed to shape AI answers, using aged accounts and paid posters to evade detection. Moderators responded by banning new standalone posts on those topics. The brands involved now have a harder problem than the one they started with.</p>
<p>The version of Reddit that works for AEO is actual participation. Answer real questions in communities your buyers use. Add detail that threads lack. Be the person who posts something useful that a moderator would not remove. That content stays, gets indexed, feeds training data, and earns citations over time.</p>

<h2>Review Platforms: G2, Capterra, Trustpilot, Clutch</h2>
<p>Review platform profiles carry two kinds of value: the citations AI engines pull when users ask for comparisons and recommendations, and the entity corroboration they provide when AI systems are trying to build an accurate picture of your brand. SE Ranking research found that brands with substantial presence on Quora and Reddit have roughly four times higher AI citation rates than brands with minimal community activity.</p>
<p>Four things to get right: your product description needs to match your website using the same terminology; your category listing needs to match how buyers describe the problem you solve; recent reviews signal active usage and current relevance; and owner responses to reviews signal that a real team is behind the product.</p>

<h2>Wikipedia and Wikidata: The Entity Anchor</h2>
<p>For brands with enough coverage to qualify, a Wikipedia entry is the single highest-value off-site AEO asset. AI knowledge graphs treat Wikipedia as ground truth. When your brand has a Wikipedia article, the <code>sameAs</code> link on your Organisation schema pointing to that article gives AI systems an entity anchor that resolves ambiguity, prevents misattribution, and reinforces the accuracy of every other claim about your brand.</p>
<p>Wikidata entries have lower barriers than Wikipedia. A Wikidata entry for your brand with accurate properties — founding date, headquarters, industry, founder, product category — feeds directly into AI knowledge graph construction.</p>

<h2>The Off-Site Signal Stack: Priority Order</h2>
<ul>
  <li><strong>Fix entity consistency first.</strong> Audit what already exists. Check that your LinkedIn, Crunchbase, G2, and any existing review profiles use consistent naming, descriptions, and product categorisation. Inconsistency is what AI engines encounter first, and it reduces citation confidence.</li>
  <li><strong>Claim and complete review platform profiles.</strong> G2, Capterra, and Clutch for SaaS and B2B. Trustpilot for consumer products. Match your website's entity language and establish a process for generating genuine reviews.</li>
  <li><strong>Build Reddit presence through contribution.</strong> Read before posting. Contribute in subreddits where your category is actively discussed. Never post promotional content.</li>
  <li><strong>Pursue editorial coverage with original data.</strong> Commission or produce proprietary research. Pitch it to publications your buyers read. The coverage that results is the off-site signal with the longest lifespan.</li>
  <li><strong>Pursue Wikipedia and Wikidata if you qualify.</strong> Do not attempt a Wikipedia article before you have third-party coverage that meets notability guidelines.</li>
</ul>

<div class="callout"><p>The NotioncCue Citation Tracker shows you which off-site domains are appearing in AI answers for your tracked prompts. It tells you where your competitors have presence that you do not, which is the fastest way to identify which platform to prioritise next.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 13 — AEO vs SEO 2026
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'aeo-vs-seo-2026-what-overlaps-what-split',
    emoji:          '⚖️',
    bg:             'rgba(123,108,255,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 17, 2026',
    title:          'AEO vs SEO in 2026: What Still Overlaps and What Has Genuinely Split',
    excerpt:        'The framing that AEO replaces SEO is wrong. The framing that AEO is just SEO with a different name is equally wrong. Here is exactly where they share foundations and where they have genuinely diverged.',
    read:           '8 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>The framing that AEO replaces SEO is wrong. The framing that AEO is just SEO with a different name is equally wrong. The honest answer is somewhere between those two, and it has practical consequences for how you allocate time and budget.</p>

<h2>Where They Are Still the Same Thing</h2>
<p><strong>Crawl access.</strong> If Googlebot cannot reach your page, it cannot rank. If GPTBot or OAI-SearchBot cannot reach your page, it cannot cite. The technical requirement is identical: clean robots.txt, no blocking CDN rules, content in the initial HTML response, and a sitemap that reflects current site structure.</p>
<p><strong>Content quality and topical depth.</strong> The Animalz 2026 citation analysis found that the signals driving AI citations are the same fundamentals that drove search authority for years: named sources, recent data, identifiable expertise, and complete topic coverage. Pages that rank well in Google because they are authoritative and comprehensive are also the pages AI systems prefer to cite.</p>
<p><strong>E-E-A-T signals.</strong> Author credentials, original research, transparent sourcing, and expert attribution improve both traditional search signals and AI citation confidence. These are not separate disciplines.</p>
<p><strong>Internal linking.</strong> Both systems use internal link structure to understand topical hierarchy and page authority. A page buried three clicks deep with no internal links has low discoverability for both traditional search and AI retrieval.</p>

<h2>Where They Have Genuinely Split</h2>
<p><strong>What you are optimising for.</strong> SEO optimises for position: where your page appears on a results page. AEO optimises for inclusion: whether your content appears inside an AI-generated answer at all. Ahrefs confirmed this clearly — AI Overview citation overlap with Google's top 10 dropped from 76% in mid-2025 to 38% by early 2026. Ranking well in traditional search no longer predicts citation in AI answers.</p>
<p><strong>Content structure at the paragraph level.</strong> SEO content is typically structured around keyword coverage and topic depth. AEO content needs those goals plus one more: every section needs to front-load a direct, self-contained answer in the first 40 to 60 words. AI retrieval systems use passage-level extraction. If the answer only appears after two paragraphs of context, the system often skips it and cites a page where the answer comes first.</p>
<p><strong>Where citations come from.</strong> SEO authority flows primarily from backlinks and domain authority. AI citation authority flows from a mix of on-site structure, schema coverage, entity clarity, and third-party corroboration across platforms AI systems trust: Reddit, review platforms, editorial coverage, Wikipedia. A brand with 500 high-quality backlinks has a head start on AEO, but it does not automatically translate.</p>
<p><strong>Measurement.</strong> SEO is measured through rank position, organic traffic, and CTR — stable, directly observable metrics. AEO metrics are probabilistic. The same prompt run twice may return different sources. Citation rate is a measure of how often your brand appears across multiple runs of a tracked prompt. You cannot use rank tracking tools to measure AEO performance.</p>

<h2>The Same Content Can Win Both, With One Condition</h2>
<p>A well-structured page built for AEO often performs better in traditional search than a page built only for SEO. Answer-first structure, clear headings, and comprehensive schema are the same patterns that trigger featured snippets and improve dwell time.</p>
<p>The condition is that AEO-first content requires a discipline that some SEO content skips: every section needs a direct answer before it expands, every heading needs to be a genuine question or direct statement, every claim needs a source, and the content cannot be padded to hit a word count. When that discipline is in place, the same page can rank on Google, appear in AI Overviews, get cited in Perplexity, and feed schema that strengthens entity authority.</p>

<div class="callout"><p>For most teams, the planning split looks like this. SEO handles keyword research, backlink building, site architecture, Core Web Vitals, traditional rank tracking, and content calendars. AEO adds prompt set selection and tracking, passage-level answer blocks, FAQPage and Article schema, dateModified freshness signals, off-site presence on Reddit and review platforms, entity graph maintenance, and citation monitoring across AI engines.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 14 — AEO Content Writing
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'how-to-write-content-ai-engines-extract-and-cite',
    emoji:          '✍️',
    bg:             'rgba(34,211,238,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 16, 2026',
    title:          'How to Write Content AI Engines Actually Extract and Cite',
    excerpt:        'Most content that fails to get cited is not bad content. It is content written for a human reader that an AI retrieval system cannot efficiently parse. The fix is structural, not qualitative.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>Most content that fails to get cited is not bad content. It is content written for a human reader that an AI retrieval system cannot efficiently parse. The distinction matters because the fix is structural, not qualitative. You do not need to rewrite your expertise. You need to repackage it in a format that lets AI engines extract a clean, self-contained answer without inference work.</p>

<h2>How AI Retrieval Actually Works at the Content Level</h2>
<p>When an AI engine generates an answer, it does not read your page the way a human does. It breaks the page into chunks, typically by paragraph or heading section, then runs each chunk against the query to find the passage most likely to contain the answer. The passage with the highest relevance score gets extracted. If no chunk passes the threshold, the page gets skipped.</p>
<p>SparkToro's 2026 citation analysis found that 44.2% of all AI citations come from the first 30% of a piece of content. The middle section accounts for 31.1%, and the conclusion just 24.7%. Front-loading answers is the most direct lever you have on citation probability.</p>

<h2>The Answer Block: The Unit That Gets Cited</h2>
<p>The atom of AEO content writing is the answer block: a self-contained passage of 40 to 60 words that answers the heading question directly, without requiring any surrounding content to make sense. That length matches the extraction window AI engines use for featured snippets and AI Overview citations. Blocks under 40 words often lack enough context to stand alone. Blocks over 60 words tend to get paraphrased rather than cited directly.</p>
<p>The rewrite rule is simple: lead with the conclusion, then support it.</p>
<p><strong>Before (buries the answer):</strong> "There are a number of considerations when thinking about how to structure content for AI visibility. The nature of AI retrieval systems, combined with the way large language models process text, means that content which was optimised for traditional search may not perform the same way..."</p>
<p><strong>After (answer block):</strong> "Answer blocks for AI citation should be 40 to 60 words long. This matches the extraction window retrieval systems use for featured snippets and AI Overview responses. Shorter blocks lack standalone context. Longer blocks get paraphrased rather than cited directly, which reduces brand attribution across Perplexity, ChatGPT, and Google AI Overviews."</p>

<h2>Heading Format: Questions Outperform Descriptions</h2>
<p>Question headings create heading-to-query alignment: when a user asks "how long should an AEO answer block be," a heading that says "How long should an AEO answer block be?" creates a direct match. Aim for at least 60% of your H2 and H3 headings to use one of these question formats:</p>
<ul>
  <li><strong>Definition format:</strong> "What is [concept]?" — for glossary-style and introductory sections.</li>
  <li><strong>How-to format:</strong> "How do I [task]?" — highest extraction rate for procedural content.</li>
  <li><strong>Causal format:</strong> "Why does [outcome] happen?" — signals evidence-based content.</li>
  <li><strong>List format:</strong> "What are the [types/reasons/steps]?" — signals list-format answers.</li>
  <li><strong>Comparison format:</strong> "What is the difference between [A] and [B]?" — ideal for decision-support sections.</li>
</ul>

<h2>Writing for RAG: Entity Clarity</h2>
<p>Modern AI engines use Retrieval-Augmented Generation. They break your content into chunks and retrieve the most relevant chunk when a query matches. Each paragraph needs to carry its own context — avoid pronouns replacing key entities. Instead of "it reduces latency," write "server-side rendering reduces latency." Instead of "the tool," write "NotioncCue's Prompt Tracker."</p>
<p>Discovered Labs found that content with comparison tables gets cited 2.5 times more often than equivalent prose on the same topic. A table is a self-contained data structure with no ambiguity about which cell answers which question.</p>

<h2>Updating Existing Content: Fastest Path to Citation Gains</h2>
<ul>
  <li><strong>Convert the top five headings.</strong> Rewrite each as a question. Immediately below each rewritten heading, add a 40 to 60 word answer block. This is the highest citation rate impact for the least effort.</li>
  <li><strong>Add FAQPage schema.</strong> Every question-and-answer pair can go directly into the schema.</li>
  <li><strong>Update dateModified.</strong> Update your Article schema's dateModified field and your sitemap lastmod after any content change.</li>
</ul>

<div class="callout"><p>Acquia documented a real case: restructuring top-traffic product and solution pages with question headings and FAQ blocks moved AI citation share from 14% to 38% within 90 days. No new content was written. Only structure changed.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 15 — AI Brand Hallucination
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'ai-brand-hallucination-find-and-fix',
    emoji:          '🔍',
    bg:             'rgba(244,114,182,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 15, 2026',
    title:          'AI Is Describing Your Brand Wrong. Here Is How to Find It and Fix It.',
    excerpt:        'Hallucination rates on brand-specific information run between 20% and 76% depending on the engine. For brands that have not built a systematic evidence layer, the AI\'s best guess is often wrong in ways that are commercially damaging and completely invisible unless you run the prompts yourself.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>A prospect asks ChatGPT about your pricing. The answer comes back with a plan you discontinued eighteen months ago. A journalist uses Perplexity to research your company before a call. The description it returns is half accurate, half a blend of you and a competitor with a similar name. A buyer asks Claude whether your product integrates with a platform they use. It says no. The integration has existed for two years.</p>
<p>These are not edge cases. Hallucination rates on brand-specific information run between 20% and 76% depending on the engine and query type.</p>

<h2>Why AI Gets Your Brand Wrong</h2>
<p>Three failure modes produce most brand hallucinations.</p>
<p><strong>Conflicting sources.</strong> If your website says one thing, an old press release from 2023 says another, and a third-party review site scraped from that press release says a third, the model tries to resolve the conflict by picking the most plausible version. It often picks the wrong one. Pricing, feature lists, and product names are the most common casualties.</p>
<p><strong>Missing entity signals.</strong> When AI engines build a picture of your brand, they need clear, consistent entity declarations: your official name, product category, audience, key people, and how you relate to other known brands. If these are absent from your schema, missing from your main pages, or inconsistent across your site, the engine infers what it can and invents what it cannot.</p>
<p><strong>Training data lag.</strong> Every AI engine has a knowledge cutoff from its last training cycle. A product launch from six months ago may simply not exist in the model's world yet.</p>

<h2>The Detection Audit</h2>
<p>A real detection pass covers the prompt types where brand-specific inaccuracies are most damaging:</p>
<ul>
  <li><strong>Branded definition prompts.</strong> "What is [Your Brand]?" "What does [Your Brand] do?" These test whether the model has an accurate baseline picture.</li>
  <li><strong>Product and feature prompts.</strong> "What are the features of [Product Name]?" "Does [Your Brand] have [specific feature]?" "What does [Product Name] cost?" These are the prompts where outdated information causes direct commercial damage.</li>
  <li><strong>Comparison prompts.</strong> "[Your Brand] vs [Competitor]." These test whether the model correctly distinguishes you from competitors.</li>
  <li><strong>Category recommendation prompts.</strong> "Best tools for [category your brand serves]." These test whether you appear in recommendation answers and in what context.</li>
</ul>
<p>Run each prompt type across at least three engines: ChatGPT, Perplexity, and Claude. Document exactly what each engine says and which sources it cites. Save outputs in a hallucination register with the date, prompt, engine, inaccuracy type, and commercial impact severity.</p>

<h2>Why Updating Your Website Alone Does Not Fix It</h2>
<p>The instinct when you find a brand hallucination is to update your website. That is necessary but not sufficient. Training data does not update in real time for closed models. The incorrect information will continue appearing in model memory until the next training cycle incorporates the corrected version, which can take months. In the meantime, the problem persists in live retrieval if the sources feeding that retrieval still contain the old information.</p>
<p>The more important intervention is fixing the third-party source layer. If Crunchbase still shows your old product description, if a comparison article from 2023 still lists discontinued pricing tiers, those sources are feeding the incorrect answer. The engine is not making things up: it is accurately reflecting what the most-cited sources say, and those sources happen to be wrong.</p>

<h2>The Fix Sequence</h2>
<ul>
  <li><strong>Owned content first.</strong> Your homepage, About page, pricing page, product feature pages, and FAQ page each need to state your core brand facts in a format a retrieval system can extract cleanly. Add or update Organisation schema with current information and current sameAs links.</li>
  <li><strong>High-authority third-party profiles.</strong> Check and correct Crunchbase, LinkedIn, G2, Capterra, Clutch. Pay attention to product category fields, pricing information, and key personnel.</li>
  <li><strong>Historical content.</strong> Search for your brand name combined with terms from the hallucinated answer. Find the page making the incorrect association. Contact the site owner or redirect and update your own page.</li>
  <li><strong>Authoritative new content.</strong> For persistent hallucinations, publish a structured page specifically designed to answer the question the AI is getting wrong. Within 14 days in documented cases, AI engines updated their answers after a new, clearly structured page was indexed.</li>
</ul>

<div class="callout"><p>Track your target prompts weekly throughout the correction process. The NotioncCue Prompt Tracker surfaces changes in how your brand is described across engines on each tracked prompt, so you can confirm when a hallucination has resolved rather than guessing.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POST 16 — Local Business AEO
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug:           'local-business-aeo-physical-location',
    emoji:          '📍',
    bg:             'rgba(74,222,128,.06)',
    tag:            'AEO Strategy',
    date:           'Jun 14, 2026',
    title:          'Local Business AEO: What Changes When You Have a Physical Location',
    excerpt:        '59% of ChatGPT searches involve local intent. AI Overviews appear in 92–97% of local informational queries. Most local businesses have no strategy for appearing in those answers. Here is what actually works.',
    read:           '9 min read',
    author:         'Sudhir Singh',
    authorRole:     'Senior SEO & AEO Specialist · NotioncCue',
    authorInitials: 'SS',
    content: `
<p>A buyer in Delhi asks ChatGPT for the best biometric hardware supplier nearby. A homeowner asks Perplexity which plumber handles emergency callouts in their area. A patient asks Google AI Overviews which dental clinic takes walk-ins on weekends.</p>
<p>These are local queries with a physical answer. 59% of ChatGPT searches involve local intent, while AI Overviews appear in 92 to 97% of local informational queries. Most local businesses have no strategy for appearing in those answers.</p>

<h2>What Makes Local AEO Different</h2>
<p>Standard AEO asks: can AI systems extract an accurate answer from your content and attribute it to your brand? Local AEO adds a second question: can AI systems confirm you operate in the location the buyer is asking about?</p>
<p>You can have perfect schema, a well-structured website, and excellent reviews, and still be invisible in local AI answers if the geographic signals that confirm your service area are weak, inconsistent, or absent. AI engines building a local recommendation answer need to know what your business does, where you are, where you serve, whether you are currently open, and whether other sources corroborate that you actually operate there.</p>

<h2>Your Google Business Profile Is Now a Data Feed</h2>
<p>In 2026, GBP data is one of the most heavily weighted inputs AI systems use when composing local answers. Your categories, service descriptions, hours, attributes, photos, reviews, and Q&A section are machine-readable signals teaching AI what to say about you when someone asks.</p>
<p>Three things most local businesses get wrong with GBP in the AEO context:</p>
<ul>
  <li><strong>Staleness.</strong> Profiles with no fresh photos or posts in over 30 days can see significant drops in AI Overview impressions. Update your profile with at least one new photo or post weekly.</li>
  <li><strong>Thin service descriptions.</strong> A GBP listing that says "Plumbing Services" with no further detail is not extractable. Write each service description as a direct answer to "what do you offer" — two to four sentences naming the service, describing what it covers, and specifying relevant locations.</li>
  <li><strong>Unanswered Q&A.</strong> The Q&A section feeds directly into AI answers for local queries. Answer every question and add your own frequently asked questions proactively, written in the conversational phrasing your customers actually use.</li>
</ul>

<h2>LocalBusiness Schema: What Most Sites Miss</h2>
<p>The <code>geo</code> field with precise latitude and longitude coordinates is what most local business sites miss. It is the signal that directly enables geo-specific AI answers. The <code>areaServed</code> array is equally important for service businesses that cover a wider area than their physical premises.</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your Business Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Street",
    "addressLocality": "Your City",
    "addressRegion": "Your Region",
    "postalCode": "Your Postcode",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "28.4744",
    "longitude": "77.5040"
  },
  "areaServed": [
    {"@type": "City", "name": "Delhi"},
    {"@type": "City", "name": "Noida"},
    {"@type": "City", "name": "Gurugram"}
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "09:30",
    "closes": "18:30"
  }]
}</code></pre>

<h2>Reviews: What AI Actually Reads in Them</h2>
<p>AI engines do not just count stars. They read review text. When Perplexity or ChatGPT recommends a local business, the language it uses to describe you is often extracted directly from what your reviewers have written.</p>
<p>A review that says "Great service" is not citable. A review that says "Fast turnaround on fingerprint scanner installation at our Sector 62 Noida office, everything was up within three hours" is a citation target. It names the service, the specific outcome, and the location.</p>
<p>You cannot script reviews. You can guide the experience. After a successful job, frame the feedback request around the specific work done and the location: "We'd really appreciate a review mentioning what we installed and where, so other businesses in [area] know what to expect."</p>

<h2>Geo-Specific Prompt Tracking</h2>
<p>For a local service business, a starter prompt set to track weekly:</p>
<ul>
  <li>"Best [service type] in [City]?"</li>
  <li>"Who does [specific service] in [area]?"</li>
  <li>"Which [business type] is open now in [area]?"</li>
  <li>"Emergency [service] in [city] tonight?"</li>
  <li>"Who are the top [business type] suppliers in [city]?"</li>
</ul>
<p>Run each prompt across ChatGPT, Perplexity, and Google AI Overviews. Note whether your brand appears, what it says about you, and which competitor shows up when you do not. Any prompt where a competitor appears and you do not is a specific gap with a specific fix.</p>

<div class="callout"><p>A Toronto plumber followed a local AEO playbook for 90 days. Before AEO, ChatGPT did not mention them for any local prompt. After implementing LocalBusiness schema with GeoCoordinates, completing their GBP, and tracking 20 local prompts weekly, they appeared in 14 of 20 tracked prompts for emergency plumbing queries in their service area within four months.</p></div>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ➕ ADD NEW POSTS BELOW THIS LINE
  // Copy the block above, change the fields, save. Done.
  // ─────────────────────────────────────────────────────────────────────────
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getRelatedPosts(currentSlug: string, currentTag: string, count = 2): BlogPost[] {
  const sameTag = BLOG_POSTS.filter(p => p.slug !== currentSlug && p.tag === currentTag)
  const others  = BLOG_POSTS.filter(p => p.slug !== currentSlug && p.tag !== currentTag)
  return [...sameTag, ...others].slice(0, count)
}

// All unique tags — useful for a filter UI
export const BLOG_TAGS = [...new Set(BLOG_POSTS.map(p => p.tag))]