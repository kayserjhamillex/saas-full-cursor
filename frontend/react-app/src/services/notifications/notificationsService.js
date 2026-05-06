import { gatewayBaseUrl } from '../../app/config/env'
import { request } from '../http/apiClient'
import { buildAuthHeaders } from '../http/authHeaders'

export function sendEmailNotification({ token, tenantId, payload }) {
  return request({
    baseUrl: gatewayBaseUrl,
    path: 'notifications/email',
    method: 'POST',
    headers: buildAuthHeaders({ token, tenantId }),
    body: JSON.stringify(payload),
  })
}

export function sendWhatsappNotification({ token, tenantId, payload }) {
  return request({
    baseUrl: gatewayBaseUrl,
    path: 'notifications/whatsapp',
    method: 'POST',
    headers: buildAuthHeaders({ token, tenantId }),
    body: JSON.stringify(payload),
  })
}
