export function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow ? <p className="page-title__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-title__description">{description}</p> : null}
      </div>
      {actions ? <div className="page-title__actions">{actions}</div> : null}
    </div>
  )
}
