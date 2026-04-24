import { NavLink } from 'react-router-dom'

const menus = {
  client: [
    { to: '/client', label: '대시보드' },
    { to: '/client/company-info', label: '기업 정보' },
    { to: '/client/requests/new/construction', label: '공고 등록' },
    { to: '/client/requests', label: '내 공고 목록' },
    { to: '/client/mypage', label: '마이페이지' },
  ],
  expert: [
    { to: '/expert', label: '대시보드' },
    { to: '/expert/verify', label: '전문가 인증' },
    { to: '/expert/requests', label: '공고 목록' },
    { to: '/expert/bids', label: '내 입찰' },
  ],
  admin: [
    { to: '/admin', label: '대시보드' },
    { to: '/admin/requests', label: '의뢰 목록' },
    { to: '/admin/experts', label: '전문가 관리' },
    { to: '/admin/settings', label: '플랫폼 설정' },
  ],
}

export function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <p className="sidebar__title">
        {role === 'client' ? '의뢰인 메뉴' : role === 'expert' ? '전문가 메뉴' : '관리자 메뉴'}
      </p>
      <nav className="sidebar__nav">
        {menus[role].map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
