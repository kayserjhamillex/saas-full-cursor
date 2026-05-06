function SuccessState({ message }) {
  return (
    <p className="ui-state ui-state-success" role="status" aria-live="polite">
      {message}
    </p>
  )
}

export default SuccessState
