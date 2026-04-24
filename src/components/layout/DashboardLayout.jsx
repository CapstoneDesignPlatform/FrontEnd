import { Navigate, Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ role }) {
  const { state, isHydrated } = useAppContext()

  if (!isHydrated) {
    return (
      <div className="app-shell">
        <Header />
        <main className="dashboard-main">
          <div className="section-card">데모 데이터를 불러오는 중입니다...</div>
        </main>
      </div>
    )
  }

  if (state.session.role !== role) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="dashboard-shell">
        <Sidebar role={role} />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
