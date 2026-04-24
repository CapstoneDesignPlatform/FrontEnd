export function ConfirmModal({
  open,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">{title}</h3>
        <p>{description}</p>
        <div className="modal-card__actions">
          <button className="button button--ghost" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="button" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
