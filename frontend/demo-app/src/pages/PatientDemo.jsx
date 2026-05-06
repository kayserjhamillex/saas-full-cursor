import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemoTour } from '../tour/DemoTourContext.jsx'

const STORAGE_KEY = 'demo-patient'

export function PatientDemo() {
  const { markStepComplete } = useDemoTour()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    document: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [done, setDone] = useState(false)

  const steps = useMemo(
    () => [
      { id: 'datos', label: 'Datos' },
      { id: 'contacto', label: 'Contacto' },
      { id: 'resumen', label: 'Resumen' },
    ],
    [],
  )

  function persistAndFinish() {
    const payload = {
      ...form,
      id: `PAC-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    markStepComplete('patient')
    setDone(true)
  }

  if (done) {
    return (
      <section className="panel flow-panel">
        <div className="flow-success">
          <span className="flow-success-icon" aria-hidden>✓</span>
          <h2>Paciente registrado</h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
            Ficha creada en esta sesion del navegador. Sin envio a servidores.
          </p>
          <ul className="flow-summary-list">
            <li><strong>{form.firstName} {form.lastName}</strong></li>
            <li>Doc: {form.document}</li>
            <li>{form.phone} · {form.email}</li>
          </ul>
          <div className="flow-actions">
            <Link className="demo-link demo-link--primary" to="/agenda">
              Continuar — Agendar cita
            </Link>
            <button
              type="button"
              className="demo-link"
              onClick={() => {
                setDone(false)
                setStep(0)
                setForm({ firstName: '', lastName: '', document: '', phone: '', email: '', notes: '' })
              }}
            >
              Registrar otro paciente
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="panel flow-panel">
      <header className="flow-header">
        <div>
          <p className="tag">Flujo demo · Paciente</p>
          <h2>Registro de paciente</h2>
          <p className="panel-intro">Interaccion visual paso a paso. Los datos no salen de tu navegador.</p>
        </div>
        <ol className="stepper" aria-label="Progreso">
          {steps.map((s, i) => (
            <li key={s.id} className={i === step ? 'stepper-item is-active' : i < step ? 'stepper-item is-done' : 'stepper-item'}>
              <span className="stepper-dot">{i < step ? '✓' : i + 1}</span>
              <span className="stepper-label">{s.label}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="flow-body">
        {step === 0 && (
          <div className="flow-step">
            <h3>Identificacion</h3>
            <div className="form-grid">
              <label>
                Nombre
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  required
                  autoComplete="given-name"
                />
              </label>
              <label>
                Apellido
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  required
                  autoComplete="family-name"
                />
              </label>
              <label className="span-2">
                Documento
                <input
                  value={form.document}
                  onChange={(e) => setForm((p) => ({ ...p, document: e.target.value }))}
                  required
                  placeholder="Ej. 12345678"
                />
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flow-step">
            <h3>Contacto</h3>
            <div className="form-grid">
              <label>
                Telefono
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </label>
              <label className="span-2">
                Notas (opcional)
                <input
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Alergias, preferencia de horario..."
                />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flow-step">
            <h3>Confirmar datos</h3>
            <div className="preview-card">
              <p>
                <strong>
                  {form.firstName} {form.lastName}
                </strong>
              </p>
              <p className="preview-meta">{form.document}</p>
              <p className="preview-meta">
                {form.phone} · {form.email}
              </p>
              {form.notes && <p className="preview-notes">{form.notes}</p>}
            </div>
          </div>
        )}
      </div>

      <footer className="flow-footer">
        <button type="button" className="demo-link" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Atras
        </button>
        {step < 2 ? (
          <button
            type="button"
            className="demo-link demo-link--primary"
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 && (!form.firstName || !form.lastName || !form.document)) ||
              (step === 1 && (!form.phone || !form.email))
            }
          >
            Siguiente paso →
          </button>
        ) : (
          <button type="button" className="demo-link demo-link--primary" onClick={persistAndFinish}>
            Crear ficha de paciente
          </button>
        )}
      </footer>
    </section>
  )
}
