export default function (length: number, locale: string = 'ru') {
  const lengthString = String(length)
  const lastNumber = parseInt(lengthString[lengthString.length - 1])
  if (locale === 'ru') {
    if (length === 1) {
      return ''
    } else if (length >= 2 && length <= 4) {
      return 'а'
    } else if ((length <= 20 && length > 4) || length === 0) {
      return 'ов'
    } else if (lastNumber === 1) {
      return ''
    } else if (lastNumber >= 2 && lastNumber <= 4) {
      return 'а'
    } else {
      return 'ов'
    }
  }
  return length === 1 ? '' : 's'
}
