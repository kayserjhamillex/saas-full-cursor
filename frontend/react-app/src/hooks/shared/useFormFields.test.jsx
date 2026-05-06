import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFormFields } from './useFormFields'

describe('useFormFields', () => {
  it('updateField actualiza solo el campo objetivo', () => {
    const { result } = renderHook(() =>
      useFormFields({ email: 'demo@test.com', tenantId: 'tenant-1' }),
    )

    act(() => {
      result.current.updateField('email', 'new@test.com')
    })

    expect(result.current.fields).toEqual({
      email: 'new@test.com',
      tenantId: 'tenant-1',
    })
  })
})
