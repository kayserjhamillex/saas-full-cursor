import { Navigate, Route, Routes } from 'react-router-dom'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import { shellLockedRoutes, shellPlaceholderRoutes } from '../../app/config/constants'
import LockedModule from '../../components/ui/LockedModule'
import PlaceholderPage from '../../components/ui/PlaceholderPage'
import ExternalServicesPage from '../external-services/ExternalServicesPage'

function ShellRoutes() {
  const { shellViewModel: shell } = useRouterViewModel()

  return (
    <Routes>
      {shellPlaceholderRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={(
            <PlaceholderPage
              title={route.title}
              description={route.description}
              bullets={route.bullets}
            />
          )}
        />
      ))}
      {shellLockedRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<LockedModule title={route.title} />} />
      ))}
      <Route path="/servicios" element={<ExternalServicesPage token={shell.token} tenantId={shell.tenantId} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default ShellRoutes
