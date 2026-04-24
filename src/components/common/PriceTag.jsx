export function PriceTag({ value, subtext }) {
  return (
    <div className="price-tag">
      <strong>{value}</strong>
      {subtext ? <span>{subtext}</span> : null}
    </div>
  )
}
