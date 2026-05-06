function defaultMessageByStatus(status) {
  switch (status) {
    case 400:
      return 'Solicitud invalida.'
    case 401:
      return 'No autorizado.'
    case 403:
      return 'Acceso denegado.'
    case 404:
      return 'Recurso no encontrado.'
    case 409:
      return 'Conflicto de datos.'
    case 422:
      return 'Error de validacion.'
    case 500:
      return 'Error interno del servidor.'
    default:
      return 'Error de comunicacion con el servidor.'
  }
}

export function mapNetworkError(error) {
  if (error?.name === 'AbortError') {
    const abort = new Error('La solicitud fue cancelada o excedio el tiempo limite.')
    abort.code = 'REQUEST_ABORTED'
    return abort
  }

  const networkError = new Error('No se pudo establecer comunicacion con el servidor.')
  networkError.code = 'NETWORK_ERROR'
  networkError.cause = error
  return networkError
}

export async function mapHttpError(response) {
  let payload

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  const message =
    payload?.message ||
    payload?.error ||
    defaultMessageByStatus(response?.status)

  const error = new Error(message)
  error.status = response?.status
  error.payload = payload
  return error
}
