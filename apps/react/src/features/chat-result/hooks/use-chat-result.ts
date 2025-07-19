import { useState } from 'react'

export interface ChatResultData {
  date: string
  subject: string
  summary: string
  relation: string
  solution: string
}

const DUMMY_CHAT_RESULT: ChatResultData = {
  date: '2025년 7월 3일',
  subject: '회피형 남자친구의 연락두절 문제',
  summary:
    '남자친구는 여사친과 몰래 밥을 먹은 일에 대해 사과하길 회피했다. 이전에도 비슷한 상황이 반복되었고, 베리는 자신의 감정을 과한 것으로 여기며 소통에 어려움을 경험했다.',
  relation:
    '회피형 성향의 남자친구는 비난으로 느껴지는 말과 요구에 부담을 느끼고, 불안형 성향의 베리는 명확한 애정 표현과 확인을 요구하면서 두 사람의 갈등이 심화되고 있다.',
  solution:
    '남자친구가 방어적이지 않도록, 대화 전 일정한 거리를 두고 대화하길 추천함. 대화 목적이 관계 개선임을 먼저 짚고, 자기방어형 말하기에는 상대의 의도를 인정하면서도 감정을 정리해 전하는 것이 중요함.\n\n예: “네가 그런 의도가 아니었다는 건 알지만, 나는 그 말에 힘들었어.”',
}

export function useChatResult() {
  const [data] = useState(DUMMY_CHAT_RESULT)
  return data
}
