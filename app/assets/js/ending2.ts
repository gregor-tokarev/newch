export default function (length: number, locale: 'ru' | 'en' = 'ru') {
  const lengthString = String(length)
  const lastNumber = parseInt(lengthString[lengthString.length - 1])
  if (locale === 'ru') {
    if (length === 1) {
      return 'й'
    } else if (length >= 2 && length <= 4) {
      return 'я'
    } else if ((length <= 20 && length > 4) || length === 0) {
      return 'ев'
    } else if (lastNumber === 1) {
      return 'й'
    } else if (lastNumber >= 2 && lastNumber <= 4) {
      return 'я'
    } else {
      return 'я'
    }
  }
  return length === 1 ? '' : 's'
}
