import { describe, expect, it } from 'vitest'
import { buildAuthHeaders } from './authHeaders'

describe('buildAuthHeaders', () => {
  it('construye headers completos con token y tenant', () => {
    const headers = buildAuthHeaders({
      token: 'token-1',
      tenantId: 'tenant-1',
    })

    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token-1',
      'x-tenant-id': 'tenant-1',
    })
  })

  it('omite content type cuando se define null', () => {
    const headers = buildAuthHeaders({
      contentType: null,
      token: 'token-2',
    })

    expect(headers).toEqual({
      Authorization: 'Bearer token-2',
    })
  })
})
