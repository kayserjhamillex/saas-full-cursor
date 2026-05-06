import { NavLink } from 'react-router-dom'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import AuthLayout from '../../components/auth/AuthLayout'

function VerifyCodePage() {
  const { authViewModel: auth } = useRouterViewModel()

  return (
    <AuthLayout title="Verify code" subtitle="Valida el codigo recibido para habilitar cambio de password.">
      <form onSubmit={auth.submitVerifyCode}>
        <label>Email<input type="email" required value={auth.recoverEmail} onChange={(e) => auth.setRecoverEmail(e.target.value)} /></label>
        <label>Codigo<input required value={auth.verifyCode} onChange={(e) => auth.setVerifyCode(e.target.value)} /></label>
        <button type="submit">Verificar codigo</button>
        <NavLink to="/update-password">Continuar a cambio password</NavLink>
      </form>
    </AuthLayout>
  )
}

export default VerifyCodePage
