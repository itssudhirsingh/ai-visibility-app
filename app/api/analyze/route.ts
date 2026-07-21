import { callAIForJson, aiErrorResponse } from '@/lib/ai'

// Allow the serverless function to run for up to 60 seconds
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL is required' }, { status: 400 })

    const apiKey = process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // ── 1. Fetch real page content ──────────────────────────────────────────
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    let pageText = ''
    let pageHtml = ''
    try {
      const pageRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0; +https://notioncue.com)' },
        signal: AbortSignal.timeout(8000),
      })
      pageHtml = await pageRes.text()
      pageText = pageHtml
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000)
    } catch {
      // Page fetch failed — model will work from domain name only
      pageText = `Could not fetch page content for ${url}.`
    }

    // ── 2. Quick HTML signal checks ─────────────────────────────────────────
    const hasLlmsTxt       = await checkUrl(`${targetUrl}/llms.txt`)
    const hasRobotsTxt     = pageHtml ? /robots/i.test(pageHtml) : false
    const hasFaqSchema     = /FAQPage/i.test(pageHtml)
    const hasHowToSchema   = /HowTo/i.test(pageHtml)
    const hasOrgSchema     = /Organization|WebSite/i.test(pageHtml)
    const hasBreadcrumb    = /BreadcrumbList/i.test(pageHtml)
    const hasSSL           = targetUrl.startsWith('https')
    const hasGPTBot        = /GPTBot/i.test(pageHtml)
    const hasPerplexityBot = /PerplexityBot/i.test(pageHtml)

    // ── 3. Call AI model ────────────────────────────────────────────────────
    const data = await callAIForJson<Record<string, unknown>>({
      apiKey,
      system: 'You are an expert SEO AI visibility and AEO analyst. Always respond with valid JSON only — no markdown, no code fences, no extra text.',
      user: `Analyse the AI visibility of this brand/domain: "${url}"

Real page content detected:
"""
${pageText}
"""

Technical signals detected from the actual page:
- HTTPS/SSL: ${hasSSL}
- FAQPage schema: ${hasFaqSchema}
- HowTo schema: ${hasHowToSchema}
- Organization/WebSite schema: ${hasOrgSchema}
- BreadcrumbList schema: ${hasBreadcrumb}
- llms.txt file: ${hasLlmsTxt}
- robots.txt mentions: ${hasRobotsTxt}
- GPTBot access: ${hasGPTBot}
- PerplexityBot access: ${hasPerplexityBot}

Use the page content and detected signals above to produce ACCURATE analysis. Do NOT rely solely on brand reputation.

Return ONLY this exact JSON structure:

{
  "score": <number 1-100, overall AEO score based on page content and signals>,
  "mentions": <estimated monthly AI mentions, be conservative if unknown brand>,
  "sentiment": "<positive|neutral|negative>",
  "engines_citing": "<X/6>",
  "engines": [
    {"n": "ChatGPT",    "s": <score 1-100>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<2-3 sentence description based on page content>", "citations": ["<snippet from actual page>"]},
    {"n": "Perplexity", "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Gemini",     "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Claude",     "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Grok",       "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Copilot",    "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]}
  ],
  "comps": [
    {"n": "<real competitor domain in same space>", "s": <score>, "gap": "<specific gap vs the analysed site>"},
    {"n": "<real competitor domain>",               "s": <score>, "gap": "<specific gap>"},
    {"n": "<real competitor domain>",               "s": <score>, "gap": "<specific gap>"}
  ],
  "fixes": [
    {"priority": "HIGH", "title": "<fix title>", "desc": "<actionable description based on detected signals>"},
    {"priority": "HIGH", "title": "<fix title>", "desc": "<actionable description>"},
    {"priority": "MED",  "title": "<fix title>", "desc": "<actionable description>"},
    {"priority": "LOW",  "title": "<fix title>", "desc": "<actionable description>"}
  ],
  "eeat": {"experience": <0-100>, "expertise": <0-100>, "authority": <0-100>, "trust": <0-100>},
  "schema": [
    {"label": "FAQPage schema",        "status": "${hasFaqSchema     ? 'pass' : 'fail'}"},
    {"label": "HowTo schema",          "status": "${hasHowToSchema   ? 'pass' : 'fail'}"},
    {"label": "Organization schema",   "status": "${hasOrgSchema     ? 'pass' : 'fail'}"},
    {"label": "BreadcrumbList",        "status": "${hasBreadcrumb    ? 'pass' : 'fail'}"},
    {"label": "robots.txt AI bots",    "status": "${hasRobotsTxt     ? 'pass' : 'fail'}"},
    {"label": "PerplexityBot access",  "status": "${hasPerplexityBot ? 'pass' : 'fail'}"},
    {"label": "GPTBot access",         "status": "${hasGPTBot        ? 'pass' : 'fail'}"}
  ],
  "llms_txt": {"exists": ${hasLlmsTxt}, "valid": ${hasLlmsTxt}, "content": "<first 300 chars of llms.txt if it exists, else empty string>"},
  "bluf": {"score": <0-100>, "headline": "<actual H1 text from page or paraphrase>", "issues": ["<specific issue from actual content>", "<issue>"]},
  "weekly_trend": [
    {"week": "W1", "score": <score minus 3-8 points>},
    {"week": "W2", "score": <score minus 1-4 points>},
    {"week": "W3", "score": <score minus 1-2 points>},
    {"week": "W4", "score": <current score>}
  ],
  "query_probes": [
    {"engine": "ChatGPT",    "query": "<realistic query someone would ask about this site's topic>", "response": "<realistic AI response excerpt, mention brand if score>=65>", "cited": <true|false>},
    {"engine": "Perplexity", "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>},
    {"engine": "Gemini",     "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>},
    {"engine": "Grok",       "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>}
  ]
}`,
      temperature: 0.2,
      maxTokens: 4096,
    })

    return Response.json(data)

  } catch (err) {
    return aiErrorResponse(err)
  }
}

// ── Helper: HEAD check for a URL ─────────────────────────────────────────────
async function checkUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}