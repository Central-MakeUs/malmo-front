// 날짜 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
export function formatDate(date: Date, separator: string = '-'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${separator}${month}${separator}${day}`
}

// D-day 계산
export function calculateDDay(startLoveDate: string | undefined | null): number {
  if (!startLoveDate) return 0

  return Math.floor((Date.now() - new Date(startLoveDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
}
