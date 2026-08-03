import { callAIForJson, aiErrorResponse } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url, country = 'Global' } = body
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
      system: 'You are an expert AI visibility and AEO analyst. Always respond with valid JSON only — no markdown, no code fences, no extra text.',
      user: `Analyse the AI visibility of this brand/domain: "${url}" in the region: "${country}"

Real page content:
"""
${pageText}
"""

Technical signals from the actual page:
- HTTPS/SSL: ${hasSSL}
- FAQPage schema: ${hasFaqSchema}
- HowTo schema: ${hasHowToSchema}
- Organization/WebSite schema: ${hasOrgSchema}
- BreadcrumbList schema: ${hasBreadcrumb}
- llms.txt file: ${hasLlmsTxt}
- robots.txt mentions: ${hasRobotsTxt}
- GPTBot access: ${hasGPTBot}
- PerplexityBot access: ${hasPerplexityBot}
- Country/Region: ${country}

Return ONLY this exact JSON:

{
  "score": <number 1-100>,
  "mentions": <estimated monthly AI mentions>,
  "sentiment": "<positive|neutral|negative>",
  "engines_citing": "<X/6>",
  "country": "${country}",
  "engines": [
    {"n": "ChatGPT",    "s": <score 1-100>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<2-3 sentence description>", "citations": ["<snippet>"]},
    {"n": "Perplexity", "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Gemini",     "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Claude",     "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Grok",       "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Copilot",    "s": <score>,       "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]}
  ],
  "comps": [
    {"n": "<real competitor domain>", "s": <score>, "mentions": <number>, "gap": "<specific gap vs analysed site>"},
    {"n": "<real competitor domain>", "s": <score>, "mentions": <number>, "gap": "<specific gap>"},
    {"n": "<real competitor domain>", "s": <score>, "mentions": <number>, "gap": "<specific gap>"}
  ],
  "fixes": [
    {"priority": "HIGH", "title": "<fix title>", "desc": "<actionable description>"},
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
  "llms_txt": {"exists": ${hasLlmsTxt}, "valid": ${hasLlmsTxt}, "content": "<first 300 chars if exists, else empty>"},
  "bluf": {"score": <0-100>, "headline": "<actual H1 from page or paraphrase>", "issues": ["<specific issue>", "<issue>"]},
  "query_probes": [
    {
      "engine": "ChatGPT",
      "query": "<realistic question someone would ask about this niche>",
      "volume": "<high|medium|low>",
      "response": "<realistic 2-3 sentence AI response — mention brand if score>=65, otherwise cite a competitor>",
      "cited": <true|false>,
      "position": <1-5 or null if not cited>
    },
    {
      "engine": "Perplexity",
      "query": "<different realistic question for this niche>",
      "volume": "<high|medium|low>",
      "response": "<realistic AI response>",
      "cited": <true|false>,
      "position": <1-5 or null>
    },
    {
      "engine": "Gemini",
      "query": "<different realistic question>",
      "volume": "<high|medium|low>",
      "response": "<realistic AI response>",
      "cited": <true|false>,
      "position": <1-5 or null>
    },
    {
      "engine": "Grok",
      "query": "<different realistic question>",
      "volume": "<high|medium|low>",
      "response": "<realistic AI response>",
      "cited": <true|false>,
      "position": <1-5 or null>
    }
  ],
  "weekly_trend": [
    {"week": "W1", "score": <score minus 3-8>},
    {"week": "W2", "score": <score minus 1-4>},
    {"week": "W3", "score": <score minus 1-2>},
    {"week": "W4", "score": <current score>}
  ],
  "opportunities": [
    {"query": "<high-volume prompt where competitors are cited but not you>", "volume": "high", "competitor": "<who shows up instead>"},
    {"query": "<prompt>", "volume": "medium", "competitor": "<competitor>"},
    {"query": "<prompt>", "volume": "medium", "competitor": "<competitor>"}
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

async function checkUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(4000) })
    return res.ok
  } catch {
    return false
  }
}