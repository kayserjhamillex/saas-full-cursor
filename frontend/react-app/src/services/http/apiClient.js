import { mapHttpError, mapNetworkError } from './errorMapper'

const DEFAULT_TIMEOUT_MS = 12000

function buildUrl(baseUrl, path) {
  if (/^https?:\/\//i.test(path)) return path
  const trimmedBaseUrl = String(baseUrl || '').replace(/\/+$/, '')
  const normalizedPath = String(path || '').replace(/^\/+/, '')
  return `${trimmedBaseUrl}/${normalizedPath}`
}

export async function request({
  baseUrl,
  path,
  method = 'GET',
  headers = {},
  body,
  query,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  signal,
} = {}) {
  const url = new URL(buildUrl(baseUrl, path))

  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  const abortController = new AbortController()
  const resolvedSignal = signal || abortController.signal
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs)

  let response
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body,
      signal: resolvedSignal,
    })
  } catch (error) {
    throw mapNetworkError(error)
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw await mapHttpError(response)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}
