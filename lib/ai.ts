// lib/ai.ts — shared helper for all NotionCue tool API routes.
//
// Every tool route calls DeepSeek-V4-Flash via the NVIDIA-compatible
// /chat/completions endpoint, then parses the response as JSON. This
// file centralises that call so every route gets, for free:
//
//   1. A timeout on the model call itself (previously only page-fetch
//      steps had timeouts — a hung NVIDIA call would hang the whole
//      request until Vercel's function timeout killed it).
//   2. One automatic retry if the model returns malformed JSON
//      (truncation, stray markdown fences, trailing commas) instead
//      of failing the user's request on the first parse error.
//   3. A lightweight JSON repair pass before giving up.
//   4. Consistent, user-readable error messages instead of raw
//      `String(err)` stack traces leaking to the client.

const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek-ai/deepseek-v4-flash'

export class AICallError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
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
  /** Timeout for the NVIDIA call itself, ms. Default 25s — DeepSeek-V4-Flash
   *  is fast; this is generous headroom before Vercel's own function timeout. */
  timeoutMs?: number
}

/** Strip markdown fences and extract the first {...} or [...] block. */
function extractJsonBlock(raw: string): string {
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  const objStart = cleaned.indexOf('{')
  const arrStart = cleaned.indexOf('[')
  const start =
    objStart === -1 ? arrStart
    : arrStart === -1 ? objStart
    : Math.min(objStart, arrStart)

  if (start === -1) return cleaned

  const isArray = cleaned[start] === '['
  const end = isArray ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}')
  if (end === -1 || end <= start) return cleaned.slice(start)
  return cleaned.slice(start, end + 1)
}

/**
 * Best-effort repair for the handful of malformations DeepSeek
 * occasionally produces under load: trailing commas before a closing
 * bracket, and an unterminated string at the very end (from truncation).
 * This is NOT a general JSON5 parser — it only handles the patterns
 * we've actually seen, and falls through to the original string if a
 * fix doesn't apply.
 */
function attemptJsonRepair(block: string): string {
  let s = block
  // Trailing commas: { "a": 1, } or [1, 2, ]
  s = s.replace(/,(\s*[}\]])/g, '$1')
  // Truncated mid-string (odd number of unescaped quotes on the last
  // line) — close the string and try to close any open brackets.
  const lastLine = s.split('\n').pop() ?? ''
  const quoteCount = (lastLine.match(/(?<!\\)"/g) || []).length
  if (quoteCount % 2 === 1) {
    s += '"'
  }
  return s
}

/** Try JSON.parse, then a repaired version, then give up. */
function parseJsonLoose(raw: string): unknown | null {
  const block = extractJsonBlock(raw)
  try {
    return JSON.parse(block)
  } catch {
    try {
      return JSON.parse(attemptJsonRepair(block))
    } catch {
      return null
    }
  }
}

async function singleCall(opts: CallOpts): Promise<string> {
  const {
    apiKey, system, user,
    temperature = 0.3, maxTokens = 2000,
    model = DEFAULT_MODEL, timeoutMs = 25000,
  } = opts

  let response: Response
  try {
    response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new AICallError('The AI model took too long to respond. Please try again.', 504)
    }
    throw new AICallError('Could not reach the AI model. Please try again.', 502)
  }

  const rawText = await response.text()

  if (!response.ok) {
    if (response.status === 401) throw new AICallError('AI provider authentication failed.', 500)
    if (response.status === 429) throw new AICallError('Rate limited by the AI provider. Please try again shortly.', 429)
    throw new AICallError(`AI provider error (${response.status}). Please try again.`, 502)
  }

  let json: { choices?: { message?: { content?: string } }[] }
  try {
    json = JSON.parse(rawText)
  } catch {
    throw new AICallError('The AI provider returned an unreadable response. Please try again.', 502)
  }

  const text = json.choices?.[0]?.message?.content
  if (!text) {
    throw new AICallError('The AI model returned an empty response. Please try again.', 502)
  }
  return text
}

/**
 * Call the model and parse its reply as JSON, retrying once if the
 * first attempt produces unparseable JSON. Throws AICallError with a
 * clean, user-safe message on final failure — callers should catch
 * this and return `{ error: err.message }` with `err.status`.
 */
export async function callAIForJson<T = unknown>(opts: CallOpts): Promise<T> {
  let lastRaw = ''

  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await singleCall(opts)
    lastRaw = text
    const parsed = parseJsonLoose(text)
    if (parsed !== null) return parsed as T
    // First attempt failed to parse — retry once before giving up.
    // (No extra delay: DeepSeek-V4-Flash is fast and this is a
    // best-effort recovery, not a backoff strategy for rate limits.)
  }

  throw new AICallError(
    'The AI model returned a response that could not be processed. Please try again — this usually works on a second attempt.',
    502,
  )
  // lastRaw is intentionally unused in the thrown message — never leak
  // raw model output to the client, but it's available here if you
  // want to log it server-side for debugging:
  // console.error('Unparseable AI response:', lastRaw.slice(0, 500))
}

/** Convenience: turn any caught error into a Response.json the same way every route should. */
export function aiErrorResponse(err: unknown) {
  if (err instanceof AICallError) {
    return Response.json({ error: err.message }, { status: err.status })
  }
  console.error('Unexpected route error:', err)
  return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
}