import { describe, expect, it, vi } from 'vitest'
import { loginRequest, postAuthRequest } from './authService'

const requestMock = vi.fn()
const buildAuthHeadersMock = vi.fn()

vi.mock('../http/apiClient', () => ({
  request: (...args) => requestMock(...args),
}))

vi.mock('../http/authHeaders', () => ({
  buildAuthHeaders: (...args) => buildAuthHeadersMock(...args),
}))

describe('authService', () => {
  it('loginRequest retorna token normalizado desde accessToken', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ 'Content-Type': 'application/json' })
    requestMock.mockResolvedValueOnce({ accessToken: 'abc-token' })

    const result = await loginRequest({ email: 'a@a.com', password: '123' })

    expect(result).toEqual({
      token: 'abc-token',
      raw: { accessToken: 'abc-token' },
    })
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'auth/login',
        method: 'POST',
      }),
    )
  })

  it('loginRequest falla si respuesta no trae token', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ 'Content-Type': 'application/json' })
    requestMock.mockResolvedValueOnce({})

    await expect(loginRequest({ email: 'a@a.com', password: '123' })).rejects.toThrow(
      'Respuesta de login sin token',
    )
  })

  it('loginRequest tambien acepta token en propiedad token', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ 'Content-Type': 'application/json' })
    requestMock.mockResolvedValueOnce({ token: 'legacy-token' })

    const result = await loginRequest({ email: 'a@a.com', password: '123' })

    expect(result).toEqual({
      token: 'legacy-token',
      raw: { token: 'legacy-token' },
    })
  })

  it('postAuthRequest usa path auth prefijado', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ 'Content-Type': 'application/json' })
    requestMock.mockResolvedValueOnce({ ok: true })

    await postAuthRequest('recover', { email: 'a@a.com', tenantId: 't1' })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'auth/recover',
        method: 'POST',
      }),
    )
  })
})
