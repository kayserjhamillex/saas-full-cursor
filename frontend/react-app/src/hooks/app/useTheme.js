import { useEffect, useState } from 'react'
import {
  applyTheme,
  getPersistedTheme,
  persistTheme,
} from '../../services/storage/themeStorageService'

export function useTheme() {
  const [theme, setTheme] = useState(() => getPersistedTheme())

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
