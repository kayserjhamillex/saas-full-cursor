import { Route } from 'react-router-dom'
import ProtectedShellPage from '../../pages/dashboard/ProtectedShellPage'
import ProtectedRoute from './ProtectedRoute'

export function buildProtectedAppRoute({ isAuthenticated }) {
  return (
    <Route
      path="/*"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <ProtectedShellPage />
        </ProtectedRoute>
      }
    />
  )
}
