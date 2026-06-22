export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL required' }, { status: 400 })

    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    // 1. Fetch PageSpeed Insights (free, no key needed for basic)
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile`
    let cwv: any = null
    let psiError = ''

    try {
      const psiRes = await fetch(psiUrl, { signal: AbortSignal.timeout(15000) })
      const psiData = await psiRes.json()
      const cats = psiData.lighthouseResult?.categories
      const audits = psiData.lighthouseResult?.audits

      cwv = {
        performance: Math.round((cats?.performance?.score ?? 0) * 100),
        lcp: audits?.['largest-contentful-paint']?.displayValue ?? 'N/A',
        lcp_score: audits?.['largest-contentful-paint']?.score ?? 0,
        fid: audits?.['total-blocking-time']?.displayValue ?? 'N/A',
        cls: audits?.['cumulative-layout-shift']?.displayValue ?? 'N/A',
        cls_score: audits?.['cumulative-layout-shift']?.score ?? 0,
        ttfb: audits?.['server-response-time']?.displayValue ?? 'N/A',
        ttfb_score: audits?.['server-response-time']?.score ?? 0,
        speed_index: audits?.['speed-index']?.displayValue ?? 'N/A',
        render_blocking: audits?.['render-blocking-resources']?.details?.items?.length ?? 0,
        js_size: audits?.['unused-javascript']?.displayValue ?? 'N/A',
      }
    } catch (e) {
      psiError = 'Could not fetch PageSpeed data — using URL analysis only.'
    }

    // 2. Send to DeepSeek to interpret in AEO terms
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    const prompt = cwv
      ? `You are an AEO (Answer Engine Optimisation) expert. Analyse these Core Web Vitals for "${targetUrl}" and explain their impact on AI engine citation rates — specifically Perplexity, ChatGPT (browse mode), and Gemini.

Core Web Vitals data:
- Performance score: ${cwv.performance}/100
- LCP (Largest Contentful Paint): ${cwv.lcp} (score: ${cwv.lcp_score})
- TBT (Total Blocking Time, proxy for FID): ${cwv.fid}
- CLS (Cumulative Layout Shift): ${cwv.cls} (score: ${cwv.cls_score})
- TTFB (Time to First Byte): ${cwv.ttfb} (score: ${cwv.ttfb_score})
- Speed Index: ${cwv.speed_index}
- Render-blocking resources: ${cwv.render_blocking}
- Unused JS: ${cwv.js_size}`
      : `You are an AEO expert. Analyse the domain "${targetUrl}" for page speed AEO impact based on the URL and domain alone (PageSpeed data unavailable). Provide estimated AEO impact.`

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are an AEO expert. Always respond with valid JSON only — no markdown, no code fences.' },
          { role: 'user', content: `${prompt}

Return ONLY this JSON:
{
  "aeo_speed_score": <0-100, overall AEO speed health>,
  "summary": "<2-3 sentence plain-English summary of how this site's speed affects AI citation rates>",
  "engine_impact": [
    {"engine": "Perplexity", "impact": "<high|medium|low>", "reason": "<1 sentence — why speed matters specifically for Perplexity citation>"},
    {"engine": "ChatGPT Browse", "impact": "<high|medium|low>", "reason": "<1 sentence>"},
    {"engine": "Gemini", "impact": "<high|medium|low>", "reason": "<1 sentence>"}
  ],
  "fixes": [
    {"priority": "HIGH", "title": "<fix title>", "desc": "<specific actionable fix>", "aeo_gain": "<estimated AEO benefit>"},
    {"priority": "HIGH", "title": "<fix title>", "desc": "<specific actionable fix>", "aeo_gain": "<estimated AEO benefit>"},
    {"priority": "MED", "title": "<fix title>", "desc": "<specific actionable fix>", "aeo_gain": "<estimated AEO benefit>"}
  ]
}` }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Response.json({ ...data, cwv, psi_error: psiError, url: targetUrl })

  } catch (err) {
    console.error('PageSpeed AEO error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}