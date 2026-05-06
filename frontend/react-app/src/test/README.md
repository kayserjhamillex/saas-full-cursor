# Convenciones de Testing

Guia rapida para mantener consistencia en la suite de pruebas.

## Helpers comunes

Usar `src/test/utils/routerTestUtils.jsx` para evitar duplicacion:

- `buildAppRouterProps(overrides)`
- `buildAuthViewModel(overrides)`
- `buildRouterProviderValue(overrides)`
- `renderWithRouterViewModel(ui, { route, providerValue })`

## Reglas practicas

- Preferir `renderWithRouterViewModel` cuando el componente consume `useRouterViewModel`.
- Usar `buildAppRouterProps` para tests de `AppRouter`.
- Mantener mocks y builders pequeños, con `overrides` por caso.
- Validar comportamiento observable (UI, callbacks, navegacion), no detalles internos de implementacion.
- Para formularios con `required`, preferir `fireEvent.submit(form)` cuando aplique.

## Plantilla sugerida

```jsx
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouterViewModel } from '../test/utils/routerTestUtils'
import Componente from './Componente'

describe('Componente', () => {
  it('ejecuta accion esperada', () => {
    const onAction = vi.fn()
    renderWithRouterViewModel(<Componente onAction={onAction} />, { route: '/' })

    fireEvent.click(screen.getByRole('button', { name: 'Accion' }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
```

## Comandos utiles

- `pnpm test`
- `pnpm vitest run --coverage`
