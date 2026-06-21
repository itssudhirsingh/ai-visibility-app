export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL is required' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // Normalize URL
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    // Fetch the page content first
    let pageText = ''
    try {
      const pageRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
        signal: AbortSignal.timeout(8000)
      })
      const html = await pageRes.text()
      // Strip tags, scripts, styles — keep readable text only
      pageText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 6000)
    } catch (fetchErr) {
      // If fetch fails, let the model work from the URL/domain alone
      pageText = ''
    }

    const apiPrompt = pageText
      ? `Here is the raw text content extracted from the webpage at "${targetUrl}":\n\n"""${pageText}"""\n\nBased on this actual page content, write 3 BLUF (Bottom Line Up Front) summaries.`
      : `I could not fetch the page content for "${targetUrl}" directly. Based on the domain name and URL structure alone, infer what this brand/page likely does and write 3 BLUF summaries. Be clear in your response that this is an inferred best-guess since page content wasn't available.`

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AEO content strategist. You write BLUF (Bottom Line Up Front) summaries — the opening 30-50 words of a page that state the core answer immediately, in plain conversational language, optimised for AI engines like ChatGPT and Perplexity to quote directly. Always respond with valid JSON only — no markdown, no code fences, no extra text.'
          },
          {
            role: 'user',
            content: `${apiPrompt}

Write exactly 3 BLUF summary options, each 30-50 words, each in a genuinely different angle:

1. DIRECT — states plainly what the page/product/brand is and does, no fluff, fact-first.
2. BENEFIT-LED — opens with the core value or outcome for the reader/user, not the product description.
3. QUESTION-LED — opens by implicitly or explicitly answering the question a searcher would be asking when they land here.

All 3 must sound conversational and natural — like a knowledgeable person explaining it simply, not corporate marketing copy. Avoid jargon, avoid superlatives like "leading" or "best-in-class", avoid starting with the brand name as the very first word more than once across the 3 options.

Return ONLY this exact JSON structure:

{
  "source_url": "${targetUrl}",
  "content_fetched": ${pageText ? 'true' : 'false'},
  "page_summary": "<1 sentence on what you understood this page to be about>",
  "options": [
    {
      "angle": "direct",
      "label": "Direct",
      "text": "<30-50 word BLUF summary>",
      "word_count": <actual number of words>
    },
    {
      "angle": "benefit-led",
      "label": "Benefit-led",
      "text": "<30-50 word BLUF summary>",
      "word_count": <actual number of words>
    },
    {
      "angle": "question-led",
      "label": "Question-led",
      "text": "<30-50 word BLUF summary>",
      "word_count": <actual number of words>
    }
  ]
}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      })
    })

    const rawText = await response.text()

    if (!response.ok) {
      console.error('NVIDIA API error:', rawText)
      return Response.json({ error: `API error: ${rawText}` }, { status: 500 })
    }

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content

    if (!text) {
      return Response.json({ error: 'Empty response', raw: json }, { status: 500 })
    }

    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return Response.json(data)

  } catch (err) {
    console.error('BLUF Builder API Error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}