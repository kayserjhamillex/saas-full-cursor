import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RouterViewModelProvider, useRouterViewModel } from './RouterViewModelContext'

function Consumer() {
  const context = useRouterViewModel()
  return <p>{context.label}</p>
}

describe('RouterViewModelContext', () => {
  it('entrega contexto dentro del provider', () => {
    render(
      <RouterViewModelProvider value={{ label: 'ok-context' }}>
        <Consumer />
      </RouterViewModelProvider>,
    )

    expect(screen.getByText('ok-context')).toBeInTheDocument()
  })

  it('lanza error si se usa fuera del provider', () => {
    expect(() => render(<Consumer />)).toThrow(
      'useRouterViewModel debe usarse dentro de RouterViewModelProvider',
    )
  })
})
