import { NavLink } from 'react-router-dom'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import AuthLayout from '../../components/auth/AuthLayout'

function RecoverPage() {
  const { authViewModel: auth } = useRouterViewModel()

  return (
    <AuthLayout title="Recover password" subtitle="Solicita codigo de verificacion para recuperar acceso.">
      <form onSubmit={auth.submitRecover}>
        <label>Email<input type="email" required value={auth.recoverEmail} onChange={(e) => auth.setRecoverEmail(e.target.value)} /></label>
        <label>Tenant ID<input required value={auth.tenantId} onChange={(e) => auth.setTenantId(e.target.value)} /></label>
        <button type="submit">Enviar codigo</button>
        <NavLink to="/verify-code">Ya tengo codigo</NavLink>
      </form>
    </AuthLayout>
  )
}

export default RecoverPage
