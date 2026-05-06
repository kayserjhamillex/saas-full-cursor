import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { modules } from '../../app/config/constants'
import { RouterViewModelProvider } from '../../app/providers/RouterViewModelContext'

export function buildAppRouterProps(overrides = {}) {
  return {
    authMessage: '',
    loginForm: { email: '', password: '', tenantId: '' },
    setLoginForm: vi.fn(),
    loginLoading: false,
    submitLogin: vi.fn((event) => event.preventDefault()),
    recoverEmail: '',
    setRecoverEmail: vi.fn(),
    tenantId: '',
    setTenantId: vi.fn(),
    submitRecover: vi.fn((event) => event.preventDefault()),
    verifyCode: '',
    setVerifyCode: vi.fn(),
    submitVerifyCode: vi.fn((event) => event.preventDefault()),
    updatePasswordForm: { code: '', password: '', confirmPassword: '' },
    setUpdatePasswordForm: vi.fn(),
    submitUpdatePassword: vi.fn((event) => event.preventDefault()),
    token: '',
    logout: vi.fn(),
    modules: [{ key: 'dashboard', to: '/', label: 'Inicio', enabled: true }],
    theme: 'light',
    toggleTheme: vi.fn(),
    summary: [{ label: 'Citas del dia', value: '32' }],
    ...overrides,
  }
}

export function buildAuthViewModel(overrides = {}) {
  return {
    loginForm: { email: 'test@demo.com', password: '123456', tenantId: 'tenant-1' },
    setLoginForm: vi.fn(),
    updateLoginField: vi.fn(),
    loginLoading: false,
    submitLogin: vi.fn((event) => event.preventDefault()),
    recoverEmail: 'test@demo.com',
    setRecoverEmail: vi.fn(),
    tenantId: 'tenant-1',
    setTenantId: vi.fn(),
    verifyCode: '123456',
    setVerifyCode: vi.fn(),
    submitRecover: vi.fn((event) => event.preventDefault()),
    submitVerifyCode: vi.fn((event) => event.preventDefault()),
    submitUpdatePassword: vi.fn((event) => event.preventDefault()),
    updatePasswordForm: { code: '123456', password: 'secret123', confirmPassword: 'secret123' },
    updatePasswordField: vi.fn(),
    ...overrides,
  }
}

export function buildRouterProviderValue(overrides = {}) {
  return {
    ui: { authMessage: '' },
    authViewModel: buildAuthViewModel(),
    shellViewModel: {
      token: 'token-test',
      tenantId: 'tenant-test',
      modules,
      summary: [],
      theme: 'light',
      toggleTheme: vi.fn(),
      logout: vi.fn(),
    },
    isAuthenticated: false,
    ...overrides,
  }
}

export function renderWithRouterViewModel(ui, { route = '/', providerValue = {} } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <RouterViewModelProvider value={buildRouterProviderValue(providerValue)}>
        {ui}
      </RouterViewModelProvider>
    </MemoryRouter>,
  )
}
