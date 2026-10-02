// lib/ai.ts

const NVIDIA_ENDPOINT =
  'https://integrate.api.nvidia.com/v1/chat/completions'

const DEFAULT_MODEL = 'openai/gpt-oss-20b'

export class AICallError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'AICallError'
    this.status = status
  }
}

interface CallOpts {
  apiKey: string
  system: string
  user: string
  temperature?: number
  maxTokens?: number
  model?: string
  timeoutMs?: number
}

/**
 * Extract JSON from an AI response.
 * Handles markdown fences and extra text around JSON.
 */
function extractJsonBlock(raw: string): string {
  if (!raw) {
    return ''
  }

  let cleaned = raw.trim()

  // Remove markdown code fences
  cleaned = cleaned.replace(/```json/gi, '')
  cleaned = cleaned.replace(/```/g, '')

  // Remove model reasoning blocks if present
  cleaned = cleaned.replace(
    /<think>[\s\S]*?<\/think>/gi,
    ''
  )

  cleaned = cleaned.trim()

  const objectStart = cleaned.indexOf('{')
  const arrayStart = cleaned.indexOf('[')

  if (
    objectStart === -1 &&
    arrayStart === -1
  ) {
    return cleaned
  }

  let start: number

  if (objectStart === -1) {
    start = arrayStart
  } else if (arrayStart === -1) {
    start = objectStart
  } else {
    start = Math.min(
      objectStart,
      arrayStart
    )
  }

  const isArray =
    cleaned[start] === '['

  const end = isArray
    ? cleaned.lastIndexOf(']')
    : cleaned.lastIndexOf('}')

  if (
    end === -1 ||
    end <= start
  ) {
    return cleaned.slice(start)
  }

  return cleaned.slice(
    start,
    end + 1
  )
}

/**
 * Basic repair for common JSON mistakes
 * made by language models.
 */
function attemptJsonRepair(
  block: string
): string {
  let repaired = block.trim()

  // Remove trailing commas:
  // {"foo": "bar",}
  // ["one", "two",]
  repaired = repaired.replace(
    /,(\s*[}\]])/g,
    '$1'
  )

  return repaired
}

/**
 * Try to parse model output as JSON.
 */
function parseJsonLoose(
  raw: string
): unknown | null {
  const block =
    extractJsonBlock(raw)

  if (!block) {
    return null
  }

  // Normal JSON parsing
  try {
    return JSON.parse(block)
  } catch {
    // Try repair below
  }

  // Repaired JSON
  try {
    const repaired =
      attemptJsonRepair(block)

    return JSON.parse(repaired)
  } catch {
    return null
  }
}

/**
 * Make one request to NVIDIA.
 */
async function singleCall(
  opts: CallOpts
): Promise<string> {
  const {
    apiKey,
    system,
    user,
    temperature = 0.2,
    maxTokens = 4096,
    model = DEFAULT_MODEL,
    timeoutMs = 30000,
  } = opts

  if (!apiKey) {
    throw new AICallError(
      'NVIDIA API key is missing.',
      500
    )
  }

  let response: Response

  try {
    response = await fetch(
      NVIDIA_ENDPOINT,
      {
        method: 'POST',

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: 'system',
              content: system,
            },
            {
              role: 'user',
              content: user,
            },
          ],

          temperature,

          max_tokens:
            maxTokens,

          stream: false,

          response_format: {
            type: 'json_object',
          },
        }),

        signal:
          AbortSignal.timeout(
            timeoutMs
          ),
      }
    )
  } catch (err) {
    console.error(
      'NVIDIA fetch error:',
      err
    )

    if (
      err instanceof Error &&
      err.name === 'TimeoutError'
    ) {
      throw new AICallError(
        'The AI model took too long to respond. Please try again.',
        504
      )
    }

    if (
      err instanceof Error &&
      err.name === 'AbortError'
    ) {
      throw new AICallError(
        'The AI request was cancelled. Please try again.',
        504
      )
    }

    throw new AICallError(
      'Could not reach the NVIDIA AI service. Please try again.',
      502
    )
  }

  const rawText =
    await response.text()

  console.log(
    'NVIDIA API status:',
    response.status
  )

  // ---------------------------------------------------------
  // Provider error
  // ---------------------------------------------------------

  if (!response.ok) {
    console.error(
      'NVIDIA API error:',
      {
        status: response.status,
        body: rawText.slice(0, 2000),
      }
    )

    if (response.status === 400) {
      throw new AICallError(
        'NVIDIA rejected the request. Check the model name and request parameters.',
        400
      )
    }

    if (response.status === 401) {
      throw new AICallError(
        'NVIDIA API authentication failed. Check NVIDIA_API_KEY.',
        401
      )
    }

    if (response.status === 403) {
      throw new AICallError(
        'NVIDIA denied access to this API or model. Check your NVIDIA API key and model access.',
        403
      )
    }

    if (response.status === 404) {
      throw new AICallError(
        'NVIDIA API endpoint or model was not found.',
        404
      )
    }

    if (response.status === 408) {
      throw new AICallError(
        'The NVIDIA request timed out. Please try again.',
        504
      )
    }

    if (response.status === 429) {
      throw new AICallError(
        'NVIDIA API rate limit reached. Please try again shortly.',
        429
      )
    }

    if (response.status >= 500) {
      throw new AICallError(
        'NVIDIA AI service is temporarily unavailable. Please try again.',
        502
      )
    }

    throw new AICallError(
      `NVIDIA API error (${response.status}). Please try again.`,
      502
    )
  }

  // ---------------------------------------------------------
  // Parse NVIDIA response
  // ---------------------------------------------------------

  let json: {
    choices?: Array<{
      message?: {
        role?: string
        content?: string | null
      }
    }>
  }

  try {
    json = JSON.parse(rawText)
  } catch {
    console.error(
      'NVIDIA returned invalid JSON:',
      rawText.slice(0, 2000)
    )

    throw new AICallError(
      'NVIDIA returned an unreadable response. Please try again.',
      502
    )
  }

  // ---------------------------------------------------------
  // Get model content
  // ---------------------------------------------------------

  const text =
    json.choices?.[0]?.message?.content

  if (
    typeof text !== 'string' ||
    !text.trim()
  ) {
    console.error(
      'NVIDIA returned empty model response:',
      JSON.stringify(json).slice(0, 2000)
    )

    throw new AICallError(
      'The AI model returned an empty response. Please try again.',
      502
    )
  }

  return text.trim()
}

/**
 * Call the AI model and return parsed JSON.
 *
 * If the model returns malformed JSON,
 * make one additional attempt.
 */
export async function callAIForJson<
  T = unknown
>(
  opts: CallOpts
): Promise<T> {
  let lastRaw = ''

  for (
    let attempt = 0;
    attempt < 2;
    attempt++
  ) {
    const text =
      await singleCall(opts)

    lastRaw = text

    const parsed =
      parseJsonLoose(text)

    if (parsed !== null) {
      return parsed as T
    }

    console.warn(
      `AI JSON parsing failed on attempt ${
        attempt + 1
      }.`
    )

    console.warn(
      'AI response:',
      text.slice(0, 2000)
    )
  }

  console.error(
    'AI JSON parsing failed after retry:',
    lastRaw.slice(0, 2000)
  )

  throw new AICallError(
    'The AI model returned a response that could not be processed. Please try again.',
    502
  )
}

/**
 * Convert errors into a safe JSON response.
 */
export function aiErrorResponse(
  err: unknown
) {
  if (
    err instanceof AICallError
  ) {
    return Response.json(
      {
        error: err.message,
      },
      {
        status: err.status,
      }
    )
  }

  console.error(
    'Unexpected AI route error:',
    err
  )

  return Response.json(
    {
      error:
        'Something went wrong while processing the AI request. Please try again.',
    },
    {
      status: 500,
    }
  )
}