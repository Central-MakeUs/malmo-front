import apiInstance from '../libs/api'
import {
  ChatroomApi,
  ChatroomApiGetChatRoomListRequest,
  ChatRoomListSuccessResponse,
  Pageable,
} from '@data/user-api-axios/api'

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

  async getHistory({ chatRoomId, params }: { chatRoomId: number; params: Pageable }) {
    const { data } = await this.getChatRoomMessages({
      pageable: params,
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
