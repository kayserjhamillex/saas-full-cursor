import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useExternalServicesForms } from './useExternalServicesForms'

vi.mock('../../services/notifications/notificationsService', () => ({
  sendEmailNotification: vi.fn(),
  sendWhatsappNotification: vi.fn(),
}))

vi.mock('../../services/external/externalServicesService', () => ({
  sendExternalEmail: vi.fn(),
  sendExternalWhatsapp: vi.fn(),
  uploadExternalFile: vi.fn(),
  getExternalFileMetadata: vi.fn(),
}))

import {
  getExternalFileMetadata,
  sendExternalEmail,
  sendExternalWhatsapp,
  uploadExternalFile,
} from '../../services/external'

function submitEvent() {
  return { preventDefault: vi.fn() }
}

describe('useExternalServicesForms', () => {
  it('marca loading y luego success al enviar correo', async () => {
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    sendExternalEmail.mockReturnValueOnce(pendingRequest)

    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    let requestPromise
    await act(async () => {
      requestPromise = result.current.sendEmail(submitEvent())
    })

    expect(result.current.emailStatus.loading).toBe(true)
    expect(result.current.emailStatus.success).toBe('')
    expect(result.current.emailStatus.error).toBe('')

    resolveRequest({})

    await act(async () => {
      await requestPromise
    })

    expect(result.current.emailStatus.loading).toBe(false)
    expect(result.current.emailStatus.success).toBe('Correo enviado correctamente.')
    expect(result.current.emailStatus.error).toBe('')
  })

  it('guarda error en metadata cuando la consulta falla', async () => {
    getExternalFileMetadata.mockRejectedValueOnce(new Error('Error metadata'))

    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    await act(async () => {
      result.current.setFileIdQuery('file-1')
    })

    await act(async () => {
      await result.current.getFileMetadata(submitEvent())
    })

    expect(result.current.metadataStatus.loading).toBe(false)
    expect(result.current.metadataStatus.success).toBe('')
    expect(result.current.metadataStatus.error).toBe('Error metadata')
  })

  it('usa fallbackErrorMessage cuando error no trae message', async () => {
    getExternalFileMetadata.mockRejectedValueOnce({})
    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    await act(async () => {
      result.current.setFileIdQuery('file-2')
      await result.current.getFileMetadata(submitEvent())
    })

    expect(result.current.metadataStatus.error).toBe('No se pudo consultar metadata del archivo.')
  })

  it('actualiza fileIdQuery y success al subir archivo', async () => {
    uploadExternalFile.mockResolvedValueOnce({ id: 'abc-123' })

    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    await act(async () => {
      result.current.setFilePayload((prev) => ({
        ...prev,
        patientId: 'p-1',
        encounterId: 'e-1',
        fileName: 'demo.png',
        mimeType: 'image/png',
        fileBase64: 'ZmFrZQ==',
      }))
    })

    await act(async () => {
      await result.current.uploadFile(submitEvent())
    })

    expect(result.current.uploadStatus.loading).toBe(false)
    expect(result.current.uploadStatus.error).toBe('')
    expect(result.current.uploadStatus.success).toContain('abc-123')
    expect(result.current.fileIdQuery).toBe('abc-123')
  })

  it('envia whatsapp con success', async () => {
    sendExternalWhatsapp.mockResolvedValueOnce({ ok: true })
    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    await act(async () => {
      result.current.setWhatsPayload((prev) => ({
        ...prev,
        phoneNumber: '+54911',
        message: 'hola',
      }))
      await result.current.sendWhatsapp(submitEvent())
    })

    expect(result.current.whatsappStatus.error).toBe('')
    expect(result.current.whatsappStatus.success).toBe('WhatsApp enviado correctamente.')
  })

  it('consulta metadata exitosamente y guarda fileMeta', async () => {
    getExternalFileMetadata.mockResolvedValueOnce({ id: 'file-99', size: 123 })
    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))

    await act(async () => {
      result.current.setFileIdQuery('file-99')
      await result.current.getFileMetadata(submitEvent())
    })

    expect(result.current.metadataStatus.success).toBe('Metadata consultada correctamente.')
    expect(result.current.fileMeta).toEqual({ id: 'file-99', size: 123 })
  })

  it('handleFileSelection no cambia estado si no hay archivo', async () => {
    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))
    const initialPayload = result.current.filePayload

    await act(async () => {
      await result.current.handleFileSelection({ target: { files: [] } })
    })

    expect(result.current.filePayload).toEqual(initialPayload)
  })

  it('handleFileSelection guarda metadata y base64 cuando FileReader retorna data URL', async () => {
    const originalFileReader = globalThis.FileReader
    globalThis.FileReader = class {
      readAsDataURL() {
        this.result = 'data:image/png;base64,ZmFrZQ=='
        this.onload()
      }
    }

    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))
    const file = new File(['demo'], 'demo.png', { type: 'image/png' })

    await act(async () => {
      await result.current.handleFileSelection({ target: { files: [file] } })
    })

    expect(result.current.filePayload.fileName).toBe('demo.png')
    expect(result.current.filePayload.mimeType).toBe('image/png')
    expect(result.current.filePayload.fileBase64).toBe('ZmFrZQ==')
    globalThis.FileReader = originalFileReader
  })

  it('handleFileSelection propaga error cuando FileReader falla', async () => {
    const originalFileReader = globalThis.FileReader
    globalThis.FileReader = class {
      readAsDataURL() {
        this.onerror(new Error('read failed'))
      }
    }

    const { result } = renderHook(() => useExternalServicesForms({ token: 't', tenantId: 'tenant-1' }))
    const file = new File(['demo'], 'demo.png', { type: 'image/png' })

    await expect(
      result.current.handleFileSelection({ target: { files: [file] } }),
    ).rejects.toThrow('read failed')

    globalThis.FileReader = originalFileReader
  })
})
