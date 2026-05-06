function Topbar({ theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">SaaS Odontologico</p>
        <h2>Operacion clinica diaria</h2>
        <p className="topbar-subtitle">Seguimiento de citas, pacientes y comunicaciones en tiempo real.</p>
      </div>
      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      >
        {theme === 'light' ? '◐ Modo oscuro' : '◑ Modo claro'}
      </button>
    </header>
  )
}

export default Topbar
