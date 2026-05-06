import { gatewayBaseUrl } from '../../app/config/env'
import { request } from '../http/apiClient'
import { buildAuthHeaders } from '../http/authHeaders'

export async function loginRequest(payload) {
  const data = await request({
    baseUrl: gatewayBaseUrl,
    path: 'auth/login',
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  })

  const nextToken = data?.accessToken || data?.token || ''
  if (!nextToken) {
    throw new Error('Respuesta de login sin token')
  }

  return {
    token: nextToken,
    raw: data,
  }
}

export function postAuthRequest(path, payload) {
  return request({
    baseUrl: gatewayBaseUrl,
    path: `auth/${path}`,
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  })
}
