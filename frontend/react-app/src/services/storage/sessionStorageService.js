const ACCESS_TOKEN_KEY = 'access_token'
const TENANT_ID_KEY = 'tenant_id'

export function getPersistedSession() {
  return {
    token: localStorage.getItem(ACCESS_TOKEN_KEY) || '',
    tenantId: localStorage.getItem(TENANT_ID_KEY) || '',
  }
}

export function persistSession({ token, tenantId }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token || '')
  localStorage.setItem(TENANT_ID_KEY, tenantId || '')
}

export function clearPersistedSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(TENANT_ID_KEY)
}
