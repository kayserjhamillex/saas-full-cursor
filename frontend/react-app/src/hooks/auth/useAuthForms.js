import { useCallback, useMemo, useState } from 'react'
import {
  authenticateUser,
  requestRecoveryCode,
  updateUserPassword,
  verifyRecoveryCode,
} from '../../services/auth'
import { useFormFields } from '../shared/useFormFields'
import { useRequestFeedback } from '../shared/useRequestFeedback'

export function useAuthForms({ tenantId, setSession, clearSession, setTenantId, authUi }) {
  const [internalAuthMessage, setInternalAuthMessage] = useState('')
  const authMessage = authUi?.authMessage ?? internalAuthMessage
  const setAuthMessage = authUi?.setAuthMessage ?? setInternalAuthMessage
  const [recoverEmail, setRecoverEmail] = useState('')
  const { fields: loginForm, setFields: setLoginForm, updateField: updateLoginField } = useFormFields({
    email: '',
    password: '',
    tenantId: tenantId || '',
  })
  const loginFeedback = useRequestFeedback()
  const [verifyCode, setVerifyCode] = useState('')
  const {
    fields: updatePasswordForm,
    setFields: setUpdatePasswordForm,
    updateField: updatePasswordField,
  } = useFormFields({
    code: '',
    password: '',
    confirmPassword: '',
  })

  const submitLogin = useCallback(
    async (event) => {
      event.preventDefault()
      setAuthMessage('')
      await loginFeedback.execute(
        () => authenticateUser(loginForm),
        {
          onSuccess: (data) => {
            setSession({ token: data.token, tenantId: loginForm.tenantId })
          },
          onError: (error) => {
            setAuthMessage(error.message)
          },
        },
      )
    },
    [loginFeedback, loginForm, setAuthMessage, setSession],
  )

  const submitRecover = useCallback(
    async (event) => {
      event.preventDefault()
      setAuthMessage('')
      try {
        await requestRecoveryCode({ email: recoverEmail, tenantId })
        setAuthMessage('Codigo enviado. Continua con verificacion.')
      } catch (error) {
        setAuthMessage(error.message)
      }
    },
    [recoverEmail, setAuthMessage, tenantId],
  )

  const submitVerifyCode = useCallback(
    async (event) => {
      event.preventDefault()
      setAuthMessage('')
      try {
        await verifyRecoveryCode({ email: recoverEmail, tenantId, code: verifyCode })
        setAuthMessage('Codigo valido. Ahora actualiza la password.')
      } catch (error) {
        setAuthMessage(error.message)
      }
    },
    [recoverEmail, setAuthMessage, tenantId, verifyCode],
  )

  const submitUpdatePassword = useCallback(
    async (event) => {
      event.preventDefault()
      if (updatePasswordForm.password !== updatePasswordForm.confirmPassword) {
        setAuthMessage('Las passwords no coinciden')
        return
      }
      setAuthMessage('')
      try {
        await updateUserPassword({
          email: recoverEmail,
          tenantId,
          code: updatePasswordForm.code,
          newPassword: updatePasswordForm.password,
        })
        setAuthMessage('Password actualizada. Puedes iniciar sesion.')
      } catch (error) {
        setAuthMessage(error.message)
      }
    },
    [recoverEmail, setAuthMessage, tenantId, updatePasswordForm],
  )

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  return useMemo(
    () => ({
      authMessage,
      recoverEmail,
      setRecoverEmail,
      loginForm,
      setLoginForm,
      updateLoginField,
      loginLoading: loginFeedback.state.loading,
      submitLogin,
      submitRecover,
      verifyCode,
      setVerifyCode,
      submitVerifyCode,
      updatePasswordForm,
      setUpdatePasswordForm,
      updatePasswordField,
      submitUpdatePassword,
      setTenantId,
      logout,
    }),
    [
      authMessage,
      recoverEmail,
      loginForm,
      loginFeedback.state.loading,
      submitLogin,
      submitRecover,
      verifyCode,
      submitVerifyCode,
      updatePasswordForm,
      submitUpdatePassword,
      setTenantId,
      logout,
      setRecoverEmail,
      setLoginForm,
      updateLoginField,
      setVerifyCode,
      setUpdatePasswordForm,
      updatePasswordField,
    ],
  )
}
