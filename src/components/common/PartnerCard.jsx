import { StatusBadge } from './StatusBadge'

export function PartnerCard({ title, subtitle, badges = [], items = [], emptyLabel }) {
  if (!items.length && emptyLabel) {
    return <div className="empty-state">{emptyLabel}</div>
  }

  return (
    <article className="partner-card">
      <div className="partner-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <div className="stack">
          {badges.map((badge) => (
            <StatusBadge key={`${badge.type}-${badge.value}-${badge.label || ''}`} type={badge.type} value={badge.value} />
          ))}
        </div>
      </div>
      <div className="detail-grid">
        {items.map((item) => (
          <div className="detail-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}
