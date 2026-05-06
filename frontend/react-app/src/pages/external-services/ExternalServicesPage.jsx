import { useExternalServicesForms } from '../../hooks/external-services/useExternalServicesForms'
import EmailServiceCard from './components/EmailServiceCard'
import FileMetadataServiceCard from './components/FileMetadataServiceCard'
import FileUploadServiceCard from './components/FileUploadServiceCard'
import WhatsappServiceCard from './components/WhatsappServiceCard'

function ExternalServicesPage({ token, tenantId }) {
  const {
    emailPayload,
    updateEmailField,
    whatsPayload,
    updateWhatsappField,
    emailStatus,
    whatsappStatus,
    uploadStatus,
    metadataStatus,
    filePayload,
    updateFileField,
    fileIdQuery,
    setFileIdQuery,
    fileMeta,
    sendEmail,
    sendWhatsapp,
    uploadFile,
    getFileMetadata,
    handleFileSelection,
  } = useExternalServicesForms({ token, tenantId })

  return (
    <section className="page-card external-services-page">
      <header className="external-services-header">
        <div>
          <p className="eyebrow">Integraciones</p>
          <h2>Servicios externos</h2>
        </div>
        <p>Envio operativo de notificaciones y gestion de archivos clinicos desde un solo modulo.</p>
      </header>

      <div className="service-grid">
        <EmailServiceCard
          emailPayload={emailPayload}
          updateEmailField={updateEmailField}
          sendEmail={sendEmail}
          emailStatus={emailStatus}
        />

        <WhatsappServiceCard
          whatsPayload={whatsPayload}
          updateWhatsappField={updateWhatsappField}
          sendWhatsapp={sendWhatsapp}
          whatsappStatus={whatsappStatus}
        />

        <FileUploadServiceCard
          filePayload={filePayload}
          updateFileField={updateFileField}
          uploadFile={uploadFile}
          uploadStatus={uploadStatus}
          handleFileSelection={handleFileSelection}
        />

        <FileMetadataServiceCard
          fileIdQuery={fileIdQuery}
          setFileIdQuery={setFileIdQuery}
          getFileMetadata={getFileMetadata}
          metadataStatus={metadataStatus}
          fileMeta={fileMeta}
        />
      </div>
    </section>
  )
}

export default ExternalServicesPage
