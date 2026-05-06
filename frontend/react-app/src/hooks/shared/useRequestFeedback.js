import { useState } from 'react'

function initialState() {
  return { loading: false, success: '', error: '' }
}

export function useRequestFeedback() {
  const [state, setState] = useState(initialState)

  async function execute(action, options = {}) {
    const {
      onSuccess,
      onError,
      successMessage,
      fallbackErrorMessage = 'Ocurrio un error al procesar la solicitud.',
    } = options

    setState({ loading: true, success: '', error: '' })

    try {
      const result = await action()
      const nextSuccess =
        typeof successMessage === 'function' ? successMessage(result) : successMessage || ''

      setState({ loading: false, success: nextSuccess, error: '' })
      if (onSuccess) onSuccess(result)
      return result
    } catch (error) {
      const nextError = error?.message || fallbackErrorMessage
      setState({ loading: false, success: '', error: nextError })
      if (onError) onError(error)
      return null
    }
  }

  return {
    state,
    execute,
  }
}
