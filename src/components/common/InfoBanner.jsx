export function InfoBanner({ tone = 'info', children }) {
  return <div className={`info-banner info-banner--${tone}`}>{children}</div>
}
