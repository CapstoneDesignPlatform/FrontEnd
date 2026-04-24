export const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

export const cloneData = (value) => JSON.parse(JSON.stringify(value))

export const createRequestCode = (requests) => {
  const year = new Date().getFullYear()
  const sequence = String(requests.length + 1).padStart(4, '0')
  return `REQ-${year}-${sequence}`
}

export const sortByNewest = (items, field = 'createdAt') =>
  [...items].sort((a, b) => new Date(b[field]) - new Date(a[field]))
