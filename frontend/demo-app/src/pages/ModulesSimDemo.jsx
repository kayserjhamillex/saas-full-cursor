import { useEffect, useState } from 'react'
import { useDemoTour } from '../tour/DemoTourContext.jsx'

const MODULES = [
  {
    id: 'inventory',
    title: 'Inventario',
    subtitle: 'Stock, lotes y alertas de reposicion',
    kpi: { a: '127 SKU activos', b: '8 alertas bajo minimo', c: 'Rotacion 18 dias' },
    table: [
      { item: 'Resina composite A2', qty: '12 u.', status: 'OK' },
      { item: 'Guantes nitrilo M', qty: '3 cajas', status: 'Bajo minimo' },
      { item: 'Anestesia articaina', qty: '40 carp.', status: 'OK' },
    ],
  },
  {
    id: 'assets',
    title: 'Patrimonio',
    subtitle: 'Equipos, mantenimiento y valor en libros',
    kpi: { a: '24 activos', b: '2 PMV proximos', c: 'Valor neto demo' },
    table: [
      { item: 'Unidad dental #2', qty: 'Operativo', status: 'PMV en 14 d.' },
      { item: 'Autoclave', qty: 'Operativo', status: 'OK' },
      { item: 'Scanner intraoral', qty: 'Calibracion', status: 'Revision' },
    ],
  },
  {
    id: 'hr',
    title: 'RRHH',
    subtitle: 'Turnos, capacitacion y cumplimiento',
    kpi: { a: '18 colaboradores', b: '92% fichas al dia', c: '3 cursos activos' },
    table: [
      { item: 'Recepcion - turno AM', qty: '5 personas', status: 'Completo' },
      { item: 'Higiene - capacitacion', qty: '2 pendientes', status: 'En curso' },
      { item: 'Evaluaciones trimestre', qty: '6/18', status: 'En plazo' },
    ],
  },
  {
    id: 'finance',
    title: 'Economia y financiacion',
    subtitle: 'Caja, facturacion y proyeccion',
    kpi: { a: 'Cobranza hoy demo', b: 'Ticket medio', c: 'Ocupacion sillon' },
    table: [
      { item: 'Facturacion estimada', qty: 'S/ 12.4k', status: 'Demo' },
      { item: 'Cuotas pendientes', qty: '7 pacientes', status: 'Seguimiento' },
      { item: 'Proyeccion 30d', qty: '+6%', status: 'Tendencia' },
    ],
  },
]

export function ModulesSimDemo() {
  const { markStepComplete } = useDemoTour()
  const [active, setActive] = useState(MODULES[0].id)
  const [unlocked, setUnlocked] = useState(() => ({
    inventory: false,
    assets: false,
    hr: false,
    finance: false,
  }))

  const mod = MODULES.find((m) => m.id === active)
  const isOn = unlocked[active]

  useEffect(() => {
    if (Object.values(unlocked).some(Boolean)) markStepComplete('modules')
  }, [unlocked, markStepComplete])

  function toggleUnlock() {
    setUnlocked((prev) => ({ ...prev, [active]: !prev[active] }))
  }

  return (
    <section className="panel modules-panel">
      <header className="modules-header">
        <div>
          <p className="tag">Expansion empresarial</p>
          <h2>Modulos de gestion avanzada</h2>
          <p className="panel-intro">
            Cada modulo se muestra bloqueado hasta activar la simulacion. Datos ficticios para demostracion comercial con prospectos.
          </p>
        </div>
      </header>

      <div className="modules-layout">
        <nav className="module-tabs" aria-label="Modulos">
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={active === m.id ? 'module-tab is-active' : 'module-tab'}
              onClick={() => setActive(m.id)}
            >
              <span className="module-tab-title">{m.title}</span>
              <span className={`module-tab-badge ${unlocked[m.id] ? 'is-on' : ''}`}>{unlocked[m.id] ? 'Simulado' : 'Bloqueado'}</span>
            </button>
          ))}
        </nav>

        <div className="module-stage">
          <div className="module-stage-head">
            <div>
              <h3>{mod.title}</h3>
              <p className="module-sub">{mod.subtitle}</p>
            </div>
            <button type="button" className={isOn ? 'demo-link' : 'demo-link demo-link--primary'} onClick={toggleUnlock}>
              {isOn ? 'Desactivar simulacion' : 'Simular modulo activo'}
            </button>
          </div>

          <div className={`module-content ${isOn ? '' : 'is-locked'}`}>
            {!isOn && (
              <div className="module-lock-overlay">
                <div className="module-lock-icon" aria-hidden>🔒</div>
                <p>
                  <strong>Modulo no activo</strong>
                </p>
                <p>Activa la simulacion para mostrar el tablero a prospectos.</p>
              </div>
            )}

            <div className="kpi-row">
              <div className="kpi-card">
                <span className="kpi-label">Indicador A</span>
                <strong>{mod.kpi.a}</strong>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Indicador B</span>
                <strong>{mod.kpi.b}</strong>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Indicador C</span>
                <strong>{mod.kpi.c}</strong>
              </div>
            </div>

            <div className="demo-table-wrap">
              <table className="demo-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {mod.table.map((row) => (
                    <tr key={row.item}>
                      <td>{row.item}</td>
                      <td>{row.qty}</td>
                      <td>
                        <span className={
                          row.status === 'OK' || row.status === 'Completo' || row.status === 'Operativo'
                            ? 'demo-pill demo-pill--ok'
                            : row.status === 'Bajo minimo' || row.status === 'Revision' || row.status === 'Calibracion'
                              ? 'demo-pill demo-pill--warn'
                              : 'demo-pill'
                        }>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
