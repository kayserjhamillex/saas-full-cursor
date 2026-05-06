import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRouter from './AppRouter'
import { buildAppRouterProps } from '../../test/utils/routerTestUtils'

describe('AppRouter', () => {
  it('renderiza pantalla de login en /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter {...buildAppRouterProps()} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Iniciar sesion' })).toBeInTheDocument()
  })

  it('redirige a login al entrar a ruta protegida sin token', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter {...buildAppRouterProps({ token: '' })} />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('button', { name: 'Iniciar sesion' })).toBeInTheDocument()
  })

  it('renderiza contenido protegido cuando hay token', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter {...buildAppRouterProps({ token: 'token-valido', tenantId: 'tenant-1' })} />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Operacion clinica diaria')).toBeInTheDocument()
  })

  it('permite navegar entre pantallas del flujo auth por links', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter
          {...buildAppRouterProps({
            token: '',
            recoverEmail: 'demo@test.com',
            verifyCode: '9999',
            updatePasswordForm: { code: '9999', password: 'abc123', confirmPassword: 'abc123' },
          })}
        />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('link', { name: 'Recuperar password' }))
    expect(await screen.findByRole('button', { name: 'Enviar codigo' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Ya tengo codigo' }))
    expect(await screen.findByRole('button', { name: 'Verificar codigo' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Continuar a cambio password' }))
    expect(await screen.findByRole('button', { name: 'Actualizar password' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Ir a login' }))
    expect(await screen.findByRole('button', { name: 'Iniciar sesion' })).toBeInTheDocument()
  })

  it('ejecuta handlers submit de paginas auth y muestra authMessage global', async () => {
    const submitRecover = vi.fn((event) => event.preventDefault())
    const submitVerifyCode = vi.fn((event) => event.preventDefault())
    const submitUpdatePassword = vi.fn((event) => event.preventDefault())

    const common = buildAppRouterProps({
      token: '',
      authMessage: 'Error global de autenticacion',
      submitRecover,
      submitVerifyCode,
      submitUpdatePassword,
      recoverEmail: 'demo@test.com',
      verifyCode: '1234',
      updatePasswordForm: { code: '1234', password: 'abc123', confirmPassword: 'abc123' },
    })

    render(
      <MemoryRouter initialEntries={['/recover']}>
        <AppRouter {...common} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Error global de autenticacion')
    fireEvent.submit(screen.getByRole('button', { name: 'Enviar codigo' }).closest('form'))
    expect(submitRecover).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('link', { name: 'Ya tengo codigo' }))
    fireEvent.submit(screen.getByRole('button', { name: 'Verificar codigo' }).closest('form'))
    expect(submitVerifyCode).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('link', { name: 'Continuar a cambio password' }))
    fireEvent.submit(screen.getByRole('button', { name: 'Actualizar password' }).closest('form'))
    expect(submitUpdatePassword).toHaveBeenCalledTimes(1)
  })

  it('protege rutas segun sesion: sin token va a login, con token entra al shell', async () => {
    const common = buildAppRouterProps({
      modules: [{ key: 'dashboard', to: '/', label: 'Inicio', enabled: true }],
      summary: [{ label: 'Citas del dia', value: '32' }],
      tenantId: 'tenant-1',
    })

    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter {...common} token="" />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('button', { name: 'Iniciar sesion' })).toBeInTheDocument()

    unmount()

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter {...common} token="token-valido" />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Operacion clinica diaria')).toBeInTheDocument()
  })
})
