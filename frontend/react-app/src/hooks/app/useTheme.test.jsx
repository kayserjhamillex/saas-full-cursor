import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

const applyThemeMock = vi.fn()
const getPersistedThemeMock = vi.fn()
const persistThemeMock = vi.fn()

vi.mock('../../services/storage/themeStorageService', () => ({
  applyTheme: (...args) => applyThemeMock(...args),
  getPersistedTheme: (...args) => getPersistedThemeMock(...args),
  persistTheme: (...args) => persistThemeMock(...args),
}))

describe('useTheme', () => {
  it('inicia con tema persistido y aplica/persiste en mount', () => {
    getPersistedThemeMock.mockReturnValueOnce('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(applyThemeMock).toHaveBeenCalledWith('dark')
    expect(persistThemeMock).toHaveBeenCalledWith('dark')
  })

  it('toggleTheme cambia de light a dark', () => {
    getPersistedThemeMock.mockReturnValueOnce('light')
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(applyThemeMock).toHaveBeenLastCalledWith('dark')
    expect(persistThemeMock).toHaveBeenLastCalledWith('dark')
  })
})
