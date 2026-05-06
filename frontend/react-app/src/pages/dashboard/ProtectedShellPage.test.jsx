import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedShellPage from './ProtectedShellPage'

const useRouterViewModelMock = vi.fn()

vi.mock('../../app/providers/RouterViewModelContext', () => ({
  useRouterViewModel: () => useRouterViewModelMock(),
}))

vi.mock('./ShellRoutes', () => ({
  default: function ShellRoutesMock() {
    return <section aria-label="shell-routes-mock">Contenido de rutas</section>
  },
}))

function buildShellViewModel() {
  return {
    shellViewModel: {
      token: 'token-test',
      tenantId: 'tenant-test',
      logout: vi.fn(),
      modules: [
        { key: 'dashboard', to: '/', label: 'Inicio', enabled: true },
        { key: 'external', to: '/servicios', label: 'Servicios externos', enabled: true },
      ],
      theme: 'light',
      toggleTheme: vi.fn(),
      summary: [
        { label: 'Citas del dia', value: '32' },
        { label: 'Pacientes en sala', value: '11' },
      ],
    },
  }
}

describe('ProtectedShellPage', () => {
  it('muestra skeleton inicialmente y luego indicadores al finalizar carga', () => {
    vi.useFakeTimers()
    useRouterViewModelMock.mockReturnValue(buildShellViewModel())

    const { container } = render(
      <MemoryRouter>
        <ProtectedShellPage />
      </MemoryRouter>,
    )

    const indicatorsSection = screen.getByLabelText('Indicadores')
    expect(indicatorsSection).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelectorAll('.stat-skeleton')).toHaveLength(3)

    act(() => {
      vi.advanceTimersByTime(560)
    })

    expect(screen.getByText('Citas del dia')).toBeInTheDocument()
    expect(screen.getByText('32')).toBeInTheDocument()
    expect(screen.getByText('Pacientes en sala')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(container.querySelectorAll('.stat-skeleton')).toHaveLength(0)

    vi.useRealTimers()
  })

  it('limpia el timer al desmontar el componente', () => {
    vi.useFakeTimers()
    useRouterViewModelMock.mockReturnValue(buildShellViewModel())
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { unmount } = render(
      <MemoryRouter>
        <ProtectedShellPage />
      </MemoryRouter>,
    )

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
    clearTimeoutSpy.mockRestore()
    vi.useRealTimers()
  })
})
