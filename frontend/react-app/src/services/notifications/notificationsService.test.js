import { describe, expect, it, vi } from 'vitest'
import { sendEmailNotification, sendWhatsappNotification } from './notificationsService'

const requestMock = vi.fn()
const buildAuthHeadersMock = vi.fn()

vi.mock('../http/apiClient', () => ({
  request: (...args) => requestMock(...args),
}))

vi.mock('../http/authHeaders', () => ({
  buildAuthHeaders: (...args) => buildAuthHeadersMock(...args),
}))

describe('notificationsService', () => {
  it('sendEmailNotification envia request correcto', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ Authorization: 'Bearer t' })
    requestMock.mockResolvedValueOnce({ ok: true })

    await sendEmailNotification({
      token: 't',
      tenantId: 'tenant-1',
      payload: { to: 'demo@test.com', subject: 'Hola' },
    })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'notifications/email',
        method: 'POST',
      }),
    )
  })

  it('sendWhatsappNotification envia request correcto', async () => {
    buildAuthHeadersMock.mockReturnValueOnce({ Authorization: 'Bearer t' })
    requestMock.mockResolvedValueOnce({ ok: true })

    await sendWhatsappNotification({
      token: 't',
      tenantId: 'tenant-1',
      payload: { phoneNumber: '+54911', message: 'Hola' },
    })

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'notifications/whatsapp',
        method: 'POST',
      }),
    )
  })
})
