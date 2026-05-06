import ServiceFeedback from './ServiceFeedback'

function EmailServiceCard({ emailPayload, updateEmailField, sendEmail, emailStatus }) {
  return (
    <form onSubmit={sendEmail} className="service-form" aria-busy={emailStatus.loading}>
      <header className="service-form-header">
        <h3>Correo</h3>
        <span>Email transactional</span>
      </header>
      <label>Destino<input type="email" required value={emailPayload.to} onChange={(e) => updateEmailField('to', e.target.value)} /></label>
      <label>Asunto<input required value={emailPayload.subject} onChange={(e) => updateEmailField('subject', e.target.value)} /></label>
      <label>Template<input required value={emailPayload.template} onChange={(e) => updateEmailField('template', e.target.value)} /></label>
      <label>Paciente<input value={emailPayload.patientName} onChange={(e) => updateEmailField('patientName', e.target.value)} /></label>
      <label>Fecha cita<input value={emailPayload.appointmentDate} onChange={(e) => updateEmailField('appointmentDate', e.target.value)} /></label>
      <button type="submit" disabled={emailStatus.loading}>{emailStatus.loading ? 'Enviando...' : 'Enviar correo'}</button>
      <ServiceFeedback
        status={emailStatus}
        loadingMessage="Procesando envio de correo..."
      />
    </form>
  )
}

export default EmailServiceCard
