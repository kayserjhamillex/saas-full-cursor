function SessionHeader({ tenantId, onLogout }) {
  return (
    <header className="session-header">
      <div className="session-header-info">
        <span className="status-dot" aria-hidden="true" />
        <small>Tenant activo: {tenantId || 'no definido'}</small>
      </div>
      <button type="button" onClick={onLogout}>Cerrar sesion</button>
    </header>
  )
}

export default SessionHeader
