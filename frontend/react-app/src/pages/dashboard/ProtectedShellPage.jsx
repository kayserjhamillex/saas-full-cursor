import { useEffect, useState } from 'react'
import { useRouterViewModel } from '../../app/providers/RouterViewModelContext'
import StatsGrid from '../../components/dashboard/StatsGrid'
import SessionHeader from '../../components/layout/SessionHeader'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import ShellRoutes from './ShellRoutes'

function ProtectedShellPage() {
  const { shellViewModel: shell } = useRouterViewModel()
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsDashboardLoading(false)
    }, 550)

    return () => {
      clearTimeout(timerId)
    }
  }, [])

  return (
    <>
      <SessionHeader tenantId={shell.tenantId} onLogout={shell.logout} />
      <div className="shell shell-gradient">
        <Sidebar modules={shell.modules} />
        <section className="content">
          <Topbar theme={shell.theme} onToggleTheme={shell.toggleTheme} />
          <StatsGrid summary={shell.summary} isLoading={isDashboardLoading} />
          <ShellRoutes />
        </section>
      </div>
    </>
  )
}

export default ProtectedShellPage
