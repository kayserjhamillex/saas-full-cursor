import { describe, expect, it, vi } from 'vitest'
import { getFileMetadataFromGateway, uploadFileToGateway } from './filesService'

const requestMock = vi.fn()
const buildAuthHeadersMock = vi.fn()

vi.mock('../http/apiClient', () => ({
  request: (...args) => requestMock(...args),
}))

vi.mock('../http/authHeaders', () => ({
  buildAuthHeaders: (...args) => buildAuthHeadersMock(...args),
}))

describe('filesService', () => {
  it('uploadFileToGateway envia POST con payload serializado', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ Authorization: 'Bearer t' })
    requestMock.mockResolvedValueOnce({ id: 'file-1' })

    await uploadFileToGateway({
      token: 't',
      tenantId: 'tenant-1',
      payload: { fileName: 'demo.png' },
    })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'files/upload',
        method: 'POST',
        body: JSON.stringify({ fileName: 'demo.png' }),
      }),
    )
  })

  it('getFileMetadataFromGateway envia GET con query tenantId', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ Authorization: 'Bearer t' })
    requestMock.mockResolvedValueOnce({ id: 'file-1' })

    await getFileMetadataFromGateway({
      token: 't',
      tenantId: 'tenant-1',
      fileId: 'file-1',
    })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'files/file-1',
        method: 'GET',
        query: { tenantId: 'tenant-1' },
      }),
    )
  })
})
