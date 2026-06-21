export async function POST(req: Request) {
  try {
    const { topic } = await req.json()
    if (!topic) return Response.json({ error: 'Topic is required' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

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
            content: 'You are an expert content strategist specialising in topic clustering for both traditional SEO and AI Answer Engine Optimisation (AEO). Always respond with valid JSON only — no markdown, no code fences, no extra text.'
          },
          {
            role: 'user',
            content: `Build a complete hub-and-spoke content cluster for the pillar topic: "${topic}"

Return ONLY this exact JSON structure:

{
  "pillar": {
    "topic": "${topic}",
    "slug": "<url-safe-slug>",
    "intent_summary": "<1-2 sentence summary of what page-one search results look like for this topic, and why a pillar page fills a gap>",
    "paa_count": <estimated number of distinct People-Also-Ask questions, 0-15>,
    "viable": <true|false — whether this topic can support a full cluster>
  },
  "spokes": [
    {
      "title": "<spoke topic title>",
      "slug": "<url-safe-slug>",
      "search_volume_score": <0-100, estimated relative SEO search volume>,
      "aeo_score": <0-100, estimated AI citation potential — how likely LLMs are to cite content on this spoke>,
      "intent": "<informational|commercial|navigational|comparison>",
      "articles": [
        {
          "title": "<specific article title>",
          "slug": "<url-safe-slug>",
          "search_volume_score": <0-100>,
          "aeo_score": <0-100>,
          "primary_keyword": "<the main keyword this article targets>"
        }
      ]
    }
  ],
  "linking_map": [
    {"from_slug": "<spoke or article slug>", "to_slug": "<pillar slug>", "type": "spoke-to-pillar"},
    {"from_slug": "<pillar slug>", "to_slug": "<spoke slug>", "type": "pillar-to-spoke"},
    {"from_slug": "<spoke slug>", "to_slug": "<related spoke slug>", "type": "lateral"}
  ],
  "cannibalization_risks": [
    {"topic_a": "<spoke or article title>", "topic_b": "<spoke or article title>", "risk": "<low|medium|high>", "fix": "<specific recommendation to differentiate or consolidate>"}
  ],
  "rollout_plan": {
    "phase_1": ["<pillar slug>", "<top 3 priority spoke slugs>"],
    "phase_2": ["<remaining spoke slugs>"],
    "estimated_timeline_weeks": <number>
  }
}

Generate exactly 5 spokes. Each spoke should have 5-7 articles. Score search_volume_score and aeo_score independently — a topic can be high SEO volume but low AEO potential (e.g. broad commercial terms LLMs rarely cite directly) or vice versa (e.g. specific how-to content that LLMs love to quote even with modest search volume). Identify 2-4 realistic cannibalization risks where spoke or article topics could compete with each other.`
          }
        ],
        max_tokens: 6000,
        temperature: 0.7
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
    console.error('Cluster API Error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}