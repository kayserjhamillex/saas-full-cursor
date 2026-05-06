import { describe, expect, it, vi } from 'vitest'
import {
  getExternalFileMetadata,
  sendExternalEmail,
  sendExternalWhatsapp,
  uploadExternalFile,
} from './externalServicesService'

const sendEmailNotificationMock = vi.fn()
const sendWhatsappNotificationMock = vi.fn()
const uploadFileToGatewayMock = vi.fn()
const getFileMetadataFromGatewayMock = vi.fn()

vi.mock('../notifications/notificationsService', () => ({
  sendEmailNotification: (...args) => sendEmailNotificationMock(...args),
  sendWhatsappNotification: (...args) => sendWhatsappNotificationMock(...args),
}))

vi.mock('../files/filesService', () => ({
  uploadFileToGateway: (...args) => uploadFileToGatewayMock(...args),
  getFileMetadataFromGateway: (...args) => getFileMetadataFromGatewayMock(...args),
}))

describe('externalServicesService', () => {
  it('sendExternalEmail delega en sendEmailNotification', async () => {
    sendEmailNotificationMock.mockResolvedValueOnce({ ok: true })
    const payload = { to: 'demo@test.com' }

    await sendExternalEmail({ token: 't', tenantId: 'tenant-1', payload })

    expect(sendEmailNotificationMock).toHaveBeenCalledWith({
      token: 't',
      tenantId: 'tenant-1',
      payload,
    })
  })

  it('sendExternalWhatsapp delega en sendWhatsappNotification', async () => {
    sendWhatsappNotificationMock.mockResolvedValueOnce({ ok: true })
    const payload = { phoneNumber: '+54911' }

    await sendExternalWhatsapp({ token: 't', tenantId: 'tenant-1', payload })

    expect(sendWhatsappNotificationMock).toHaveBeenCalledWith({
      token: 't',
      tenantId: 'tenant-1',
      payload,
    })
  })

  it('uploadExternalFile delega en uploadFileToGateway', async () => {
    uploadFileToGatewayMock.mockResolvedValueOnce({ id: 'file-1' })
    const payload = { fileName: 'demo.png' }

    await uploadExternalFile({ token: 't', tenantId: 'tenant-1', payload })

    expect(uploadFileToGatewayMock).toHaveBeenCalledWith({
      token: 't',
      tenantId: 'tenant-1',
      payload,
    })
  })

  it('getExternalFileMetadata delega en getFileMetadataFromGateway', async () => {
    getFileMetadataFromGatewayMock.mockResolvedValueOnce({ id: 'file-1' })

    await getExternalFileMetadata({ token: 't', tenantId: 'tenant-1', fileId: 'file-1' })

    expect(getFileMetadataFromGatewayMock).toHaveBeenCalledWith({
      token: 't',
      tenantId: 'tenant-1',
      fileId: 'file-1',
    })
  })
})
