export async function POST(req: Request) {
  try {
    const { url, schema_type } = await req.json()
    if (!url) return Response.json({ error: 'URL required' }, { status: 400 })

    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // Fetch page content
    let pageText = ''
    try {
      const pageRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
        signal: AbortSignal.timeout(8000)
      })
      const html = await pageRes.text()
      pageText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000)
    } catch (e) {
      pageText = ''
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are a structured data and schema markup expert specialising in AEO. Always respond with valid JSON only — no markdown, no code fences.' },
          { role: 'user', content: `Generate schema markup for "${targetUrl}".
${schema_type ? `Requested schema type: ${schema_type}` : 'Auto-detect the best schema types from the page content.'}

Page content:
"""${pageText.slice(0, 3000)}"""

Return ONLY this JSON:
{
  "page_type": "<what type of page this is — product, blog, homepage, service, etc.>",
  "recommended_schemas": ["<schema type>", "<schema type>", "<schema type>"],
  "schemas": [
    {
      "type": "<FAQPage|Organization|Article|Product|HowTo|BreadcrumbList|WebSite>",
      "priority": "HIGH|MED|LOW",
      "reason": "<1 sentence — why this schema improves AEO for this page>",
      "json_ld": <valid JSON-LD object — a real, complete, filled-in schema object using content from the page, not a template with placeholders>
    }
  ],
  "implementation_note": "<1-2 sentences on where to add these in the page HTML>",
  "aeo_impact": "<estimated improvement in AI citation rate with these schemas applied>"
}

IMPORTANT: The json_ld fields must be real, filled-in schema objects using actual content from the page. Do not use placeholder text like [Your Name] or TODO.` }
        ],
        max_tokens: 3000,
        temperature: 0.2
      })
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Response.json({ ...data, url: targetUrl })

  } catch (err) {
    console.error('Schema generator error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}