function EmptyState({ message }) {
  return (
    <p className="ui-state ui-state-empty" role="status" aria-live="polite">
      {message}
    </p>
  )
}

export default EmptyState
