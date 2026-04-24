import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { industries } from '../../utils/constants'
import { MobileNav } from './MobileNav'

const roleHome = {
  client: '/client',
  expert: '/expert',
  admin: '/admin',
}

export function Header() {
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isEstimateOpen, setIsEstimateOpen] = useState(false)
  const closeTimerRef = useRef(null)
  const estimateWrapperRef = useRef(null)

  const estimateMenus = useMemo(
    () =>
      industries.map((industry) => ({
        label: industry.label === '의약품도매상업' ? '의약품도매상' : industry.label,
        to: `/guest/start/${industry.slug}`,
      })),
    [],
  )

  const publicMenus = useMemo(
    () => [
      { to: '/', label: '진단 bid' },
      { to: '/guest/start', label: '견적 요청', children: estimateMenus },
      { to: '/placeholder/expert-search', label: '전문가 검색' },
      { to: '/placeholder/community', label: '커뮤니티' },
      { to: state.session.role === 'client' ? '/client/mypage' : state.session.role ? roleHome[state.session.role] : '/login', label: 'My Page' },
      { to: '/placeholder/support', label: '고객센터' },
    ],
    [estimateMenus, state.session.role],
  )

  const handleLogout = async () => {
    await actions.logout()
    navigate('/')
  }

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openEstimateMenu = () => {
    clearCloseTimer()
    setIsEstimateOpen(true)
  }

  const closeEstimateMenuWithDelay = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setIsEstimateOpen(false)
    }, 160)
  }

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!estimateWrapperRef.current?.contains(event.target)) {
        clearCloseTimer()
        setIsEstimateOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        clearCloseTimer()
        setIsEstimateOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      clearCloseTimer()
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      <header className="app-header">
        <div className="app-header__left">
          <button className="app-header__menu" type="button" onClick={() => setIsMobileNavOpen(true)}>
            메뉴
          </button>
          <Link className="app-header__brand" to={state.session.role ? roleHome[state.session.role] : '/'}>
            진단 bid
          </Link>
        </div>
        <nav className="app-header__nav">
          {publicMenus.map((item) =>
            item.children?.length ? (
              <div
                key={item.label}
                className="app-header__nav-group"
                ref={estimateWrapperRef}
                onMouseEnter={openEstimateMenu}
                onMouseLeave={closeEstimateMenuWithDelay}
                onFocusCapture={openEstimateMenu}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    closeEstimateMenuWithDelay()
                  }
                }}
              >
                <Link
                  aria-expanded={isEstimateOpen}
                  aria-haspopup="menu"
                  className={`app-header__nav-link ${isEstimateOpen ? 'app-header__nav-link--active' : ''}`}
                  to={item.to}
                >
                  {item.label}
                </Link>
                {isEstimateOpen ? (
                  <div className="estimate-subnav" onMouseEnter={openEstimateMenu} onMouseLeave={closeEstimateMenuWithDelay}>
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        className="estimate-subnav__link"
                        to={child.to}
                        onClick={() => {
                          clearCloseTimer()
                          setIsEstimateOpen(false)
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link key={item.to + item.label} className="app-header__nav-link" to={item.to}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="app-header__actions">
          {state.session.role ? (
            <>
              <span className="app-header__user">ID / {state.session.role === 'client' ? '의뢰인' : state.session.role === 'expert' ? '전문가' : '관리자'}</span>
              <button className="button button--ghost" type="button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link className="button button--ghost" to="/login">
                로그인
              </Link>
              <Link className="button button--ghost" to="/login">
                관리자 데모
              </Link>
              <Link className="button" to="/guest/start">
                비회원 의뢰 시작
              </Link>
            </>
          )}
        </div>
      </header>
      <MobileNav open={isMobileNavOpen} title="전체 메뉴" items={publicMenus} onClose={() => setIsMobileNavOpen(false)} />
    </>
  )
}
