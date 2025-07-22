import bridge from '@/shared/bridge'
import historyService from '@/shared/services/history.service'
import { GetChatRoomSummaryData } from '@data/user-api-axios/api'
import { useEffect, useState } from 'react'

const DUMMY_CHAT_RESULT: GetChatRoomSummaryData = {
  chatRoomId: 12345,
  // date: '2025년 7월 3일',
  totalSummary: '회피형 남자친구의 연락두절 문제',
  firstSummary:
    '남자친구는 여사친과 몰래 밥을 먹은 일에 대해 사과하길 회피했다. 이전에도 비슷한 상황이 반복되었고, 베리는 자신의 감정을 과한 것으로 여기며 소통에 어려움을 경험했다.',
  secondSummary:
    '회피형 성향의 남자친구는 비난으로 느껴지는 말과 요구에 부담을 느끼고, 불안형 성향의 베리는 명확한 애정 표현과 확인을 요구하면서 두 사람의 갈등이 심화되고 있다.',
  thirdSummary:
    '남자친구가 방어적이지 않도록, 대화 전 일정한 거리를 두고 대화하길 추천함. 대화 목적이 관계 개선임을 먼저 짚고, 자기방어형 말하기에는 상대의 의도를 인정하면서도 감정을 정리해 전하는 것이 중요함.\n\n예: “네가 그런 의도가 아니었다는 건 알지만, 나는 그 말에 힘들었어.”',
}

export function useChatResult(chatId: number | undefined) {
  const [data, setData] = useState(DUMMY_CHAT_RESULT)

  useEffect(() => {
    async function fetchData() {
      if (chatId) {
        const { data } = await historyService.getChatroomSummary(chatId)

        if (data) {
          setData(data)
        }
      }
    }
    fetchData()
  }, [chatId])

  useEffect(() => {
    bridge.changeStatusBarColor('#FDEDF0')

    return () => {
      bridge.changeStatusBarColor('#fff')
    }
  }, [])

  const summaryData = [
    { title: '상황 요약', content: data.firstSummary },
    { title: '관계 이해', content: data.secondSummary },
    { title: '해결 제안', content: data.thirdSummary },
  ]

  return { chatResult: data, summaryData }
}
