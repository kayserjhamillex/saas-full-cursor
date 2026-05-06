const DEFAULT_API_BASE_URL = 'http://localhost:3000'

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '')
}

const configuredApiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

export const env = {
  apiBaseUrl: configuredApiBaseUrl || DEFAULT_API_BASE_URL,
}

export const gatewayBaseUrl = `${env.apiBaseUrl}/gateway`
