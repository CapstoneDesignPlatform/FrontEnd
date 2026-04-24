export function ResponsiveListCard({ title, meta, status, children, footer }) {
  return (
    <article className="responsive-card">
      <div className="responsive-card__header">
        <div>
          <h3>{title}</h3>
          {meta ? <p className="muted">{meta}</p> : null}
        </div>
        {status}
      </div>
      <div className="responsive-card__body">{children}</div>
      {footer ? <div className="responsive-card__footer">{footer}</div> : null}
    </article>
  )
}
