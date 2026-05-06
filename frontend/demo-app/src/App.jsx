import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { AgendaDemo } from './pages/AgendaDemo.jsx'
import { IaDemo } from './pages/IaDemo.jsx'
import { Landing } from './pages/Landing.jsx'
import { ModulesSimDemo } from './pages/ModulesSimDemo.jsx'
import { PatientDemo } from './pages/PatientDemo.jsx'
import { RegistroLead } from './pages/RegistroLead.jsx'
import { TourBanner, TourRail } from './tour/TourChrome.jsx'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('demo-theme') || 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('demo-theme', theme)
  }, [theme])

  return (
    <main className="demo-shell">
      <header className="topbar topbar--with-tour">
        <div className="topbar-row">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">O</div>
            <div className="brand-text">
              <h1>DentalCloud</h1>
              <p className="brand-tag">Demo comercial · SaaS odontologico</p>
            </div>
          </div>
          <TourRail />
          <div className="actions">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/paciente">Paciente</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/modulos">Modulos</NavLink>
            <NavLink to="/ia">IA Clinica</NavLink>
            <NavLink to="/registro">Contacto</NavLink>
            <button type="button" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
              {theme === 'light' ? '◐ Oscuro' : '◑ Claro'}
            </button>
          </div>
        </div>
        <TourBanner />
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/paciente" element={<PatientDemo />} />
        <Route path="/agenda" element={<AgendaDemo />} />
        <Route path="/modulos" element={<ModulesSimDemo />} />
        <Route path="/ia" element={<IaDemo />} />
        <Route path="/registro" element={<RegistroLead />} />
        <Route path="/simulacion" element={<Navigate to="/modulos" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
