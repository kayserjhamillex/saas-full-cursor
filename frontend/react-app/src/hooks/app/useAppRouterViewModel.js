import { useMemo } from 'react'
import { dashboardSummary, modules as defaultModules } from '../../app/config/constants'
import { useAuthForms } from '../auth/useAuthForms'
import { useAuthUiState } from '../auth/useAuthUiState'
import { useTheme } from './useTheme'
import { useSession } from './useSession'

export function useAppRouterViewModel(overrides = {}) {
  const { theme, toggleTheme } = useTheme()
  const { token, tenantId, setSession, clearSession, setTenantId } = useSession()
  const authUi = useAuthUiState()
  const auth = useAuthForms({ tenantId, setSession, clearSession, setTenantId, authUi })

  const merged = useMemo(
    () => ({
      ...auth,
      authMessage: authUi.authMessage,
      modules: defaultModules,
      summary: dashboardSummary,
      ...overrides,
    }),
    [auth, authUi.authMessage, overrides],
  )

  const resolvedToken = merged.token ?? token
  const resolvedTenantId = merged.tenantId ?? tenantId
  const resolvedSetTenantId = merged.setTenantId ?? setTenantId
  const resolvedTheme = merged.theme ?? theme
  const resolvedToggleTheme = merged.toggleTheme ?? toggleTheme

  const authViewModel = useMemo(
    () => ({
      loginForm: merged.loginForm,
      setLoginForm: merged.setLoginForm,
      loginLoading: merged.loginLoading,
      submitLogin: merged.submitLogin,
      recoverEmail: merged.recoverEmail,
      setRecoverEmail: merged.setRecoverEmail,
      tenantId: resolvedTenantId,
      setTenantId: resolvedSetTenantId,
      submitRecover: merged.submitRecover,
      verifyCode: merged.verifyCode,
      setVerifyCode: merged.setVerifyCode,
      submitVerifyCode: merged.submitVerifyCode,
      updatePasswordForm: merged.updatePasswordForm,
      setUpdatePasswordForm: merged.setUpdatePasswordForm,
      submitUpdatePassword: merged.submitUpdatePassword,
    }),
    [
      merged.loginForm,
      merged.setLoginForm,
      merged.loginLoading,
      merged.submitLogin,
      merged.recoverEmail,
      merged.setRecoverEmail,
      resolvedTenantId,
      resolvedSetTenantId,
      merged.submitRecover,
      merged.verifyCode,
      merged.setVerifyCode,
      merged.submitVerifyCode,
      merged.updatePasswordForm,
      merged.setUpdatePasswordForm,
      merged.submitUpdatePassword,
    ],
  )

  const shellViewModel = useMemo(
    () => ({
      token: resolvedToken,
      tenantId: resolvedTenantId,
      logout: merged.logout,
      modules: merged.modules,
      theme: resolvedTheme,
      toggleTheme: resolvedToggleTheme,
      summary: merged.summary,
    }),
    [
      resolvedToken,
      resolvedTenantId,
      merged.logout,
      merged.modules,
      resolvedTheme,
      resolvedToggleTheme,
      merged.summary,
    ],
  )

  return useMemo(
    () => ({
      authMessage: merged.authMessage,
      isAuthenticated: Boolean(resolvedToken),
      authViewModel,
      shellViewModel,
    }),
    [merged.authMessage, resolvedToken, authViewModel, shellViewModel],
  )
}
