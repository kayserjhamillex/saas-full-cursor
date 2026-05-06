import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAppRouterViewModel } from './useAppRouterViewModel'

const useThemeMock = vi.fn()
const useSessionMock = vi.fn()
const useAuthUiStateMock = vi.fn()
const useAuthFormsMock = vi.fn()

vi.mock('./useTheme', () => ({
  useTheme: (...args) => useThemeMock(...args),
}))

vi.mock('./useSession', () => ({
  useSession: (...args) => useSessionMock(...args),
}))

vi.mock('../auth/useAuthUiState', () => ({
  useAuthUiState: (...args) => useAuthUiStateMock(...args),
}))

vi.mock('../auth/useAuthForms', () => ({
  useAuthForms: (...args) => useAuthFormsMock(...args),
}))

function buildAuthFormsValue(overrides = {}) {
  return {
    loginForm: { email: '', password: '', tenantId: '' },
    setLoginForm: vi.fn(),
    loginLoading: false,
    submitLogin: vi.fn(),
    recoverEmail: '',
    setRecoverEmail: vi.fn(),
    submitRecover: vi.fn(),
    verifyCode: '',
    setVerifyCode: vi.fn(),
    submitVerifyCode: vi.fn(),
    updatePasswordForm: { code: '', password: '', confirmPassword: '' },
    setUpdatePasswordForm: vi.fn(),
    submitUpdatePassword: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  }
}

describe('useAppRouterViewModel', () => {
  it('usa token de sesion por defecto para isAuthenticated', () => {
    useThemeMock.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() })
    useSessionMock.mockReturnValue({
      token: 'session-token',
      tenantId: 'tenant-1',
      setSession: vi.fn(),
      clearSession: vi.fn(),
      setTenantId: vi.fn(),
    })
    useAuthUiStateMock.mockReturnValue({ authMessage: '', setAuthMessage: vi.fn() })
    useAuthFormsMock.mockReturnValue(buildAuthFormsValue())

    const { result } = renderHook(() => useAppRouterViewModel())
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.shellViewModel.token).toBe('session-token')
  })

  it('prioriza overrides cuando se proveen', () => {
    const toggleTheme = vi.fn()
    const setTenantId = vi.fn()
    useThemeMock.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() })
    useSessionMock.mockReturnValue({
      token: '',
      tenantId: 'tenant-1',
      setSession: vi.fn(),
      clearSession: vi.fn(),
      setTenantId: vi.fn(),
    })
    useAuthUiStateMock.mockReturnValue({ authMessage: 'msg', setAuthMessage: vi.fn() })
    useAuthFormsMock.mockReturnValue(buildAuthFormsValue({ logout: vi.fn() }))

    const { result } = renderHook(() =>
      useAppRouterViewModel({
        token: 'override-token',
        tenantId: 'tenant-override',
        setTenantId,
        theme: 'dark',
        toggleTheme,
      }),
    )

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.shellViewModel.token).toBe('override-token')
    expect(result.current.shellViewModel.theme).toBe('dark')
    expect(result.current.shellViewModel.toggleTheme).toBe(toggleTheme)
    expect(result.current.authViewModel.tenantId).toBe('tenant-override')
    expect(result.current.authViewModel.setTenantId).toBe(setTenantId)
  })
})
