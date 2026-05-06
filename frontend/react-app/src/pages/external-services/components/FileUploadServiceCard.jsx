import ServiceFeedback from './ServiceFeedback'

function FileUploadServiceCard({
  filePayload,
  updateFileField,
  uploadFile,
  uploadStatus,
  handleFileSelection,
}) {
  return (
    <form onSubmit={uploadFile} className="service-form" aria-busy={uploadStatus.loading}>
      <header className="service-form-header">
        <h3>File Service (upload IA)</h3>
        <span>Persistencia de archivos clinicos</span>
      </header>
      <label>Patient ID<input required value={filePayload.patientId} onChange={(e) => updateFileField('patientId', e.target.value)} /></label>
      <label>Encounter ID<input required value={filePayload.encounterId} onChange={(e) => updateFileField('encounterId', e.target.value)} /></label>
      <label>Modulo fuente<input required value={filePayload.sourceModule} onChange={(e) => updateFileField('sourceModule', e.target.value)} /></label>
      <label>
        Archivo
        <input
          type="file"
          required
          onChange={async (e) => {
            await handleFileSelection(e)
          }}
        />
      </label>
      <button type="submit" disabled={uploadStatus.loading}>{uploadStatus.loading ? 'Subiendo...' : 'Subir archivo'}</button>
      <small>Uso recomendado: guardar imagen enviada a IA para reconsulta.</small>
      <ServiceFeedback
        status={uploadStatus}
        loadingMessage="Subiendo archivo al repositorio..."
      />
    </form>
  )
}

export default FileUploadServiceCard
