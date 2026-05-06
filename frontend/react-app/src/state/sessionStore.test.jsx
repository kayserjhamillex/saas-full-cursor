import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/storage/sessionStorageService', () => ({
  getPersistedSession: vi.fn(() => ({ token: 'boot-token', tenantId: 'boot-tenant' })),
  persistSession: vi.fn(),
  clearPersistedSession: vi.fn(),
}))

import { clearPersistedSession, persistSession } from '../services/storage/sessionStorageService'

describe('useSessionStore', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('inicializa estado desde sesion persistida', async () => {
    const { useSessionStore } = await import('./sessionStore')
    const state = useSessionStore.getState()

    expect(state.token).toBe('boot-token')
    expect(state.tenantId).toBe('boot-tenant')
  })

  it('setSession persiste y actualiza estado', async () => {
    const { useSessionStore } = await import('./sessionStore')

    useSessionStore.getState().setSession({ token: 'token-1', tenantId: 'tenant-1' })

    const state = useSessionStore.getState()
    expect(state.token).toBe('token-1')
    expect(state.tenantId).toBe('tenant-1')
    expect(persistSession).toHaveBeenCalledWith({ token: 'token-1', tenantId: 'tenant-1' })
  })

  it('setTenantId actualiza tenant y persiste token actual', async () => {
    const { useSessionStore } = await import('./sessionStore')
    useSessionStore.getState().setSession({ token: 'token-2', tenantId: 'tenant-old' })

    useSessionStore.getState().setTenantId('tenant-new')

    const state = useSessionStore.getState()
    expect(state.token).toBe('token-2')
    expect(state.tenantId).toBe('tenant-new')
    expect(persistSession).toHaveBeenLastCalledWith({ token: 'token-2', tenantId: 'tenant-new' })
  })

  it('clearSession limpia persistencia y reinicia estado', async () => {
    const { useSessionStore } = await import('./sessionStore')
    useSessionStore.getState().setSession({ token: 'token-3', tenantId: 'tenant-3' })

    useSessionStore.getState().clearSession()

    const state = useSessionStore.getState()
    expect(state.token).toBe('')
    expect(state.tenantId).toBe('')
    expect(clearPersistedSession).toHaveBeenCalledTimes(1)
  })
})
