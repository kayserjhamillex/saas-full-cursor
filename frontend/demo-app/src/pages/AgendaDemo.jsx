import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemoTour } from '../tour/DemoTourContext.jsx'

const PATIENT_KEY = 'demo-patient'

function loadPatient() {
  try {
    const raw = localStorage.getItem(PATIENT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const professionals = ['Dra. Ana Morales', 'Dr. Luis Paredes', 'Dra. Carmen Vega']
const motives = ['Control', 'Urgencia', 'Limpieza', 'Ortodoncia', 'Implante (valoracion)']

export function AgendaDemo() {
  const { markStepComplete } = useDemoTour()
  const [patient, setPatient] = useState(null)
  const [useDemoPatient, setUseDemoPatient] = useState(true)
  const [step, setStep] = useState(0)
  const [prof, setProf] = useState(professionals[0])
  const [dayIdx, setDayIdx] = useState(2)
  const [slot, setSlot] = useState('09:30')
  const [motive, setMotive] = useState(motives[0])
  const [done, setDone] = useState(false)

  useEffect(() => {
    setPatient(loadPatient())
  }, [])

  useEffect(() => {
    if (done) markStepComplete('agenda')
  }, [done, markStepComplete])

  const days = useMemo(() => {
    const base = new Date()
    base.setHours(12, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return d
    })
  }, [])

  const slots = ['08:00', '09:30', '11:00', '15:30', '17:00']

  const displayName = useMemo(() => {
    if (patient && !useDemoPatient) {
      return `${patient.firstName} ${patient.lastName}`.trim()
    }
    return 'Paciente demo (sin ficha previa)'
  }, [patient, useDemoPatient])

  const steps = ['Paciente', 'Profesional', 'Fecha y hora', 'Motivo', 'Confirmar']

  if (done) {
    return (
      <section className="panel flow-panel">
        <div className="flow-success">
          <span className="flow-success-icon" aria-hidden>✓</span>
          <h2>Cita confirmada</h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem' }}>Agendamiento completado en esta sesion demo.</p>
          <ul className="flow-summary-list">
            <li><strong>{displayName}</strong></li>
            <li>{prof}</li>
            <li>{days[dayIdx].toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'short' })} · {slot}</li>
            <li>Motivo: {motive}</li>
          </ul>
          <div className="flow-actions">
            <Link className="demo-link" to="/modulos">
              Ver modulos empresariales
            </Link>
            <button
              type="button"
              className="demo-link demo-link--primary"
              onClick={() => {
                setDone(false)
                setStep(0)
                setProf(professionals[0])
                setDayIdx(2)
                setSlot('09:30')
                setMotive(motives[0])
              }}
            >
              Nueva cita
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
          <p className="tag">Flujo demo · Agenda</p>
          <h2>Agendamiento de cita</h2>
          <p className="panel-intro">Selecciona disponibilidad como en un calendario real. Sin backend.</p>
        </div>
        <ol className="stepper stepper--compact" aria-label="Progreso">
          {steps.map((label, i) => (
            <li key={label} className={i === step ? 'stepper-item is-active' : i < step ? 'stepper-item is-done' : 'stepper-item'}>
              <span className="stepper-dot">{i < step ? '✓' : i + 1}</span>
              <span className="stepper-label">{label}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="flow-body">
        {step === 0 && (
          <div className="flow-step">
            <h3>Paciente</h3>
            {patient ? (
              <div className="choice-cards">
                <button
                  type="button"
                  className={useDemoPatient ? 'choice-card is-selected' : 'choice-card'}
                  onClick={() => setUseDemoPatient(true)}
                >
                  <strong>Paciente demo</strong>
                  <span>Flujo rapido para presentaciones</span>
                </button>
                <button
                  type="button"
                  className={!useDemoPatient ? 'choice-card is-selected' : 'choice-card'}
                  onClick={() => setUseDemoPatient(false)}
                >
                  <strong>
                    {patient.firstName} {patient.lastName}
                  </strong>
                  <span>Usar ficha creada en &quot;Crear paciente&quot;</span>
                </button>
              </div>
            ) : (
              <p className="hint-box">
                No hay paciente guardado en esta sesion.{' '}
                <Link to="/paciente">Crea uno primero</Link> o continua con el paciente demo.
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="flow-step">
            <h3>Profesional</h3>
            <div className="pill-grid">
              {professionals.map((p) => (
                <button key={p} type="button" className={prof === p ? 'pill is-on' : 'pill'} onClick={() => setProf(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flow-step">
            <h3>Fecha y hora</h3>
            <div className="calendar-strip">
              {days.map((d, i) => (
                <button key={d.toISOString()} type="button" className={dayIdx === i ? 'cal-day is-selected' : 'cal-day'} onClick={() => setDayIdx(i)}>
                  <span className="cal-dow">{d.toLocaleDateString('es', { weekday: 'short' })}</span>
                  <span className="cal-num">{d.getDate()}</span>
                </button>
              ))}
            </div>
            <p className="slot-label">Horario</p>
            <div className="pill-grid">
              {slots.map((s) => (
                <button key={s} type="button" className={slot === s ? 'pill is-on' : 'pill'} onClick={() => setSlot(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flow-step">
            <h3>Motivo de consulta</h3>
            <div className="pill-grid">
              {motives.map((m) => (
                <button key={m} type="button" className={motive === m ? 'pill is-on' : 'pill'} onClick={() => setMotive(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flow-step">
            <h3>Confirmacion</h3>
            <div className="preview-card">
              <p>
                <strong>{displayName}</strong>
              </p>
              <p className="preview-meta">{prof}</p>
              <p className="preview-meta">
                {days[dayIdx].toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} · {slot}
              </p>
              <p className="preview-meta">Motivo: {motive}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="flow-footer">
        <button type="button" className="demo-link" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Atras
        </button>
        {step < 4 ? (
          <button type="button" className="demo-link demo-link--primary" onClick={() => setStep((s) => s + 1)}>
            Siguiente →
          </button>
        ) : (
          <button type="button" className="demo-link demo-link--primary" onClick={() => setDone(true)}>
            Confirmar cita
          </button>
        )}
      </footer>
    </section>
  )
}
