import { createContext, useContext } from 'react'

const RouterViewModelContext = createContext(null)

export function RouterViewModelProvider({ value, children }) {
  return (
    <RouterViewModelContext.Provider value={value}>
      {children}
    </RouterViewModelContext.Provider>
  )
}

export function useRouterViewModel() {
  const context = useContext(RouterViewModelContext)
  if (!context) {
    throw new Error('useRouterViewModel debe usarse dentro de RouterViewModelProvider')
  }
  return context
}
