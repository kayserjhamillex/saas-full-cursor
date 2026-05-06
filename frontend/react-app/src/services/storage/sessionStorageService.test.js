import { describe, expect, it } from 'vitest'
import {
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from './sessionStorageService'

describe('sessionStorageService', () => {
  it('persistSession y getPersistedSession trabajan con localStorage', () => {
    persistSession({ token: 'token-1', tenantId: 'tenant-1' })

    expect(getPersistedSession()).toEqual({
      token: 'token-1',
      tenantId: 'tenant-1',
    })
  })

  it('clearPersistedSession limpia los valores', () => {
    persistSession({ token: 'token-2', tenantId: 'tenant-2' })
    clearPersistedSession()

    expect(getPersistedSession()).toEqual({
      token: '',
      tenantId: '',
    })
  })
})
