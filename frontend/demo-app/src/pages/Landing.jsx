import { Link } from 'react-router-dom'
import { allStepsDone, computeNextStep, useDemoTour } from '../tour/DemoTourContext.jsx'

export function Landing() {
  const { progress, startGuidedTour, resumeGuidedTour, resetTourProgress } = useDemoTour()
  const next = computeNextStep(progress)
  const hasAnyProgress = Object.values(progress).some(Boolean)
  const tourDone = allStepsDone(progress)

  return (
    <section className="hero">
      <p className="tag">SaaS Odontologico · Demo comercial</p>
      <h2 style={{ margin: '0.3rem 0 0', fontSize: 'clamp(1.45rem, 3.5vw, 2rem)', letterSpacing: '-0.03em', lineHeight: 1.25 }}>
        La plataforma digital que transforma<br />
        <span style={{ color: 'var(--primary)' }}>la experiencia clinica de tu consultorio.</span>
      </h2>
      <div className="hero-kpis">
        <span>+32% conversion comercial</span>
        <span>-40% tiempo operativo</span>
        <span>NPS 9.1 / 10</span>
        <span>Citas en 3 clics</span>
      </div>
      <p className="hero-lead">
        Explora flujos interactivos de demostracion: registro de paciente, agendamiento, modulos empresariales e IA clinica.
        El <strong>tour guiado</strong> activa el aviso de siguiente paso en la cabecera para narrativas limpias en presentaciones comerciales.
      </p>
      <div className="demo-links demo-links--tour">
        <button type="button" className="demo-link demo-link--primary" onClick={startGuidedTour}>
          ▶ Iniciar tour guiado
        </button>
        {hasAnyProgress && !tourDone ? (
          <button type="button" className="demo-link" onClick={resumeGuidedTour}>
            Continuar tour{next ? ` — ${next.label}` : ''}
          </button>
        ) : null}
        {hasAnyProgress ? (
          <button type="button" className="demo-link demo-link--ghost" onClick={resetTourProgress}>
            Reiniciar progreso
          </button>
        ) : null}
      </div>
      <div className="demo-links">
        <Link className="demo-link demo-link--primary" to="/paciente">Registrar paciente</Link>
        <Link className="demo-link" to="/agenda">Agendar cita</Link>
        <Link className="demo-link" to="/modulos">Modulos empresariales</Link>
        <Link className="demo-link" to="/ia">IA clinica</Link>
        <Link className="demo-link demo-link--ghost" to="/registro">Solicitar demo real</Link>
      </div>
      <div className="grid">
        <article className="card">
          <div className="card-icon">📅</div>
          <h3>Agenda inteligente</h3>
          <p>Visualiza disponibilidad en segundos, reduce tiempos muertos y evita cancelaciones con recordatorios automaticos.</p>
        </article>
        <article className="card">
          <div className="card-icon">🦷</div>
          <h3>Historia clinica digital</h3>
          <p>Centraliza datos clinicos, imagenes y tratamientos en una sola interfaz. Acceso rapido desde cualquier dispositivo.</p>
        </article>
        <article className="card">
          <div className="card-icon">🤖</div>
          <h3>IA aplicada a odontologia</h3>
          <p>Analisis de radiografias con IA controlada. Presenta hallazgos visuales a tu equipo para decisiones rapidas y documentadas.</p>
        </article>
      </div>
    </section>
  )
}
