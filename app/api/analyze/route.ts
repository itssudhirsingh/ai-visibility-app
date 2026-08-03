// app/api/analyze/route.ts
// AI Visibility Scanner — real page fetch + multi-signal AEO analysis
// Uses NVIDIA DeepSeek-V4-Flash → Groq fallback → OpenAI fallback

export const maxDuration = 60 // Vercel Pro: 60s. Hobby: change to 10

export async function POST(req: Request) {
  try {
    // ── Parse body ──────────────────────────────────────────────────────────
    let body: Record<string, string>
    try { body = await req.json() }
    catch { return resp({ error: 'Invalid JSON body' }, 400) }

    const { url, country = 'Global' } = body
    if (!url) return resp({ error: 'URL is required' }, 400)

    // ── Pick API key + provider ─────────────────────────────────────────────
    const nvidiaKey = process.env.NVIDIA_API_KEY
    const groqKey   = process.env.GROQ_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!nvidiaKey && !groqKey && !openaiKey) {
      return resp({ error: 'No AI API key configured. Add NVIDIA_API_KEY, GROQ_API_KEY or OPENAI_API_KEY to Vercel environment variables.' }, 500)
    }

    // ── Normalise URL ───────────────────────────────────────────────────────
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    // ── Fetch target page ───────────────────────────────────────────────────
    let pageHtml = ''
    let pageText = ''
    let fetchWarning = ''
    try {
      const pageRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0; +https://notioncue.com)' },
        signal: AbortSignal.timeout(7000),
      })
      pageHtml = await pageRes.text()
      pageText = pageHtml
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000)
    } catch (e) {
      fetchWarning = `Could not fetch ${targetUrl} — using URL-based inference only.`
      pageText = `Domain: ${url}. Could not fetch page content.`
    }

    // ── Quick HTML signal checks ────────────────────────────────────────────
    const hasFaqSchema     = /FAQPage/i.test(pageHtml)
    const hasHowToSchema   = /HowTo/i.test(pageHtml)
    const hasOrgSchema     = /Organization|WebSite/i.test(pageHtml)
    const hasBreadcrumb    = /BreadcrumbList/i.test(pageHtml)
    const hasSSL           = targetUrl.startsWith('https')
    const hasGPTBot        = /GPTBot/i.test(pageHtml)
    const hasPerplexityBot = /PerplexityBot/i.test(pageHtml)

    // Check llms.txt separately (quick HEAD request)
    let hasLlmsTxt = false
    try {
      const r = await fetch(`${targetUrl}/llms.txt`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      })
      hasLlmsTxt = r.ok
    } catch { /* not found */ }

    // ── Build prompt ────────────────────────────────────────────────────────
    const systemPrompt = 'You are an expert AI visibility and AEO analyst. Respond with valid JSON only — no markdown, no code fences, no extra text before or after the JSON.'

    const userPrompt = `Analyse the AI visibility of this brand/domain: "${url}" targeting region: "${country}"

Page content (first 4000 chars):
"""
${pageText}
"""

Technical signals detected from the live page:
- HTTPS/SSL: ${hasSSL}
- FAQPage schema: ${hasFaqSchema}
- HowTo schema: ${hasHowToSchema}
- Organization/WebSite schema: ${hasOrgSchema}
- BreadcrumbList schema: ${hasBreadcrumb}
- llms.txt file present: ${hasLlmsTxt}
- GPTBot allowed: ${hasGPTBot}
- PerplexityBot allowed: ${hasPerplexityBot}
- Region: ${country}

Return ONLY valid JSON matching this exact structure (no extra fields, no markdown):
{
  "score": <integer 1-100>,
  "mentions": <integer, estimated monthly AI mentions>,
  "sentiment": "<positive|neutral|negative>",
  "engines_citing": "<X/6>",
  "country": "${country}",
  "engines": [
    {"n":"ChatGPT",   "s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<2 sentence description>","citations":["<one short citation snippet>"]},
    {"n":"Perplexity","s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<description>","citations":["<snippet>"]},
    {"n":"Gemini",    "s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<description>","citations":["<snippet>"]},
    {"n":"Claude",    "s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<description>","citations":["<snippet>"]},
    {"n":"Grok",      "s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<description>","citations":["<snippet>"]},
    {"n":"Copilot",   "s":<1-100>,"sentiment":"<positive|neutral|negative>","status":"<CITED|NOT CITED|LOW>","desc":"<description>","citations":["<snippet>"]}
  ],
  "comps": [
    {"n":"<real competitor domain>","s":<1-100>,"mentions":<integer>,"gap":"<specific gap vs analysed site>"},
    {"n":"<competitor 2>","s":<1-100>,"mentions":<integer>,"gap":"<gap>"},
    {"n":"<competitor 3>","s":<1-100>,"mentions":<integer>,"gap":"<gap>"}
  ],
  "fixes": [
    {"priority":"HIGH","title":"<fix title>","desc":"<1-2 sentence actionable fix>"},
    {"priority":"HIGH","title":"<fix title>","desc":"<fix>"},
    {"priority":"MED","title":"<fix title>","desc":"<fix>"},
    {"priority":"LOW","title":"<fix title>","desc":"<fix>"}
  ],
  "eeat": {"experience":<0-100>,"expertise":<0-100>,"authority":<0-100>,"trust":<0-100>},
  "schema": [
    {"label":"FAQPage schema","status":"${hasFaqSchema ? 'pass' : 'fail'}"},
    {"label":"HowTo schema","status":"${hasHowToSchema ? 'pass' : 'fail'}"},
    {"label":"Organization schema","status":"${hasOrgSchema ? 'pass' : 'fail'}"},
    {"label":"BreadcrumbList","status":"${hasBreadcrumb ? 'pass' : 'fail'}"},
    {"label":"GPTBot access","status":"${hasGPTBot ? 'pass' : 'fail'}"},
    {"label":"PerplexityBot access","status":"${hasPerplexityBot ? 'pass' : 'fail'}"},
    {"label":"HTTPS/SSL","status":"${hasSSL ? 'pass' : 'fail'}"}
  ],
  "llms_txt": {"exists":${hasLlmsTxt},"valid":${hasLlmsTxt},"content":""},
  "bluf": {"score":<0-100>,"headline":"<actual H1 or title from page>","issues":["<issue 1>","<issue 2>"]},
  "query_probes": [
    {"engine":"ChatGPT","query":"<realistic buyer question for this niche>","volume":"<high|medium|low>","response":"<2-3 sentence realistic AI response — cite brand if score>=60>","cited":<true|false>,"position":<1-5 or null>},
    {"engine":"Perplexity","query":"<different realistic question>","volume":"<high|medium|low>","response":"<realistic response>","cited":<true|false>,"position":<1-5 or null>},
    {"engine":"Gemini","query":"<different question>","volume":"<high|medium|low>","response":"<response>","cited":<true|false>,"position":<1-5 or null>},
    {"engine":"Grok","query":"<different question>","volume":"<high|medium|low>","response":"<response>","cited":<true|false>,"position":<1-5 or null>}
  ],
  "weekly_trend": [
    {"week":"W1","score":<score minus 4-8>},
    {"week":"W2","score":<score minus 2-4>},
    {"week":"W3","score":<score minus 1-2>},
    {"week":"W4","score":<current score>}
  ],
  "opportunities": [
    {"query":"<query where competitor cited instead of you>","volume":"high","competitor":"<competitor domain>"},
    {"query":"<query>","volume":"medium","competitor":"<competitor>"},
    {"query":"<query>","volume":"medium","competitor":"<competitor>"}
  ]
}`

    // ── Call AI with provider waterfall ─────────────────────────────────────
    const result = await callWithWaterfall(userPrompt, systemPrompt, { nvidiaKey, groqKey, openaiKey })

    if ('error' in result) {
      return resp({ error: result.error }, 502)
    }

    // Attach fetch warning if page couldn't be loaded
    if (fetchWarning) result.fetch_warning = fetchWarning

    return resp(result, 200)

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected server error'
    console.error('[analyze] unhandled error:', msg)
    return resp({ error: msg }, 500)
  }
}

// ── Provider waterfall ───────────────────────────────────────────────────────
async function callWithWaterfall(
  userPrompt: string,
  systemPrompt: string,
  keys: { nvidiaKey?: string; groqKey?: string; openaiKey?: string }
): Promise<Record<string, unknown> & { error?: string }> {
  const providers = []

  if (keys.nvidiaKey) providers.push({
    name: 'NVIDIA',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    key: keys.nvidiaKey,
    model: 'deepseek-ai/deepseek-v4-flash',
    maxTokens: 4096,
  })
  if (keys.groqKey) providers.push({
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    key: keys.groqKey,
    model: 'llama-3.3-70b-versatile',
    maxTokens: 4096,
  })
  if (keys.openaiKey) providers.push({
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    key: keys.openaiKey,
    model: 'gpt-4o-mini',
    maxTokens: 4096,
  })

  if (providers.length === 0) {
    return { error: 'No AI provider configured. Add NVIDIA_API_KEY, GROQ_API_KEY or OPENAI_API_KEY.' }
  }

  let lastError = ''

  for (const provider of providers) {
    try {
      const res = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: provider.maxTokens,
        }),
        signal: AbortSignal.timeout(45000), // 45s per provider
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        lastError = `${provider.name} ${res.status}: ${errText.slice(0, 200)}`
        console.warn(`[analyze] ${provider.name} failed:`, lastError)
        continue // try next provider
      }

      const json = await res.json()
      const raw = json?.choices?.[0]?.message?.content ?? ''

      if (!raw) {
        lastError = `${provider.name} returned empty content`
        continue
      }

      // Parse JSON from the AI response
      const parsed = parseAIJson(raw)
      if (parsed) {
        console.log(`[analyze] success via ${provider.name}`)
        return parsed
      }

      lastError = `${provider.name} returned unparseable JSON`
      console.warn(`[analyze] parse failed for ${provider.name}:`, raw.slice(0, 300))

    } catch (e: unknown) {
      lastError = `${provider.name}: ${e instanceof Error ? e.message : String(e)}`
      console.warn(`[analyze] ${provider.name} threw:`, lastError)
    }
  }

  return { error: `All AI providers failed. Last error: ${lastError}` }
}

// ── JSON extraction + repair ─────────────────────────────────────────────────
function parseAIJson(raw: string): Record<string, unknown> | null {
  // 1. Strip markdown fences
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // 2. Extract first {...} block
  const start = cleaned.indexOf('{')
  const end   = cleaned.lastIndexOf('}')
  if (start !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1)
  }

  // 3. Try parsing as-is
  try { return JSON.parse(cleaned) } catch { /* continue */ }

  // 4. Repair trailing commas
  const repaired = cleaned.replace(/,(\s*[}\]])/g, '$1')
  try { return JSON.parse(repaired) } catch { /* continue */ }

  // 5. Try to close truncated JSON
  const closed = repaired + '"}]}}'
  try { return JSON.parse(closed) } catch { /* give up */ }

  return null
}

// ── Response helper ──────────────────────────────────────────────────────────
function resp(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}