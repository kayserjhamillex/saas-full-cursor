import { NavLink } from 'react-router-dom'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import AuthLayout from '../../components/auth/AuthLayout'

function LoginPage() {
  const { authViewModel: auth } = useRouterViewModel()

  return (
    <AuthLayout title="Login" subtitle="Accede al panel clinico con credenciales del tenant.">
      <form onSubmit={auth.submitLogin} aria-busy={auth.loginLoading}>
        <label>Email<input type="email" required value={auth.loginForm.email} onChange={(e) => auth.updateLoginField('email', e.target.value)} /></label>
        <label>Password<input type="password" required value={auth.loginForm.password} onChange={(e) => auth.updateLoginField('password', e.target.value)} /></label>
        <label>Tenant ID<input required value={auth.loginForm.tenantId} onChange={(e) => auth.updateLoginField('tenantId', e.target.value)} /></label>
        <button type="submit" disabled={auth.loginLoading}>{auth.loginLoading ? 'Ingresando...' : 'Iniciar sesion'}</button>
        <NavLink to="/recover">Recuperar password</NavLink>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
