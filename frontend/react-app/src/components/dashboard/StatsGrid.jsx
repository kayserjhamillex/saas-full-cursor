function StatsGrid({ summary, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="stats" aria-label="Indicadores" aria-busy="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <article key={`stat-skeleton-${index}`} className="stat stat-skeleton">
            <span className="skeleton-line skeleton-label" />
            <span className="skeleton-line skeleton-value" />
          </article>
        ))}
      </section>
    )
  }

  if (!summary.length) {
    return (
      <section className="stats-empty" aria-label="Indicadores">
        <p>No hay indicadores disponibles en este momento.</p>
      </section>
    )
  }

  return (
    <section className="stats" aria-label="Indicadores">
      {summary.map((item) => (
        <article key={item.label} className="stat">
          <p>{item.label}</p>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default StatsGrid
