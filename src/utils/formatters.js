export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-'
  }

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export const formatPhone = (value) => value || '-'

export const formatRatio = (value) => `${Math.round(Number(value) * 100)}%`
