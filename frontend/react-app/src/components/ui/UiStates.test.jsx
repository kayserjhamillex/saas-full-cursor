import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'
import SuccessState from './SuccessState'

describe('Componentes de estados UI', () => {
  it('renderiza LoadingState con mensaje por defecto y accesibilidad', () => {
    render(<LoadingState />)

    const element = screen.getByRole('status')
    expect(element).toHaveTextContent('Cargando...')
    expect(element).toHaveAttribute('aria-live', 'polite')
  })

  it('renderiza LoadingState con mensaje personalizado', () => {
    render(<LoadingState message="Procesando solicitud..." />)
    expect(screen.getByText('Procesando solicitud...')).toBeInTheDocument()
  })

  it('renderiza ErrorState con role alert', () => {
    render(<ErrorState message="No se pudo completar la accion." />)

    const element = screen.getByRole('alert')
    expect(element).toHaveTextContent('No se pudo completar la accion.')
    expect(element).toHaveAttribute('aria-live', 'assertive')
  })

  it('renderiza EmptyState como estado informativo', () => {
    render(<EmptyState message="No hay datos para mostrar." />)

    const element = screen.getByRole('status')
    expect(element).toHaveTextContent('No hay datos para mostrar.')
    expect(element).toHaveAttribute('aria-live', 'polite')
  })

  it('renderiza SuccessState como confirmacion', () => {
    render(<SuccessState message="Operacion realizada con exito." />)

    const element = screen.getByRole('status')
    expect(element).toHaveTextContent('Operacion realizada con exito.')
    expect(element).toHaveAttribute('aria-live', 'polite')
  })
})
