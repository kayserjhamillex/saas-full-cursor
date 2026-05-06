const THEME_KEY = 'clinical-theme'
const DEFAULT_THEME = 'light'

export function getPersistedTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME
}

export function persistTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}
