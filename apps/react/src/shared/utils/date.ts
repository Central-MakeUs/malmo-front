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
    return date.toISOString()
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
