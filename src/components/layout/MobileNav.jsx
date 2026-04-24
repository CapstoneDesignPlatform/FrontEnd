import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export function MobileNav({ open, title, items, onClose }) {
  const [expandedKey, setExpandedKey] = useState('')

  if (!open) return null

  return (
    <div className="mobile-nav__backdrop" role="presentation" onClick={onClose}>
      <aside className="mobile-nav" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="mobile-nav__header">
          <strong>{title}</strong>
          <button className="button button--ghost" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
        <nav className="mobile-nav__links">
          {items.map((item) => (
            item.children?.length ? (
              <div className="mobile-nav__group" key={item.label}>
                <button
                  className={`mobile-nav__link ${expandedKey === item.label ? 'mobile-nav__link--active' : ''}`}
                  type="button"
                  onClick={() => setExpandedKey((current) => (current === item.label ? '' : item.label))}
                >
                  {item.label}
                </button>
                {expandedKey === item.label ? (
                  <div className="mobile-nav__sublinks">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        className={({ isActive }) => `mobile-nav__sublink ${isActive ? 'mobile-nav__sublink--active' : ''}`}
                        to={child.to}
                        onClick={onClose}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <NavLink
                key={item.to}
                className={({ isActive }) => `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`}
                to={item.to}
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>
      </aside>
    </div>
  )
}
