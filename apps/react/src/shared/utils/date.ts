/**
 * Date 객체를 지정된 포맷 문자열에 따라 변환합니다.
 *
 * @param date 변환할 Date 객체
 * @param format 포맷 문자열. 예: 'YYYY-MM-DD HH:mm:ss'
 * - YYYY: 4자리 연도 (e.g., 2025)
 * - YY: 2자리 연도 (e.g., 25)
 * - M: 월 (e.g., 1, 12)
 * - MM: 2자리 월 (e.g., 01, 12)
 * - D: 일 (e.g., 1, 31)
 * - DD: 2자리 일 (e.g., 01, 31)
 * - H: 시간 (24시간, e.g., 0, 23)
 * - HH: 2자리 시간 (24시간, e.g., 00, 23)
 * - m: 분 (e.g., 0, 59)
 * - mm: 2자리 분 (e.g., 00, 59)
 * - s: 초 (e.g., 0, 59)
 * - ss: 2자리 초 (e.g., 00, 59)
 * @returns 포맷이 적용된 날짜 문자열
 */
export function formatDate(dateString?: string | Date, format?: string): string {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)

  if (!format) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const replacements = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: String(date.getMonth() + 1),
    DD: String(date.getDate()).padStart(2, '0'),
    D: String(date.getDate()),
    HH: String(date.getHours()).padStart(2, '0'),
    H: String(date.getHours()),
    mm: String(date.getMinutes()).padStart(2, '0'),
    m: String(date.getMinutes()),
    ss: String(date.getSeconds()).padStart(2, '0'),
    s: String(date.getSeconds()),
  }

  // 긴 문자열(YYYY)부터 치환될 수 있도록 정규식을 생성합니다.
  const regex = /YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s/g

  return format.replace(regex, (match) => replacements[match as keyof typeof replacements])
}

// D-day 계산
export function calculateDDay(startLoveDate?: string | null): number {
  if (!startLoveDate) return 0

  // 'YYYY-MM-DD'를 로컬 자정으로 생성 (UTC 파싱 피하기)
  const [y, m, d] = startLoveDate.split('-').map(Number)
  if (!y || !m || !d) return 0

  const startLocalMidnight = new Date(y, m - 1, d) // 로컬 00:00
  const now = new Date()
  const todayLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const days = Math.floor((todayLocalMidnight.getTime() - startLocalMidnight.getTime()) / 86400000) + 1

  return days
}
