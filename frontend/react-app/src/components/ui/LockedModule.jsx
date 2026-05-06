function LockedModule({ title }) {
  return (
    <section className="page-card">
      <p className="page-card-eyebrow">Modulo</p>
      <h2>
        {title}
        {' '}
        <span className="badge badge-warn">Bloqueado</span>
      </h2>
      <p>Este modulo esta visible pero bloqueado hasta activar el plan/pago correspondiente.</p>
      <ul>
        <li>Solicita activacion desde el administrador SaaS</li>
        <li>La habilitacion aplica por tenant/modulo</li>
        <li>Al activarse, este espacio se conecta al backend real</li>
      </ul>
    </section>
  )
}

export default LockedModule
