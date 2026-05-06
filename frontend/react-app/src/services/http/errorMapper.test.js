import { describe, expect, it } from 'vitest'
import { mapHttpError, mapNetworkError } from './errorMapper'

describe('errorMapper', () => {
  it('mapea AbortError a REQUEST_ABORTED', () => {
    const error = mapNetworkError({ name: 'AbortError' })

    expect(error.message).toBe('La solicitud fue cancelada o excedio el tiempo limite.')
    expect(error.code).toBe('REQUEST_ABORTED')
  })

  it('mapea error de red generico a NETWORK_ERROR', () => {
    const originalError = new Error('network down')
    const error = mapNetworkError(originalError)

    expect(error.message).toBe('No se pudo establecer comunicacion con el servidor.')
    expect(error.code).toBe('NETWORK_ERROR')
    expect(error.cause).toBe(originalError)
  })

  it('prioriza payload.message al mapear error HTTP', async () => {
    const response = {
      status: 400,
      json: async () => ({ message: 'Email invalido' }),
    }

    const error = await mapHttpError(response)
    expect(error.message).toBe('Email invalido')
    expect(error.status).toBe(400)
    expect(error.payload).toEqual({ message: 'Email invalido' })
  })

  it('usa fallback por status cuando no hay payload JSON', async () => {
    const response = {
      status: 404,
      json: async () => {
        throw new Error('invalid json')
      },
    }

    const error = await mapHttpError(response)
    expect(error.message).toBe('Recurso no encontrado.')
    expect(error.status).toBe(404)
    expect(error.payload).toBeNull()
  })

  it('usa payload.error cuando no existe payload.message', async () => {
    const response = {
      status: 422,
      json: async () => ({ error: 'Payload invalido' }),
    }

    const error = await mapHttpError(response)
    expect(error.message).toBe('Payload invalido')
  })

  it('usa mensaje por default para status no mapeado', async () => {
    const response = {
      status: 418,
      json: async () => {
        throw new Error('bad payload')
      },
    }

    const error = await mapHttpError(response)
    expect(error.message).toBe('Error de comunicacion con el servidor.')
  })
})
