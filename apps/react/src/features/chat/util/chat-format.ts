/**
 * ISO 8601 형식의 날짜 문자열을 'YYYY년 MM월 DD일' 형식으로 변환합니다.
 */
export const formatDate = (isoString?: string): string => {
  if (!isoString) return ''

  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * ISO 8601 형식의 날짜 문자열을 'HH:mm' 형식으로 변환합니다.
 */
export const formatTimestamp = (isoString?: string): string => {
  if (!isoString) return ''

  const date = new Date(isoString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 텍스트를 문장 단위로 분리한 후, 지정된 개수만큼 묶어 배열로 반환합니다.
 */
export const groupSentences = (text: string, sentencesPerBubble: number = 3): string[] => {
  const normalizedText = text.replace(/\r\n?/g, '\n').trim()
  if (!normalizedText) return []

  const sentenceSource = normalizedText.replace(/\n+/g, ' ')
  const sentences = sentenceSource.match(/[^.!?]+[.!?]*\s*/g) || [sentenceSource]
  const trimmedSentences = sentences.map((s) => s.trim()).filter((s) => s.length > 0)

  if (trimmedSentences.length === 0) {
    return [sentenceSource].map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 0)
  }

  const bubbleSize = Math.max(1, sentencesPerBubble)
  const bubbles: string[] = []
  for (let i = 0; i < trimmedSentences.length; i += bubbleSize) {
    const bubble = trimmedSentences.slice(i, i + bubbleSize).join(' ').trim()
    if (bubble.length > 0) {
      bubbles.push(bubble)
    }
  }
  return bubbles
}
