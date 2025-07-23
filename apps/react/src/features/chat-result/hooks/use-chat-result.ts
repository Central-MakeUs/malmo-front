import bridge from '@/shared/bridge'
import historyService from '@/shared/services/history.service'
import { GetChatRoomSummaryData } from '@data/user-api-axios/api'
import { useEffect, useState } from 'react'

export function useChatResult(chatId: number | undefined) {
  const [data, setData] = useState<GetChatRoomSummaryData>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (chatId) {
        const { data } = await historyService.getChatroomSummary(chatId)

        if (data) {
          setData(data)
        }
      }
    }
    setIsLoading(true)
    fetchData()
    setIsLoading(false)
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

  return { chatResult: data, summaryData, isLoading }
}
