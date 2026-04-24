export function Stepper({ steps, currentStep }) {
  const currentIndex = Math.max(steps.indexOf(currentStep), 0)

  return (
    <div className="stepper" role="list">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`stepper__item ${index <= currentIndex ? 'stepper__item--active' : ''}`}
          role="listitem"
        >
          <span className="stepper__dot">{index + 1}</span>
          <strong>{step}</strong>
        </div>
      ))}
    </div>
  )
}
