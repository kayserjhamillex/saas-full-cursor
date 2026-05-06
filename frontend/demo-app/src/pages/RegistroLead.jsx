import { useState } from 'react'

export function RegistroLead() {
  const [lead, setLead] = useState({ clinic: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <section className="panel" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }} aria-hidden>🎉</div>
        <p className="tag" style={{ justifyContent: 'center', display: 'flex' }}>Solicitud recibida</p>
        <h2 style={{ margin: '0.3rem 0 0.4rem', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
          Nos pondremos en contacto pronto
        </h2>
        <p style={{ maxWidth: '46ch', margin: '0 auto', fontSize: '0.93rem' }}>
          Un especialista de <strong>DentalCloud</strong> contactara a <strong>{lead.clinic}</strong> en menos de 24 horas habiles para coordinar la demo personalizada.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="demo-link demo-link--ghost"
            onClick={() => { setSubmitted(false); setLead({ clinic: '', email: '' }) }}
          >
            Enviar otra solicitud
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="panel">
      <div style={{ maxWidth: 540 }}>
        <p className="tag">Contacto comercial</p>
        <h2 style={{ margin: '0.3rem 0 0.4rem', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
          Solicita una demo personalizada para tu clinica
        </h2>
        <p className="panel-intro">
          Agenda una sesion guiada con tu equipo. Te mostramos el flujo completo adaptado a la realidad operativa de tu consultorio.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '0.85rem 0 1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--ok)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✓ Sin costo</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--ok)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✓ 30 minutos</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--ok)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✓ Sin compromiso</span>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <label>
            Nombre de la clinica
            <input
              value={lead.clinic}
              onChange={(e) => setLead((prev) => ({ ...prev, clinic: e.target.value }))}
              required
              placeholder="Ej. Clinica Dental Morales"
            />
          </label>
          <label>
            Email de contacto
            <input
              type="email"
              value={lead.email}
              onChange={(e) => setLead((prev) => ({ ...prev, email: e.target.value }))}
              required
              placeholder="director@clinica.com"
            />
          </label>
          <button type="submit">Solicitar demo personalizada →</button>
        </form>
      </div>
    </section>
  )
}
