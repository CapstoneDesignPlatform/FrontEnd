import {
  bidStatusMeta,
  paymentStatusMeta,
  requestStatusMeta,
  settlementStatusMeta,
  verificationStatusMeta,
} from '../../utils/constants'

const maps = {
  request: requestStatusMeta,
  verification: verificationStatusMeta,
  bid: bidStatusMeta,
  payment: paymentStatusMeta,
  settlement: settlementStatusMeta,
}

export function StatusBadge({ type, value }) {
  const meta = maps[type]?.[value] || { label: value || '-', tone: 'neutral' }
  return <span className={`status-badge status-badge--${meta.tone}`}>{meta.label}</span>
}
