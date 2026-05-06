export function buildAuthHeaders({ token, tenantId, contentType = 'application/json' } = {}) {
  const headers = {}

  if (contentType) {
    headers['Content-Type'] = contentType
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    headers['x-tenant-id'] = tenantId
  }

  return headers
}
