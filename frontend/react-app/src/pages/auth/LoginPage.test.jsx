import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouterViewModel } from '../../test/utils/routerTestUtils'
import LoginPage from './LoginPage'

describe('LoginPage', () => {
  it('ejecuta submitLogin al enviar formulario', () => {
    const submitLogin = vi.fn((event) => event.preventDefault())

    renderWithRouterViewModel(<LoginPage />, {
      route: '/login',
      providerValue: {
        isAuthenticated: false,
        shellViewModel: {},
        authViewModel: {
          loginForm: { email: 'test@demo.com', password: '123456', tenantId: 'tenant-1' },
          setLoginForm: vi.fn(),
          updateLoginField: vi.fn(),
          loginLoading: false,
          submitLogin,
        },
      },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesion' }))

    expect(submitLogin).toHaveBeenCalledTimes(1)
  })

  it('muestra estado loading con boton deshabilitado y aria-busy', () => {
    renderWithRouterViewModel(<LoginPage />, {
      route: '/login',
      providerValue: {
        isAuthenticated: false,
        shellViewModel: {},
        authViewModel: {
          loginForm: { email: 'test@demo.com', password: '123456', tenantId: 'tenant-1' },
          setLoginForm: vi.fn(),
          updateLoginField: vi.fn(),
          loginLoading: true,
          submitLogin: vi.fn(),
        },
      },
    })

    const button = screen.getByRole('button', { name: 'Ingresando...' })
    expect(button).toBeDisabled()
    expect(button.closest('form')).toHaveAttribute('aria-busy', 'true')
  })
})
