import apiInstance from '../libs/api'
import { ChatroomApi, ChatroomApiGetChatRoomListRequest, ChatRoomListSuccessResponse } from '@data/user-api-axios/api'

export const QUERY_KEY = 'histories'

class HistoryService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getHistoryList({
    pageable: { page, size },
    keyword,
  }: ChatroomApiGetChatRoomListRequest): Promise<ChatRoomListSuccessResponse> {
    const { data } = await this.getChatRoomList({
      pageable: {
        page,
        size,
      },
      keyword,
    })
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
    const { data } = await this.getChatRoomMessages({
      pageable: {
        page: 0,
        size: 10,
      },
      chatRoomId,
    })
    return data
  }

  async getChatroomSummary(chatRoomId: number) {
    const { data } = await this.getCurrentChatRoom({ chatRoomId })
    return data
  }
}

export default new HistoryService()
