import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildAuthViewModel, renderWithRouterViewModel } from '../../test/utils/routerTestUtils'
import RecoverPage from './RecoverPage'
import UpdatePasswordPage from './UpdatePasswordPage'
import VerifyCodePage from './VerifyCodePage'

function renderWithProvider(page, authOverrides = {}) {
  renderWithRouterViewModel(page, {
    providerValue: {
      isAuthenticated: false,
      shellViewModel: {},
      authViewModel: buildAuthViewModel(authOverrides),
    },
  })
}

describe('Auth flow pages', () => {
  it('ejecuta submitRecover en RecoverPage', () => {
    const submitRecover = vi.fn((event) => event.preventDefault())
    const setRecoverEmail = vi.fn()
    const setTenantId = vi.fn()
    renderWithProvider(<RecoverPage />, { submitRecover, setRecoverEmail, setTenantId })

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } })
    fireEvent.change(screen.getByLabelText('Tenant ID'), { target: { value: 'tenant-99' } })

    fireEvent.click(screen.getByRole('button', { name: 'Enviar codigo' }))

    expect(setRecoverEmail).toHaveBeenCalledWith('new@test.com')
    expect(setTenantId).toHaveBeenCalledWith('tenant-99')
    expect(submitRecover).toHaveBeenCalledTimes(1)
  })

  it('ejecuta submitVerifyCode en VerifyCodePage', () => {
    const submitVerifyCode = vi.fn((event) => event.preventDefault())
    const setRecoverEmail = vi.fn()
    const setVerifyCode = vi.fn()
    renderWithProvider(<VerifyCodePage />, { submitVerifyCode, setRecoverEmail, setVerifyCode })

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'verify@test.com' } })
    fireEvent.change(screen.getByLabelText('Codigo'), { target: { value: '0000' } })

    fireEvent.click(screen.getByRole('button', { name: 'Verificar codigo' }))

    expect(setRecoverEmail).toHaveBeenCalledWith('verify@test.com')
    expect(setVerifyCode).toHaveBeenCalledWith('0000')
    expect(submitVerifyCode).toHaveBeenCalledTimes(1)
  })

  it('ejecuta submitUpdatePassword en UpdatePasswordPage', () => {
    const submitUpdatePassword = vi.fn((event) => event.preventDefault())
    const updatePasswordField = vi.fn()
    renderWithProvider(<UpdatePasswordPage />, { submitUpdatePassword, updatePasswordField })

    fireEvent.change(screen.getByLabelText('Codigo'), { target: { value: '1111' } })
    fireEvent.change(screen.getByLabelText('Nueva password'), { target: { value: 'new-pass' } })
    fireEvent.change(screen.getByLabelText('Confirmar password'), { target: { value: 'new-pass-confirm' } })

    fireEvent.click(screen.getByRole('button', { name: 'Actualizar password' }))

    expect(updatePasswordField).toHaveBeenCalledWith('code', '1111')
    expect(updatePasswordField).toHaveBeenCalledWith('password', 'new-pass')
    expect(updatePasswordField).toHaveBeenCalledWith('confirmPassword', 'new-pass-confirm')
    expect(submitUpdatePassword).toHaveBeenCalledTimes(1)
  })
})
