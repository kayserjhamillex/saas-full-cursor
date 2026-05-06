import { getFileMetadataFromGateway, uploadFileToGateway } from '../files/filesService'
import { sendEmailNotification, sendWhatsappNotification } from '../notifications/notificationsService'

export function sendExternalEmail({ token, tenantId, payload }) {
  return sendEmailNotification({ token, tenantId, payload })
}

export function sendExternalWhatsapp({ token, tenantId, payload }) {
  return sendWhatsappNotification({ token, tenantId, payload })
}

export function uploadExternalFile({ token, tenantId, payload }) {
  return uploadFileToGateway({ token, tenantId, payload })
}

export function getExternalFileMetadata({ token, tenantId, fileId }) {
  return getFileMetadataFromGateway({ token, tenantId, fileId })
}
