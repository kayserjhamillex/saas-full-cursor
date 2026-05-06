import { loginRequest, postAuthRequest } from './authService'

export function authenticateUser(credentials) {
  return loginRequest(credentials)
}

export function requestRecoveryCode({ email, tenantId }) {
  return postAuthRequest('recover', { email, tenantId })
}

export function verifyRecoveryCode({ email, tenantId, code }) {
  return postAuthRequest('verify-code', { email, tenantId, code })
}

export function updateUserPassword({ email, tenantId, code, newPassword }) {
  return postAuthRequest('update-password', {
    email,
    tenantId,
    code,
    newPassword,
  })
}
