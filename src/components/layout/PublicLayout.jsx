import { Outlet } from 'react-router-dom'

import { Header } from './Header'

export function PublicLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="public-main">
        <Outlet />
      </main>
    </div>
  )
}
