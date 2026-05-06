import { NavLink } from 'react-router-dom'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import AuthLayout from '../../components/auth/AuthLayout'

function UpdatePasswordPage() {
  const { authViewModel: auth } = useRouterViewModel()

  return (
    <AuthLayout title="Update password" subtitle="Actualiza tu password usando el codigo verificado.">
      <form onSubmit={auth.submitUpdatePassword}>
        <label>Email<input type="email" required value={auth.recoverEmail} onChange={(e) => auth.setRecoverEmail(e.target.value)} /></label>
        <label>Codigo<input required value={auth.updatePasswordForm.code} onChange={(e) => auth.updatePasswordField('code', e.target.value)} /></label>
        <label>Nueva password<input type="password" required value={auth.updatePasswordForm.password} onChange={(e) => auth.updatePasswordField('password', e.target.value)} /></label>
        <label>Confirmar password<input type="password" required value={auth.updatePasswordForm.confirmPassword} onChange={(e) => auth.updatePasswordField('confirmPassword', e.target.value)} /></label>
        <button type="submit">Actualizar password</button>
        <NavLink to="/login">Ir a login</NavLink>
      </form>
    </AuthLayout>
  )
}

export default UpdatePasswordPage
