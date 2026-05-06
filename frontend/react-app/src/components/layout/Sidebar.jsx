import { NavLink } from 'react-router-dom'

function Sidebar({ modules }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-mark">O</div>
        <div className="sidebar-brand-text">
          <p className="sidebar-eyebrow">Workspace</p>
          <h1>Panel Clinico</h1>
        </div>
      </div>
      <p className="sidebar-subtitle">Navegacion de modulos operativos</p>
      <nav>
        {modules.map((module) => (
          <NavLink key={module.to} to={module.to} end={module.to === '/'}>
            <span>{module.label}</span>
            {!module.enabled && <small>Bloqueado</small>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
