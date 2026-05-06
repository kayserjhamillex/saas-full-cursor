function ErrorState({ message }) {
  return (
    <p className="ui-state ui-state-error" role="alert" aria-live="assertive">
      {message}
    </p>
  )
}

export default ErrorState
