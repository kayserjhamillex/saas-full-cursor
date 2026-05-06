import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAuthForms } from './useAuthForms'

vi.mock('../../services/auth/authWorkflowService', () => ({
  authenticateUser: vi.fn(),
  requestRecoveryCode: vi.fn(),
  verifyRecoveryCode: vi.fn(),
  updateUserPassword: vi.fn(),
}))

import { authenticateUser, updateUserPassword } from '../../services/auth'
import { requestRecoveryCode, verifyRecoveryCode } from '../../services/auth'

function submitEvent() {
  return { preventDefault: vi.fn() }
}

function buildDeps(overrides = {}) {
  return {
    tenantId: 'tenant-1',
    setSession: vi.fn(),
    clearSession: vi.fn(),
    setTenantId: vi.fn(),
    ...overrides,
  }
}

describe('useAuthForms', () => {
  it('login exitoso: llama setSession y apaga loading', async () => {
    authenticateUser.mockResolvedValueOnce({ token: 'token-123' })
    const deps = buildDeps()
    const { result } = renderHook(() => useAuthForms(deps))

    await act(async () => {
      result.current.setLoginForm((prev) => ({
        ...prev,
        email: 'demo@demo.com',
        password: '123456',
        tenantId: 'tenant-1',
      }))
    })

    await act(async () => {
      await result.current.submitLogin(submitEvent())
    })

    expect(deps.setSession).toHaveBeenCalledWith({ token: 'token-123', tenantId: 'tenant-1' })
    expect(result.current.loginLoading).toBe(false)
    expect(result.current.authMessage).toBe('')
  })

  it('login con error: guarda authMessage', async () => {
    authenticateUser.mockRejectedValueOnce(new Error('Credenciales invalidas'))
    const { result } = renderHook(() => useAuthForms(buildDeps()))

    await act(async () => {
      await result.current.submitLogin(submitEvent())
    })

    expect(result.current.authMessage).toBe('Credenciales invalidas')
    expect(result.current.loginLoading).toBe(false)
  })

  it('update password con mismatch: no llama API y muestra mensaje', async () => {
    const { result } = renderHook(() => useAuthForms(buildDeps()))

    await act(async () => {
      result.current.setUpdatePasswordForm({
        code: 'code-1',
        password: 'abc123',
        confirmPassword: 'otro',
      })
    })

    await act(async () => {
      await result.current.submitUpdatePassword(submitEvent())
    })

    expect(updateUserPassword).not.toHaveBeenCalled()
    expect(result.current.authMessage).toBe('Las passwords no coinciden')
  })

  it('submitRecover setea mensaje de exito', async () => {
    requestRecoveryCode.mockResolvedValueOnce({ ok: true })
    const { result } = renderHook(() => useAuthForms(buildDeps()))

    await act(async () => {
      result.current.setRecoverEmail('demo@test.com')
    })

    await act(async () => {
      await result.current.submitRecover(submitEvent())
    })

    expect(requestRecoveryCode).toHaveBeenCalledWith({
      email: 'demo@test.com',
      tenantId: 'tenant-1',
    })
    expect(result.current.authMessage).toBe('Codigo enviado. Continua con verificacion.')
  })

  it('submitVerifyCode setea mensaje de error cuando falla', async () => {
    verifyRecoveryCode.mockRejectedValueOnce(new Error('Codigo invalido'))
    const { result } = renderHook(() => useAuthForms(buildDeps()))

    await act(async () => {
      result.current.setRecoverEmail('demo@test.com')
      result.current.setVerifyCode('0000')
      await result.current.submitVerifyCode(submitEvent())
    })

    expect(result.current.authMessage).toBe('Codigo invalido')
  })

  it('submitUpdatePassword exitoso y logout limpia sesion', async () => {
    updateUserPassword.mockResolvedValueOnce({ ok: true })
    const deps = buildDeps()
    const { result } = renderHook(() => useAuthForms(deps))

    await act(async () => {
      result.current.setRecoverEmail('demo@test.com')
      result.current.setUpdatePasswordForm({
        code: '1234',
        password: 'abc123',
        confirmPassword: 'abc123',
      })
    })

    await act(async () => {
      await result.current.submitUpdatePassword(submitEvent())
    })

    expect(updateUserPassword).toHaveBeenCalledWith({
      email: 'demo@test.com',
      tenantId: 'tenant-1',
      code: '1234',
      newPassword: 'abc123',
    })
    expect(result.current.authMessage).toBe('Password actualizada. Puedes iniciar sesion.')

    act(() => {
      result.current.logout()
    })
    expect(deps.clearSession).toHaveBeenCalledTimes(1)
  })
})
