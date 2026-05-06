import ServiceFeedback from './ServiceFeedback'

function WhatsappServiceCard({ whatsPayload, updateWhatsappField, sendWhatsapp, whatsappStatus }) {
  return (
    <form onSubmit={sendWhatsapp} className="service-form" aria-busy={whatsappStatus.loading}>
      <header className="service-form-header">
        <h3>WhatsApp</h3>
        <span>Mensajeria instantanea</span>
      </header>
      <label>Numero<input required value={whatsPayload.phoneNumber} onChange={(e) => updateWhatsappField('phoneNumber', e.target.value)} /></label>
      <label>Mensaje<textarea required value={whatsPayload.message} onChange={(e) => updateWhatsappField('message', e.target.value)} /></label>
      <label>Evento<input required value={whatsPayload.eventType} onChange={(e) => updateWhatsappField('eventType', e.target.value)} /></label>
      <button type="submit" disabled={whatsappStatus.loading}>{whatsappStatus.loading ? 'Enviando...' : 'Enviar WhatsApp'}</button>
      <ServiceFeedback
        status={whatsappStatus}
        loadingMessage="Enviando mensaje por WhatsApp..."
      />
    </form>
  )
}

export default WhatsappServiceCard
