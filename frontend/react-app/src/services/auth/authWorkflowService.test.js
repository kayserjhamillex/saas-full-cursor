import { describe, expect, it, vi } from 'vitest'
import {
  authenticateUser,
  requestRecoveryCode,
  updateUserPassword,
  verifyRecoveryCode,
} from './authWorkflowService'

const loginRequestMock = vi.fn()
const postAuthRequestMock = vi.fn()

vi.mock('./authService', () => ({
  loginRequest: (...args) => loginRequestMock(...args),
  postAuthRequest: (...args) => postAuthRequestMock(...args),
}))

describe('authWorkflowService', () => {
  it('authenticateUser delega en loginRequest', async () => {
    loginRequestMock.mockResolvedValueOnce({ token: 'abc' })
    const credentials = { email: 'a@a.com', password: '123' }

    await authenticateUser(credentials)

    expect(loginRequestMock).toHaveBeenCalledWith(credentials)
  })

  it('requestRecoveryCode delega en postAuthRequest con payload esperado', async () => {
    postAuthRequestMock.mockResolvedValueOnce({ ok: true })

    await requestRecoveryCode({ email: 'a@a.com', tenantId: 'tenant-1' })

    expect(postAuthRequestMock).toHaveBeenCalledWith('recover', {
      email: 'a@a.com',
      tenantId: 'tenant-1',
    })
  })

  it('verifyRecoveryCode delega en postAuthRequest con codigo', async () => {
    postAuthRequestMock.mockResolvedValueOnce({ ok: true })

    await verifyRecoveryCode({ email: 'a@a.com', tenantId: 'tenant-1', code: '9999' })

    expect(postAuthRequestMock).toHaveBeenCalledWith('verify-code', {
      email: 'a@a.com',
      tenantId: 'tenant-1',
      code: '9999',
    })
  })

  it('updateUserPassword delega en postAuthRequest con newPassword', async () => {
    postAuthRequestMock.mockResolvedValueOnce({ ok: true })

    await updateUserPassword({
      email: 'a@a.com',
      tenantId: 'tenant-1',
      code: '9999',
      newPassword: 'secret',
    })

    expect(postAuthRequestMock).toHaveBeenCalledWith('update-password', {
      email: 'a@a.com',
      tenantId: 'tenant-1',
      code: '9999',
      newPassword: 'secret',
    })
  })
})
