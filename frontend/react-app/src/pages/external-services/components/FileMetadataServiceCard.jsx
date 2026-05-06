import EmptyState from '../../../components/ui/EmptyState'
import ServiceFeedback from './ServiceFeedback'

function FileMetadataServiceCard({
  fileIdQuery,
  setFileIdQuery,
  getFileMetadata,
  metadataStatus,
  fileMeta,
}) {
  return (
    <form onSubmit={getFileMetadata} className="service-form" aria-busy={metadataStatus.loading}>
      <header className="service-form-header">
        <h3>File Service (metadata)</h3>
        <span>Consulta de documentos</span>
      </header>
      <label>File ID<input required value={fileIdQuery} onChange={(e) => setFileIdQuery(e.target.value)} /></label>
      <button type="submit" disabled={metadataStatus.loading}>{metadataStatus.loading ? 'Consultando...' : 'Consultar metadata'}</button>

      {!fileMeta && !metadataStatus.loading && !metadataStatus.error && !metadataStatus.success && (
        <EmptyState message="Sin resultados. Ingresa un File ID para consultar metadata." />
      )}

      {fileMeta && <pre>{JSON.stringify(fileMeta, null, 2)}</pre>}

      <ServiceFeedback
        status={metadataStatus}
        loadingMessage="Consultando metadata del archivo..."
      />
    </form>
  )
}

export default FileMetadataServiceCard
