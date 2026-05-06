import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ExternalServicesPage from './ExternalServicesPage'

const useExternalServicesFormsMock = vi.fn()

vi.mock('../../hooks/external-services/useExternalServicesForms', () => ({
  useExternalServicesForms: (...args) => useExternalServicesFormsMock(...args),
}))

function buildHookValue(overrides = {}) {
  return {
    emailPayload: {
      to: 'test@demo.com',
      subject: 'Asunto',
      template: 'template-demo',
      patientName: 'Paciente Demo',
      appointmentDate: '2026-04-22',
    },
    updateEmailField: vi.fn(),
    whatsPayload: {
      phoneNumber: '+5491112345678',
      message: 'Recordatorio de cita',
      eventType: 'appointment-reminder',
    },
    updateWhatsappField: vi.fn(),
    emailStatus: { loading: false, error: '', success: '' },
    whatsappStatus: { loading: false, error: '', success: '' },
    uploadStatus: { loading: false, error: '', success: '' },
    metadataStatus: { loading: false, error: '', success: '' },
    filePayload: {
      patientId: 'patient-1',
      encounterId: 'encounter-1',
      sourceModule: 'ia',
      fileName: 'archivo.png',
      mimeType: 'image/png',
      fileBase64: 'ZmFrZQ==',
    },
    updateFileField: vi.fn(),
    fileIdQuery: '',
    setFileIdQuery: vi.fn(),
    fileMeta: null,
    sendEmail: vi.fn((event) => event.preventDefault()),
    sendWhatsapp: vi.fn((event) => event.preventDefault()),
    uploadFile: vi.fn((event) => event.preventDefault()),
    getFileMetadata: vi.fn((event) => event.preventDefault()),
    handleFileSelection: vi.fn(),
    ...overrides,
  }
}

describe('ExternalServicesPage', () => {
  it('muestra estado loading por tarjeta cuando corresponde', () => {
    useExternalServicesFormsMock.mockReturnValueOnce(
      buildHookValue({
        emailStatus: { loading: true, error: '', success: '' },
        whatsappStatus: { loading: true, error: '', success: '' },
        uploadStatus: { loading: true, error: '', success: '' },
        metadataStatus: { loading: true, error: '', success: '' },
      }),
    )

    render(<ExternalServicesPage token="token-1" tenantId="tenant-1" />)

    expect(screen.getByText('Procesando envio de correo...')).toBeInTheDocument()
    expect(screen.getByText('Enviando mensaje por WhatsApp...')).toBeInTheDocument()
    expect(screen.getByText('Subiendo archivo al repositorio...')).toBeInTheDocument()
    expect(screen.getByText('Consultando metadata del archivo...')).toBeInTheDocument()
  })

  it('muestra estados error, success y empty segun feedback', () => {
    useExternalServicesFormsMock.mockReturnValueOnce(
      buildHookValue({
        emailStatus: { loading: false, error: 'Error enviando correo', success: '' },
        whatsappStatus: { loading: false, error: '', success: 'WhatsApp enviado.' },
        uploadStatus: { loading: false, error: '', success: 'Archivo subido.' },
        metadataStatus: { loading: false, error: '', success: '' },
        fileMeta: null,
      }),
    )

    render(<ExternalServicesPage token="token-2" tenantId="tenant-2" />)

    expect(screen.getByText('Error enviando correo')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp enviado.')).toBeInTheDocument()
    expect(screen.getByText('Archivo subido.')).toBeInTheDocument()
    expect(screen.getByText('Sin resultados. Ingresa un File ID para consultar metadata.')).toBeInTheDocument()
  })

  it('dispara handlers al enviar formularios y actualizar file id', () => {
    const sendEmail = vi.fn((event) => event.preventDefault())
    const sendWhatsapp = vi.fn((event) => event.preventDefault())
    const uploadFile = vi.fn((event) => event.preventDefault())
    const getFileMetadata = vi.fn((event) => event.preventDefault())
    const setFileIdQuery = vi.fn()

    useExternalServicesFormsMock.mockReturnValueOnce(
      buildHookValue({
        sendEmail,
        sendWhatsapp,
        uploadFile,
        getFileMetadata,
        setFileIdQuery,
      }),
    )

    render(<ExternalServicesPage token="token-3" tenantId="tenant-3" />)

    const emailForm = screen.getByRole('button', { name: 'Enviar correo' }).closest('form')
    const whatsappForm = screen.getByRole('button', { name: 'Enviar WhatsApp' }).closest('form')
    const uploadForm = screen.getByRole('button', { name: 'Subir archivo' }).closest('form')
    const metadataForm = screen.getByRole('button', { name: 'Consultar metadata' }).closest('form')

    expect(emailForm).not.toBeNull()
    expect(whatsappForm).not.toBeNull()
    expect(uploadForm).not.toBeNull()
    expect(metadataForm).not.toBeNull()

    fireEvent.submit(emailForm)
    fireEvent.submit(whatsappForm)
    fireEvent.submit(uploadForm)
    fireEvent.submit(metadataForm)
    fireEvent.change(screen.getByRole('textbox', { name: 'File ID' }), { target: { value: 'file-xyz' } })

    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendWhatsapp).toHaveBeenCalledTimes(1)
    expect(uploadFile).toHaveBeenCalledTimes(1)
    expect(getFileMetadata).toHaveBeenCalledTimes(1)
    expect(setFileIdQuery).toHaveBeenCalledWith('file-xyz')
  })

  it('dispara seleccion de archivo cuando usuario adjunta un file', () => {
    const handleFileSelection = vi.fn()
    useExternalServicesFormsMock.mockReturnValueOnce(
      buildHookValue({
        handleFileSelection,
      }),
    )

    render(<ExternalServicesPage token="token-4" tenantId="tenant-4" />)

    const input = screen.getByLabelText('Archivo')
    const file = new File(['demo'], 'demo.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })

    expect(handleFileSelection).toHaveBeenCalledTimes(1)
  })
})
