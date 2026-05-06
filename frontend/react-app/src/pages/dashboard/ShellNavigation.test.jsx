import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { modules } from '../../app/config/constants'
import { renderWithRouterViewModel } from '../../test/utils/routerTestUtils'
import Sidebar from '../../components/layout/Sidebar'
import ShellRoutes from './ShellRoutes'

function renderShellAtPath(path) {
  return renderWithRouterViewModel(
    <div>
      <Sidebar modules={modules} />
      <ShellRoutes />
    </div>,
    {
      route: path,
      providerValue: {
        isAuthenticated: true,
        authViewModel: {},
        shellViewModel: {
          token: 'token-test',
          tenantId: 'tenant-test',
          modules,
          summary: [],
          theme: 'light',
          toggleTheme: vi.fn(),
          logout: vi.fn(),
        },
      },
    },
  )
}

describe('Navegacion del shell', () => {
  it('resalta ruta activa y renderiza pagina placeholder', () => {
    renderShellAtPath('/pacientes')

    const pacientesLink = screen.getByRole('link', { name: 'Pacientes' })
    expect(pacientesLink).toHaveClass('active')
    expect(screen.getByRole('heading', { name: 'Pacientes' })).toBeInTheDocument()
    expect(screen.getByText('Gestion de ficha, historial y accesos directos a atencion frecuente.')).toBeInTheDocument()
  })

  it('renderiza modulo bloqueado y badges en sidebar', () => {
    renderShellAtPath('/inventario')

    expect(screen.getByRole('heading', { name: 'Inventario' })).toBeInTheDocument()
    expect(screen.getByText('Este modulo esta visible pero bloqueado hasta activar el plan/pago correspondiente.')).toBeInTheDocument()
    expect(screen.getAllByText('Bloqueado')).toHaveLength(5)
  })

  it('redirige rutas desconocidas al inicio del shell', () => {
    renderShellAtPath('/ruta-no-existe')

    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByText('Vista principal para seguimiento rapido de operacion, prioridades, pagos y riesgo clinico.')).toBeInTheDocument()
  })
})
