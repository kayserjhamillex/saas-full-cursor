import { useCallback, useMemo, useState } from 'react'
import {
  getExternalFileMetadata,
  sendExternalEmail,
  sendExternalWhatsapp,
  uploadExternalFile,
} from '../../services/external'
import { useFormFields } from '../shared/useFormFields'
import { useRequestFeedback } from '../shared/useRequestFeedback'

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const parts = result.split(',')
      resolve(parts.length > 1 ? parts[1] : '')
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useExternalServicesForms({ token, tenantId }) {
  const { fields: emailPayload, setFields: setEmailPayload, updateField: updateEmailField } = useFormFields({
    to: '',
    subject: '',
    template: 'appointment_reminder',
    patientName: '',
    appointmentDate: '',
  })
  const { fields: whatsPayload, setFields: setWhatsPayload, updateField: updateWhatsappField } = useFormFields({
    phoneNumber: '',
    message: '',
    eventType: 'appointment_confirmation',
  })
  const emailFeedback = useRequestFeedback()
  const whatsappFeedback = useRequestFeedback()
  const uploadFeedback = useRequestFeedback()
  const metadataFeedback = useRequestFeedback()
  const { fields: filePayload, setFields: setFilePayload, updateField: updateFileField } = useFormFields({
    patientId: '',
    encounterId: '',
    sourceModule: 'clinical',
    fileName: '',
    mimeType: '',
    fileBase64: '',
  })
  const [fileIdQuery, setFileIdQuery] = useState('')
  const [fileMeta, setFileMeta] = useState(null)

  const sendEmail = useCallback(
    async (event) => {
      event.preventDefault()
      await emailFeedback.execute(
        () => sendExternalEmail({
          token,
          tenantId,
          payload: {
            tenantId,
            to: emailPayload.to,
            subject: emailPayload.subject,
            template: emailPayload.template,
            variables: {
              patientName: emailPayload.patientName,
              appointmentDate: emailPayload.appointmentDate,
            },
          },
        }),
        {
          successMessage: 'Correo enviado correctamente.',
          fallbackErrorMessage: 'No se pudo enviar correo.',
        },
      )
    },
    [emailFeedback, emailPayload, tenantId, token],
  )

  const sendWhatsapp = useCallback(
    async (event) => {
      event.preventDefault()
      await whatsappFeedback.execute(
        () => sendExternalWhatsapp({
          token,
          tenantId,
          payload: {
            tenantId,
            phoneNumber: whatsPayload.phoneNumber,
            message: whatsPayload.message,
            eventType: whatsPayload.eventType,
          },
        }),
        {
          successMessage: 'WhatsApp enviado correctamente.',
          fallbackErrorMessage: 'No se pudo enviar WhatsApp.',
        },
      )
    },
    [tenantId, token, whatsappFeedback, whatsPayload],
  )

  const uploadFile = useCallback(
    async (event) => {
      event.preventDefault()
      await uploadFeedback.execute(
        () => uploadExternalFile({
          token,
          tenantId,
          payload: {
            tenantId,
            patientId: filePayload.patientId,
            encounterId: filePayload.encounterId,
            sourceModule: filePayload.sourceModule,
            fileName: filePayload.fileName,
            mimeType: filePayload.mimeType,
            fileBase64: filePayload.fileBase64,
          },
        }),
        {
          successMessage: (data) => `Archivo subido correctamente. fileId: ${data.id || 'sin id'}`,
          fallbackErrorMessage: 'No se pudo subir archivo.',
          onSuccess: (data) => {
            if (data?.id) setFileIdQuery(data.id)
          },
        },
      )
    },
    [filePayload, tenantId, token, uploadFeedback],
  )

  const getFileMetadata = useCallback(
    async (event) => {
      event.preventDefault()
      setFileMeta(null)
      await metadataFeedback.execute(
        () => getExternalFileMetadata({
          token,
          tenantId,
          fileId: fileIdQuery,
        }),
        {
          successMessage: 'Metadata consultada correctamente.',
          fallbackErrorMessage: 'No se pudo consultar metadata del archivo.',
          onSuccess: (data) => {
            setFileMeta(data)
          },
        },
      )
    },
    [fileIdQuery, metadataFeedback, tenantId, token],
  )

  const handleFileSelection = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const fileBase64 = await toBase64(file)
    setFilePayload((prev) => ({
      ...prev,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileBase64,
    }))
  }, [setFilePayload])

  return useMemo(
    () => ({
      emailPayload,
      setEmailPayload,
      updateEmailField,
      whatsPayload,
      setWhatsPayload,
      updateWhatsappField,
      emailStatus: emailFeedback.state,
      whatsappStatus: whatsappFeedback.state,
      uploadStatus: uploadFeedback.state,
      metadataStatus: metadataFeedback.state,
      filePayload,
      setFilePayload,
      updateFileField,
      fileIdQuery,
      setFileIdQuery,
      fileMeta,
      sendEmail,
      sendWhatsapp,
      uploadFile,
      getFileMetadata,
      handleFileSelection,
    }),
    [
      emailPayload,
      setEmailPayload,
      updateEmailField,
      whatsPayload,
      setWhatsPayload,
      updateWhatsappField,
      emailFeedback.state,
      whatsappFeedback.state,
      uploadFeedback.state,
      metadataFeedback.state,
      filePayload,
      setFilePayload,
      updateFileField,
      fileIdQuery,
      fileMeta,
      sendEmail,
      sendWhatsapp,
      uploadFile,
      getFileMetadata,
      handleFileSelection,
    ],
  )
}
