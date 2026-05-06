import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EmailServiceCard from './EmailServiceCard'
import FileMetadataServiceCard from './FileMetadataServiceCard'
import FileUploadServiceCard from './FileUploadServiceCard'
import WhatsappServiceCard from './WhatsappServiceCard'

describe('External service cards', () => {
  it('EmailServiceCard llama update y submit', () => {
    const updateEmailField = vi.fn()
    const sendEmail = vi.fn((event) => event.preventDefault())
    render(
      <EmailServiceCard
        emailPayload={{
          to: 'a@a.com',
          subject: 'hola',
          template: 'tpl',
          patientName: '',
          appointmentDate: '',
        }}
        updateEmailField={updateEmailField}
        sendEmail={sendEmail}
        emailStatus={{ loading: false, error: '', success: '' }}
      />,
    )

    fireEvent.change(screen.getByLabelText('Paciente'), { target: { value: 'Ana' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Enviar correo' }).closest('form'))

    expect(updateEmailField).toHaveBeenCalledWith('patientName', 'Ana')
    expect(sendEmail).toHaveBeenCalledTimes(1)
  })

  it('WhatsappServiceCard renderiza feedback de error', () => {
    render(
      <WhatsappServiceCard
        whatsPayload={{ phoneNumber: '', message: '', eventType: '' }}
        updateWhatsappField={vi.fn()}
        sendWhatsapp={vi.fn((event) => event.preventDefault())}
        whatsappStatus={{ loading: false, error: 'Error WA', success: '' }}
      />,
    )

    expect(screen.getByText('Error WA')).toBeInTheDocument()
  })

  it('FileUploadServiceCard ejecuta seleccion de archivo', () => {
    const handleFileSelection = vi.fn()
    render(
      <FileUploadServiceCard
        filePayload={{
          patientId: 'p',
          encounterId: 'e',
          sourceModule: 'clinical',
          fileName: '',
          mimeType: '',
          fileBase64: '',
        }}
        updateFileField={vi.fn()}
        uploadFile={vi.fn((event) => event.preventDefault())}
        uploadStatus={{ loading: false, error: '', success: '' }}
        handleFileSelection={handleFileSelection}
      />,
    )

    const input = screen.getByLabelText('Archivo')
    const file = new File(['abc'], 'a.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(handleFileSelection).toHaveBeenCalledTimes(1)
  })

  it('FileMetadataServiceCard muestra empty state cuando no hay metadata', () => {
    render(
      <FileMetadataServiceCard
        fileIdQuery=""
        setFileIdQuery={vi.fn()}
        getFileMetadata={vi.fn((event) => event.preventDefault())}
        metadataStatus={{ loading: false, error: '', success: '' }}
        fileMeta={null}
      />,
    )

    expect(screen.getByText('Sin resultados. Ingresa un File ID para consultar metadata.')).toBeInTheDocument()
  })
})
