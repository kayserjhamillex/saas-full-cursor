import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SessionHeader from './SessionHeader'
import Topbar from './Topbar'

describe('Layout branch coverage', () => {
  it('Topbar muestra "Modo claro" cuando theme es dark', () => {
    const onToggleTheme = vi.fn()
    render(<Topbar theme="dark" onToggleTheme={onToggleTheme} />)

    const button = screen.getByRole('button', { name: 'Modo claro' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(onToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('SessionHeader usa fallback cuando tenantId viene vacio', () => {
    const onLogout = vi.fn()
    render(<SessionHeader tenantId="" onLogout={onLogout} />)

    expect(screen.getByText('Tenant activo: no definido')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesion' }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
