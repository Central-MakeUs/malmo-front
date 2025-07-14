/**
 * ISO 8601 형식의 날짜 문자열을 'YYYY년 MM월 DD일' 형식으로 변환합니다.
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * ISO 8601 형식의 날짜 문자열을 'HH:mm' 형식으로 변환합니다.
 */
export const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 텍스트를 문장 단위로 분리한 후, 지정된 개수만큼 묶어 배열로 반환합니다.
 */
export const groupSentences = (text: string, sentencesPerBubble: number = 3): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text]
  const trimmedSentences = sentences.map((s) => s.trim()).filter((s) => s.length > 0)

  if (trimmedSentences.length === 0) {
    return []
  }

  const bubbles: string[] = []
  for (let i = 0; i < trimmedSentences.length; i += sentencesPerBubble) {
    bubbles.push(trimmedSentences.slice(i, i + sentencesPerBubble).join(' '))
  }
  return bubbles
}
