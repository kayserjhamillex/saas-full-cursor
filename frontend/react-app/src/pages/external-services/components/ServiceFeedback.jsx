import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import SuccessState from '../../../components/ui/SuccessState'

function ServiceFeedback({ status, loadingMessage, emptyMessage }) {
  if (status.loading) return <LoadingState message={loadingMessage} />
  if (status.error) return <ErrorState message={status.error} />
  if (status.success) return <SuccessState message={status.success} />
  if (emptyMessage) return <EmptyState message={emptyMessage} />
  return null
}

export default ServiceFeedback
