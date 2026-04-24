export function SummaryCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p className="summary-card__label">{label}</p>
      <strong className="summary-card__value">{value}</strong>
      {hint ? <span className="summary-card__hint">{hint}</span> : null}
    </article>
  )
}
