import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

describe('ProtectedRoute', () => {
  it('renderiza children cuando esta autorizado', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute isAllowed>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('redirige a login cuando no esta autorizado', () => {
    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<div>Pantalla login</div>} />
          <Route
            path="/privado"
            element={(
              <ProtectedRoute isAllowed={false}>
                <div>Contenido protegido</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Pantalla login')).toBeInTheDocument()
  })
})
