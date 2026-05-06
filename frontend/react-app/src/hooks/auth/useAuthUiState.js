import { useState } from 'react'

export function useAuthUiState() {
  const [authMessage, setAuthMessage] = useState('')

  function clearAuthMessage() {
    setAuthMessage('')
  }

  return {
    authMessage,
    setAuthMessage,
    clearAuthMessage,
  }
}
