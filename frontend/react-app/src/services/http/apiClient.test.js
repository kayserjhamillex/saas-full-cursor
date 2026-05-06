import { afterEach, describe, expect, it, vi } from 'vitest'
import { request } from './apiClient'

function buildResponse({
  ok = true,
  status = 200,
  contentType = 'application/json',
  jsonData = {},
  textData = '',
} = {}) {
  return {
    ok,
    status,
    headers: {
      get: () => contentType,
    },
    json: async () => jsonData,
    text: async () => textData,
  }
}

describe('apiClient.request', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('envia query params y devuelve JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      buildResponse({
        jsonData: { ok: true },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await request({
      baseUrl: 'http://localhost:3000',
      path: '/gateway/files',
      query: { page: 1, filter: 'abc', ignored: '' },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toContain('/gateway/files?page=1&filter=abc')
    expect(result).toEqual({ ok: true })
  })

  it('devuelve texto cuando content type no es json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        buildResponse({
          contentType: 'text/plain',
          textData: 'pong',
        }),
      ),
    )

    const result = await request({
      baseUrl: 'http://localhost:3000',
      path: '/health',
    })

    expect(result).toBe('pong')
  })

  it('mapea error HTTP cuando response.ok es false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        buildResponse({
          ok: false,
          status: 401,
          jsonData: { error: 'No autorizado por token' },
        }),
      ),
    )

    await expect(
      request({
        baseUrl: 'http://localhost:3000',
        path: '/gateway/private',
      }),
    ).rejects.toMatchObject({
      message: 'No autorizado por token',
      status: 401,
    })
  })

  it('mapea errores de red con codigo NETWORK_ERROR', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('fetch failed')),
    )

    await expect(
      request({
        baseUrl: 'http://localhost:3000',
        path: '/gateway/private',
      }),
    ).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'No se pudo establecer comunicacion con el servidor.',
    })
  })
})
