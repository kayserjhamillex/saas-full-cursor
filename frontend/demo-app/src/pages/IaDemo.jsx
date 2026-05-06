import { useCallback, useEffect, useRef, useState } from 'react'
import { useDemoTour } from '../tour/DemoTourContext.jsx'

const DEMO_MESSAGES = ['Normalizando imagen…', 'Detectando regiones de interes…', 'Clasificando hallazgos (demo)…', 'Generando resumen para la ficha…']

const DEMO_FINDINGS = [
  { id: '1', title: 'Posible caries interproximal', detail: 'Zona distovestibular pieza 16 — requiere correlacion clinica.', confidence: 'Confianza demo: 78%' },
  { id: '2', title: 'Sugerencia de higiene', detail: 'Bordes cervicales con mayor acumulo de sombra en sector superior.', confidence: 'Confianza demo: 64%' },
  { id: '3', title: 'Sin signos urgentes', detail: 'No se simulan alertas criticas en esta demo controlada.', confidence: 'Confianza demo: 91%' },
]

export function IaDemo() {
  const { markStepComplete } = useDemoTour()
  const [mode, setMode] = useState('sample') // sample | upload
  const [fileName, setFileName] = useState('')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)
  const [result, setResult] = useState(null)
  const timers = useRef([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => clearInterval(id))
    timers.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const runDemo = useCallback(() => {
    clearTimers()
    setResult(null)
    setRunning(true)
    setProgress(0)
    setMsgIdx(0)

    let value = 0
    const tick = setInterval(() => {
      value = Math.min(100, value + 2.2)
      setProgress(value)
      if (value < 25) setMsgIdx(0)
      else if (value < 50) setMsgIdx(1)
      else if (value < 75) setMsgIdx(2)
      else setMsgIdx(3)

      if (value >= 100) {
        clearInterval(tick)
        setRunning(false)
        markStepComplete('ia')
        setResult({
          source: mode === 'upload' && fileName ? fileName : 'Radiografia de muestra (demo)',
          findings: DEMO_FINDINGS,
          disclaimer: 'Esta vista es una simulacion visual. No se envian imagenes a ningun modelo de IA real.',
        })
      }
    }, 90)
    timers.current.push(tick)
  }, [clearTimers, fileName, mode, markStepComplete])

  return (
    <section className="panel ia-panel">
      <header className="ia-header">
        <div>
          <p className="tag">IA clinica · Demo controlada</p>
          <h2>Analisis de imagen radiografica</h2>
          <p className="panel-intro">
            Flujo pensado para presentaciones: sin API real, sin envio de datos. Estados y hallazgos precargados para mostrar valor al prospecto.
          </p>
        </div>
      </header>

      <div className="ia-grid">
        <div className="ia-card">
          <h3>1. Origen de la imagen</h3>
          <div className="pill-grid pill-grid--left">
            <button type="button" className={mode === 'sample' ? 'pill is-on' : 'pill'} onClick={() => setMode('sample')}>
              Imagen de muestra
            </button>
            <button type="button" className={mode === 'upload' ? 'pill is-on' : 'pill'} onClick={() => setMode('upload')}>
              Subir archivo (solo nombre en demo)
            </button>
          </div>
          {mode === 'upload' && (
            <label className="ia-upload">
              Archivo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setFileName(f ? f.name : '')
                }}
              />
              {fileName && <span className="ia-file-name">{fileName}</span>}
            </label>
          )}
          <button type="button" className="demo-link demo-link--primary ia-run" disabled={running} onClick={runDemo}>
            {running ? '⏳ Analizando…' : '▶ Ejecutar analisis de imagen'}
          </button>
        </div>

        <div className="ia-card ia-console">
          <h3>2. Progreso</h3>
          <div className="ia-progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="ia-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="ia-status">{running ? DEMO_MESSAGES[msgIdx] : progress >= 100 && result ? 'Listo.' : 'Pulsa ejecutar para iniciar la secuencia.'}</p>
          <ul className="ia-log">
            {DEMO_MESSAGES.map((m, i) => (
              <li key={m} className={i <= msgIdx && (running || result) ? 'is-on' : ''}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result && (
        <div className="ia-results">
          <h3>Hallazgos detectados (simulados)</h3>
          <p className="ia-source">
            Imagen analizada: <strong>{result.source}</strong>
          </p>
          <div className="findings-grid">
            {result.findings.map((f) => (
              <article key={f.id} className="finding-card">
                <h4>{f.title}</h4>
                <p>{f.detail}</p>
                <footer className="finding-foot">{f.confidence}</footer>
              </article>
            ))}
          </div>
          <p className="ia-disclaimer">⚠ {result.disclaimer}</p>
        </div>
      )}
    </section>
  )
}
