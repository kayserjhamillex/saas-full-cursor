function AuthLayout({ title, children, subtitle }) {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-mark">O</div>
        <span className="auth-brand-name">SaaS Odontologico</span>
      </div>
      <section className="auth-card">
        <header className="auth-card-header">
          <p className="auth-card-eyebrow">Panel Clinico</p>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </header>
        {children}
      </section>
    </div>
  )
}

export default AuthLayout
