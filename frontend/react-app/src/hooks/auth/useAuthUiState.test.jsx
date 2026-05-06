import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAuthUiState } from './useAuthUiState'

describe('useAuthUiState', () => {
  it('permite setear y limpiar authMessage', () => {
    const { result } = renderHook(() => useAuthUiState())

    act(() => {
      result.current.setAuthMessage('Mensaje de error')
    })
    expect(result.current.authMessage).toBe('Mensaje de error')

    act(() => {
      result.current.clearAuthMessage()
    })
    expect(result.current.authMessage).toBe('')
  })
})
