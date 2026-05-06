import { Link, NavLink } from 'react-router-dom'
import { allStepsDone, computeNextStep, TOUR_STEPS, useDemoTour } from './DemoTourContext.jsx'

export function TourRail() {
  const { progress } = useDemoTour()

  return (
    <nav className="tour-rail" aria-label="Progreso del tour demo">
      <span className="tour-rail-title">Tour</span>
      <ol className="tour-rail-steps">
        {TOUR_STEPS.map((step, index) => {
          const done = Boolean(progress[step.id])
          return (
            <li key={step.id}>
              <NavLink
                to={step.path}
                className={({ isActive }) =>
                  ['tour-step', done ? 'is-done' : '', isActive ? 'is-current' : ''].filter(Boolean).join(' ')
                }
                end
              >
                <span className="tour-step-index" aria-hidden>
                  {done ? '✓' : index + 1}
                </span>
                <span className="tour-step-label">{step.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function TourBanner() {
  const { progress, tourActive, dismissTour } = useDemoTour()
  const next = computeNextStep(progress)
  const done = allStepsDone(progress)

  if (!tourActive) return null

  if (done) {
    return (
      <div className="tour-banner tour-banner--success">
        <p>
          <strong>Tour completado.</strong> Puedes solicitar una demo guiada con tu clinica.
        </p>
        <div className="tour-banner-actions">
          <Link className="demo-link demo-link--primary" to="/registro">
            Ir a contacto
          </Link>
          <button type="button" className="demo-link" onClick={dismissTour}>
            Cerrar aviso
          </button>
        </div>
      </div>
    )
  }

  if (!next) return null

  return (
    <div className="tour-banner">
      <p>
        <strong>Siguiente paso sugerido:</strong> {next.label}. Sigue el orden para una narrativa clara en presentaciones.
      </p>
      <div className="tour-banner-actions">
        <Link className="demo-link demo-link--primary" to={next.path}>
          Ir a {next.label}
        </Link>
        <button type="button" className="demo-link" onClick={dismissTour}>
          Ocultar guia
        </button>
      </div>
    </div>
  )
}
