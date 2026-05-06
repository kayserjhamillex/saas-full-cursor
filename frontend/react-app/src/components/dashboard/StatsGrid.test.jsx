import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatsGrid from './StatsGrid'

describe('StatsGrid', () => {
  it('muestra skeletons cuando esta cargando', () => {
    const { container } = render(<StatsGrid summary={[]} isLoading />)

    const section = screen.getByLabelText('Indicadores')
    expect(section).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelectorAll('.stat-skeleton')).toHaveLength(3)
  })

  it('muestra estado vacio cuando no hay indicadores', () => {
    render(<StatsGrid summary={[]} />)

    expect(screen.getByText('No hay indicadores disponibles en este momento.')).toBeInTheDocument()
  })

  it('muestra indicadores cuando existen datos', () => {
    render(
      <StatsGrid
        summary={[
          { label: 'Citas hoy', value: '24' },
          { label: 'Pendientes', value: '7' },
        ]}
      />,
    )

    expect(screen.getByText('Citas hoy')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('Pendientes')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
