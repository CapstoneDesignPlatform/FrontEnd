export function SectionCard({ title, description, actions, children, className = '' }) {
  return (
    <section className={`section-card ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="section-card__header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      )}
      <div>{children}</div>
    </section>
  )
}
