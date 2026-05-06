import { useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RouterViewModelProvider } from '../providers/RouterViewModelContext'
import { useAppRouterViewModel } from '../../hooks/app/useAppRouterViewModel'
import { buildAuthRoutes } from './AuthRoutes'
import { buildProtectedAppRoute } from './ProtectedAppRoute'

function AppRouter(props = {}) {
  const { authMessage, authViewModel, shellViewModel, isAuthenticated } = useAppRouterViewModel(props)
  const contextValue = useMemo(
    () => ({
      ui: { authMessage },
      authViewModel,
      shellViewModel,
      isAuthenticated,
    }),
    [authMessage, authViewModel, shellViewModel, isAuthenticated],
  )

  return (
    <RouterViewModelProvider value={contextValue}>
      <main>
        {authMessage && (
          <p className="auth-message" role="alert" aria-live="assertive">
            {authMessage}
          </p>
        )}
        <Routes>
          {buildAuthRoutes()}
          {buildProtectedAppRoute({ isAuthenticated })}
        </Routes>
      </main>
    </RouterViewModelProvider>
  )
}

export default AppRouter
