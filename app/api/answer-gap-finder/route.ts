import {
  callAIForJson,
  aiErrorResponse,
} from '@/lib/ai'

export const maxDuration = 60

export async function POST(
  req: Request
) {
  try {
    // ---------------------------------------------------------
    // Read request
    // ---------------------------------------------------------

    const body = await req.json()

    const {
      domain,
      niche,
      competitor_domains,
    } = body

    // ---------------------------------------------------------
    // Validate input
    // ---------------------------------------------------------

    if (!domain && !niche) {
      return Response.json(
        {
          error:
            'Domain or niche required',
        },
        {
          status: 400,
        }
      )
    }

    // ---------------------------------------------------------
    // NVIDIA API key
    // ---------------------------------------------------------

    const apiKey =
      process.env.NVIDIA_API_KEY

    if (!apiKey) {
      console.error(
        'NVIDIA_API_KEY is missing'
      )

      return Response.json(
        {
          error:
            'Missing NVIDIA_API_KEY',
        },
        {
          status: 500,
        }
      )
    }

    // ---------------------------------------------------------
    // Prepare domain
    // ---------------------------------------------------------

    let pageContext = ''
    let targetDomain = ''

    if (domain) {
      let targetUrl =
        String(domain).trim()

      // Add protocol if user entered
      // only the domain.
      if (
        !/^https?:\/\//i.test(
          targetUrl
        )
      ) {
        targetUrl =
          `https://${targetUrl}`
      }

      try {
        const parsedUrl =
          new URL(targetUrl)

        targetDomain =
          parsedUrl.hostname.replace(
            /^www\./i,
            ''
          )

        // -----------------------------------------------------
        // Fetch homepage only when niche
        // wasn't supplied.
        // -----------------------------------------------------

        if (!niche) {
          try {
            const res =
              await fetch(
                targetUrl,
                {
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (compatible; NotionCueBot/1.0)',
                    Accept:
                      'text/html,application/xhtml+xml',
                  },

                  signal:
                    AbortSignal.timeout(
                      7000
                    ),

                  cache:
                    'no-store',
                }
              )

            if (res.ok) {
              const html =
                await res.text()

              pageContext =
                html
                  // Remove scripts
                  .replace(
                    /<script[\s\S]*?<\/script>/gi,
                    ' '
                  )

                  // Remove styles
                  .replace(
                    /<style[\s\S]*?<\/style>/gi,
                    ' '
                  )

                  // Remove noscript
                  .replace(
                    /<noscript[\s\S]*?<\/noscript>/gi,
                    ' '
                  )

                  // Remove HTML tags
                  .replace(
                    /<[^>]+>/g,
                    ' '
                  )

                  // Decode common HTML entities
                  .replace(
                    /&nbsp;/gi,
                    ' '
                  )
                  .replace(
                    /&amp;/gi,
                    '&'
                  )
                  .replace(
                    /&quot;/gi,
                    '"'
                  )
                  .replace(
                    /&#39;/gi,
                    "'"
                  )
                  .replace(
                    /&lt;/gi,
                    '<'
                  )
                  .replace(
                    /&gt;/gi,
                    '>'
                  )

                  // Normalize whitespace
                  .replace(
                    /\s+/g,
                    ' '
                  )

                  .trim()

                  // Limit prompt size
                  .slice(0, 4000)
            } else {
              console.warn(
                `Homepage returned HTTP ${res.status}`
              )
            }
          } catch (fetchError) {
            // Do not fail the complete AI
            // request if the website cannot
            // be fetched.
            console.warn(
              'Could not fetch homepage:',
              fetchError
            )
          }
        }
      } catch {
        return Response.json(
          {
            error:
              'Invalid domain or URL',
          },
          {
            status: 400,
          }
        )
      }
    }

    // ---------------------------------------------------------
    // If user supplied only a niche
    // ---------------------------------------------------------

    if (!targetDomain) {
      targetDomain =
        'not provided'
    }

    // ---------------------------------------------------------
    // Clean competitor domains
    // ---------------------------------------------------------

    let competitors: string[] = []

    if (
      Array.isArray(
        competitor_domains
      )
    ) {
      competitors =
        competitor_domains
          .map(
            (item: unknown) =>
              String(item).trim()
          )
          .filter(Boolean)
          .map((item) => {
            try {
              let url = item

              if (
                !/^https?:\/\//i.test(
                  url
                )
              ) {
                url =
                  `https://${url}`
              }

              return new URL(
                url
              ).hostname.replace(
                /^www\./i,
                ''
              )
            } catch {
              return item
            }
          })
    }

    // ---------------------------------------------------------
    // System prompt
    // ---------------------------------------------------------

    const systemPrompt = `
You are an expert AEO and AI visibility strategist.

Your job is to identify content opportunities where a website could become a useful source for AI systems such as ChatGPT, Perplexity, Gemini, and other answer engines.

Analyze the supplied domain, niche, homepage content, and competitor domains.

Identify two types of opportunities:

1. FIRST-MOVER

No clearly dominant brand or source appears to own the answer, or existing coverage appears weak.

2. DISPLACEMENT

A competitor or existing source appears relevant, but the content could be improved through better structure, clearer information, stronger evidence, more complete coverage, better comparisons, or fresher information.

IMPORTANT RULES:

- Do not invent exact search-volume numbers.
- Search volume must only be high, medium, or low.
- Do not claim that you actually queried ChatGPT, Perplexity, or Gemini.
- Treat currently_cited as an estimated source based on the supplied information.
- Questions must sound like real questions people ask AI assistants.
- Avoid duplicate questions.
- Each question must represent a distinct content opportunity.
- Opportunity scores must be between 0 and 100.
- Return exactly 20 gaps.
- Return valid JSON only.
- Do not use Markdown.
- Do not use code fences.
`

    // ---------------------------------------------------------
    // User prompt
    // ---------------------------------------------------------

    const userPrompt = `
Find AI answer gaps for this website.

DOMAIN:
${targetDomain}

NICHE / TOPIC:
${
  niche ||
  'Infer the niche from the homepage content and domain.'
}

COMPETITOR DOMAINS:
${
  competitors.length
    ? competitors.join(', ')
    : 'None provided'
}

HOMEPAGE CONTENT:
${
  pageContext
    ? pageContext
    : 'Homepage content was not available. Infer the niche from the domain and supplied niche information.'
}

TASK:

Find exactly 20 questions that users may ask AI systems such as ChatGPT, Perplexity, and Gemini within this niche.

Prioritize opportunities that fit one of these categories:

A. FIRST-MOVER

There is no clearly dominant brand/source for the answer.

B. DISPLACEMENT

A competitor or existing source may answer the question, but the answer could be improved through better structure, clearer information, stronger evidence, more complete coverage, better comparisons, or fresher information.

For every gap provide:

- The exact natural-language question
- Gap type
- Opportunity score
- Estimated search-volume category
- AI intent
- Currently cited brand/source if reasonably identifiable
- Why the opportunity exists
- A specific content angle
- Recommended content format
- Recommended word count
- Recommended schema

Allowed gap types:

"first-mover"
"displacement"

Allowed search-volume values:

"high"
"medium"
"low"

Allowed AI intent values:

"definition"
"how-to"
"comparison"
"best-of"
"explanation"

Allowed formats:

"blog post"
"FAQ page"
"comparison page"
"guide"
"definition page"

Allowed schema:

"FAQPage"
"HowTo"
"Article"
"none"

Opportunity score should consider:

- Relevance to the target domain
- User intent
- Potential AI-answer usefulness
- Commercial or informational value
- Existing content weakness
- Competition
- Ability to create a substantially better answer

Do not fabricate:

- Exact traffic numbers
- Exact search volume
- Citation percentages
- AI-engine rankings
- Claims that require live querying of ChatGPT
- Claims that require live querying of Perplexity
- Claims that require live querying of Gemini

Return ONLY this JSON:

{
  "domain": "${targetDomain}",
  "inferred_niche": "detected niche or industry",
  "total_gaps": 20,
  "gaps": [
    {
      "question": "exact question someone would ask an AI assistant",
      "gap_type": "first-mover",
      "opportunity_score": 85,
      "search_volume": "high",
      "ai_intent": "comparison",
      "currently_cited": "none",
      "why_gap": "One sentence explaining why the opportunity appears unclaimed or weak.",
      "content_angle": "Specific angle the target website should use.",
      "recommended_format": "comparison page",
      "word_count": 1800,
      "schema": "Article"
    }
  ],
  "quick_wins": [
    "short question or slug 1",
    "short question or slug 2",
    "short question or slug 3"
  ],
  "summary": "2-3 sentences explaining the largest opportunity clusters."
}
`

    // ---------------------------------------------------------
    // Call NVIDIA AI
    // ---------------------------------------------------------

    const data =
      await callAIForJson({
        apiKey,

        system:
          systemPrompt,

        user:
          userPrompt,

        temperature:
          0.2,

        maxTokens:
          5000,

        timeoutMs:
          30000,

        model:
          'openai/gpt-oss-20b',
      })

    // ---------------------------------------------------------
    // Validate AI response
    // ---------------------------------------------------------

    if (
      !data ||
      typeof data !== 'object'
    ) {
      throw new Error(
        'AI returned an invalid data structure'
      )
    }

    const result =
      data as {
        domain?: string
        inferred_niche?: string
        total_gaps?: number
        gaps?: unknown[]
        quick_wins?: unknown[]
        summary?: string
      }

    if (
      !Array.isArray(
        result.gaps
      )
    ) {
      throw new Error(
        'AI response did not contain a valid gaps array'
      )
    }

    // ---------------------------------------------------------
    // Normalize response
    // ---------------------------------------------------------

    const cleanedData = {
      domain:
        result.domain ||
        targetDomain,

      inferred_niche:
        result.inferred_niche ||
        niche ||
        'Unknown',

      total_gaps:
        Math.min(
          result.gaps.length,
          20
        ),

      gaps:
        result.gaps.slice(
          0,
          20
        ),

      quick_wins:
        Array.isArray(
          result.quick_wins
        )
          ? result.quick_wins.slice(
              0,
              3
            )
          : [],

      summary:
        result.summary ||
        '',
    }

    // ---------------------------------------------------------
    // Return response
    // ---------------------------------------------------------

    return Response.json(
      cleanedData,
      {
        status: 200,

        headers: {
          'Cache-Control':
            'no-store',
        },
      }
    )
  } catch (err) {
    console.error(
      'AI answer gaps route error:',
      err
    )

    return aiErrorResponse(err)
  }
}