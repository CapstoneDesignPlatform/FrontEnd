export const isValidBusinessNumber = (value) => /^\d{3}-\d{2}-\d{5}$/.test(value)

export const isValidPhoneNumber = (value) => /^01\d-\d{3,4}-\d{4}$/.test(value)

export const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value)

export const isPositiveNumber = (value) => Number(value) > 0

export const getRequiredErrors = (fields, labels) =>
  Object.entries(fields).reduce((acc, [key, value]) => {
    if (value === null || value === undefined || value === '') {
      acc[key] = `${labels[key] || key} 항목을 입력해주세요.`
    }
    return acc
  }, {})
