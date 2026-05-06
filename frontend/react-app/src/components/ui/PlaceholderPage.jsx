function PlaceholderPage({ title, description, bullets }) {
  return (
    <section className="page-card">
      <p className="page-card-eyebrow">Modulo</p>
      <h2>
        {title}
        {' '}
        <span className="badge badge-warn">En construccion</span>
      </h2>
      <p>{description}</p>
      <ul>
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default PlaceholderPage
