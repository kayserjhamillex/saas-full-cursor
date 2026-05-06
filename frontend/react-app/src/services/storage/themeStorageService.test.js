import { describe, expect, it } from 'vitest'
import { applyTheme, getPersistedTheme, persistTheme } from './themeStorageService'

describe('themeStorageService', () => {
  it('retorna light por defecto cuando no existe tema guardado', () => {
    localStorage.removeItem('clinical-theme')
    expect(getPersistedTheme()).toBe('light')
  })

  it('persiste y obtiene tema', () => {
    persistTheme('dark')
    expect(getPersistedTheme()).toBe('dark')
  })

  it('applyTheme actualiza dataset del documentElement', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
