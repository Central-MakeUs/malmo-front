import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export function removeNonNumeric(str: string): string {
  return str.replace(/[^0-9]/g, '')
}

export function formatDate(date?: string, format?: string) {
  return date
    ? dayjs
        .utc(date)
        .local()
        .format(format || 'YYYY-MM-DD')
    : '-'
}

export function formatDateTime(date?: string, format?: string) {
  return date
    ? dayjs
        .utc(date)
        .local()
        .format(format || 'YYYY-MM-DD HH:mm:ss')
    : '-'
}

export function formatPrice(price?: number) {
  return price ? `${price.toLocaleString('ko-KR')} 원` : '-'
}

export function formatNumberWithComma(value?: number) {
  return value ? value.toLocaleString('ko-KR') : 0
}

export function formatBoolean(value?: boolean) {
  return typeof value === 'boolean' ? (value ? 'O' : 'X') : '-'
}
