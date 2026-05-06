import { gatewayBaseUrl } from '../../app/config/env'
import { request } from '../http/apiClient'
import { buildAuthHeaders } from '../http/authHeaders'

export function uploadFileToGateway({ token, tenantId, payload }) {
  return request({
    baseUrl: gatewayBaseUrl,
    path: 'files/upload',
    method: 'POST',
    headers: buildAuthHeaders({ token, tenantId }),
    body: JSON.stringify(payload),
  })
}

export function getFileMetadataFromGateway({ token, tenantId, fileId }) {
  return request({
    baseUrl: gatewayBaseUrl,
    path: `files/${fileId}`,
    method: 'GET',
    headers: buildAuthHeaders({ token, tenantId, contentType: undefined }),
    query: { tenantId },
  })
}
