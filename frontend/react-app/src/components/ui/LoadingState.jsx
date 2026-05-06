function LoadingState({ message = 'Cargando...' }) {
  return (
    <p className="ui-state ui-state-loading" role="status" aria-live="polite">
      {message}
    </p>
  )
}

export default LoadingState
