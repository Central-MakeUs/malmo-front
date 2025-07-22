import { queryOptions } from '@tanstack/react-query'
import apiInstance from '../libs/api'
import { ChatroomApi, ChatRequest } from '@data/user-api-axios/api'

export const QUERY_KEY = 'histories'

class HistoryService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getHistoryList() {
    const { data } = await this.getChatRoomList()
    return data
  }

  async deleteHistory(chatRoomIdList: number[]) {
    const { data } = await this.deleteChatRooms({
      deleteChatRoomRequestDto: {
        chatRoomIdList,
      },
    })
    return data
  }

  async getHistory(chatRoomId: number) {
    const { data } = await this.getChatRoomMessages({ chatRoomId })
    return data
  }

  async getChatroomSummary(chatRoomId: number) {
    const { data } = await this.getCurrentChatRoom({ chatRoomId })
    return data
  }
}

export default new HistoryService()
