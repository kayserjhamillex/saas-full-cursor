import { create } from 'zustand'
import {
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from '../services/storage/sessionStorageService'

const initialSession = getPersistedSession()

export const useSessionStore = create((set) => ({
  token: initialSession.token,
  tenantId: initialSession.tenantId,
  setSession: ({ token, tenantId }) => {
    persistSession({ token, tenantId })
    set({ token, tenantId })
  },
  clearSession: () => {
    clearPersistedSession()
    set({ token: '', tenantId: '' })
  },
  setTenantId: (tenantId) => {
    const nextTenantId = tenantId || ''
    set((state) => {
      persistSession({ token: state.token, tenantId: nextTenantId })
      return { tenantId: nextTenantId }
    })
  },
}))
