export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL required' }, { status: 400 })

    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`
    const domain = new URL(targetUrl).hostname

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // 1. Try to fetch sitemap
    let pages: { url: string; slug: string }[] = []

    const sitemapUrls = [
      `https://${domain}/sitemap.xml`,
      `https://${domain}/sitemap_index.xml`,
      `https://www.${domain}/sitemap.xml`,
    ]

    for (const sitemapUrl of sitemapUrls) {
      try {
        const res = await fetch(sitemapUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) continue
        const xml = await res.text()
        const matches = xml.match(/<loc>(.*?)<\/loc>/g) || []
        pages = matches
          .map(m => m.replace(/<\/?loc>/g, '').trim())
          .filter(u => u.includes(domain))
          .slice(0, 30)
          .map(u => ({
            url: u,
            slug: u.replace(`https://${domain}`, '').replace(`https://www.${domain}`, '') || '/',
          }))
        if (pages.length > 0) break
      } catch { continue }
    }

    // Fallback: use the root URL only
    if (pages.length === 0) {
      pages = [{ url: targetUrl, slug: '/' }]
    }

    // 2. Ask AI to score each page for AEO citation potential
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an AEO expert. Score web pages for AI citation potential based on their URL slug and content type. Always respond with valid JSON only — no markdown, no code fences.',
          },
          {
            role: 'user',
            content: `Score these pages from "${domain}" for AI citation potential across 6 engines.

Pages to score:
${pages.map((p, i) => `${i + 1}. ${p.slug}`).join('\n')}

For each page, infer the content type from the URL slug and score it.

Return ONLY this JSON:
{
  "domain": "${domain}",
  "total_pages": ${pages.length},
  "overall_aeo_score": <0-100 average>,
  "pages": [
    {
      "slug": "<exact slug from list>",
      "full_url": "<full URL>",
      "page_type": "<homepage|blog|product|service|about|contact|docs|landing|resource|other>",
      "citation_score": <0-100>,
      "citation_band": "<high|medium|low>",
      "engines_likely": ["<engine name>"],
      "primary_issue": "<single biggest AEO issue for this page type>",
      "quick_fix": "<single most impactful fix>"
    }
  ],
  "summary": {
    "high_count": <pages scoring 70+>,
    "medium_count": <pages scoring 40-69>,
    "low_count": <pages scoring below 40>,
    "top_opportunity": "<slug of the page with most citation potential if fixed>",
    "biggest_gap": "<the most common AEO issue across all pages>"
  }
}`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text.replace(/```json|```/g, '').trim())

    // Merge full URLs back in
    data.pages = data.pages?.map((p: any) => {
      const match = pages.find(pg => pg.slug === p.slug || pg.slug === p.slug + '/')
      return { ...p, full_url: match?.url || `https://${domain}${p.slug}` }
    })

    return Response.json(data)
  } catch (err) {
    console.error('Heatmap error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}