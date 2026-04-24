export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item}
          aria-selected={value === item}
          className={`tabs__item ${value === item ? 'tabs__item--active' : ''}`}
          role="tab"
          type="button"
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
