export async function POST(req: Request) {
  try {
    const { url, text: inputText } = await req.json()
    if (!url && !inputText) return Response.json({ error: 'URL or text required' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    let pageText = inputText || ''
    let fetchedUrl = ''

    // Fetch page if URL provided
    if (url && !inputText) {
      let targetUrl = url.trim()
      if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`
      fetchedUrl = targetUrl
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
        return Response.json({ error: 'Could not fetch page. Try pasting the text directly.' }, { status: 400 })
      }
    }

    if (!pageText.trim()) return Response.json({ error: 'No content to analyse.' }, { status: 400 })

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: 'You are an AEO content analyst. Score content for AI engine readability and citation likelihood. Always respond with valid JSON only — no markdown, no code fences.' },
          { role: 'user', content: `Analyse this content for AI readability and AEO citation potential:

"""${pageText.slice(0, 3000)}"""

Return ONLY this JSON:
{
  "overall_score": <0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<2 sentence plain-English verdict on how AI-ready this content is>",
  "scores": {
    "bluf_score": <0-100, does it answer the question in first 2 sentences>,
    "answer_density": <0-100, ratio of direct answers to total words>,
    "structure_score": <0-100, headings hierarchy, bullets, scannable format>,
    "sentence_clarity": <0-100, avg sentence length, jargon level, plain language>,
    "faq_presence": <0-100, presence of Q&A blocks or definition sections>,
    "first_100_words": "<quote the actual first 100 words of the content>"
  },
  "issues": [
    {"type": "critical|warning|info", "title": "<issue title>", "desc": "<specific issue found in this content>"},
    {"type": "critical|warning|info", "title": "<issue title>", "desc": "<specific issue found>"},
    {"type": "critical|warning|info", "title": "<issue title>", "desc": "<specific issue found>"}
  ],
  "rewrite_suggestion": "<rewrite the opening 2-3 sentences of this content using BLUF structure — make it AI-citation-ready>",
  "keyword_clusters": ["<main topic>", "<subtopic>", "<subtopic>", "<subtopic>"]
}` }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text2 = json.choices?.[0]?.message?.content
    if (!text2) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text2.replace(/```json|```/g, '').trim())
    return Response.json({ ...data, source_url: fetchedUrl })

  } catch (err) {
    console.error('Readability error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}