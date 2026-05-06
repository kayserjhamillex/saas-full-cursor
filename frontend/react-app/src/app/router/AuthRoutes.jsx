import { Route } from 'react-router-dom'
import LoginPage from '../../pages/auth/LoginPage'
import RecoverPage from '../../pages/auth/RecoverPage'
import VerifyCodePage from '../../pages/auth/VerifyCodePage'
import UpdatePasswordPage from '../../pages/auth/UpdatePasswordPage'

export function buildAuthRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover" element={<RecoverPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
    </>
  )
}
