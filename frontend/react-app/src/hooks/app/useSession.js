import { useSessionStore } from '../../state/sessionStore'

export function useSession() {
  const token = useSessionStore((state) => state.token)
  const tenantId = useSessionStore((state) => state.tenantId)
  const setSession = useSessionStore((state) => state.setSession)
  const clearSession = useSessionStore((state) => state.clearSession)
  const setTenantId = useSessionStore((state) => state.setTenantId)

  return {
    token,
    tenantId,
    setSession,
    clearSession,
    setTenantId,
  }
}
