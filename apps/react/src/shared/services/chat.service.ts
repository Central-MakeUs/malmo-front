import { queryOptions } from '@tanstack/react-query'
import apiInstance from '../libs/api'
import {
  CouplesApi,
  CoupleLinkRequestDto,
  CoupleLinkSuccessResponse,
  ChatroomApi,
  ChatroomApiSendChatMessage1Request,
  ChatRequest,
  Pageable,
} from '@data/user-api-axios/api'

export const QUERY_KEY = 'chatrooms'

class ChatService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getChatroomStatus() {
    try {
      console.log('Fetching chat room status...')
      const { data } = await this.getCurrentChatRoom1()
      console.log('Chatroom status fetched:', data)
      return data
    } catch (error) {
      console.error('Error fetching chat room status:', error)
      throw error
    }
  }

  async getChatroomMessagesList(params?: Pageable) {
    const { data } = await this.getCurrentChatRoomMessages({
      pageable: params || { page: 0, size: 20 },
    })
    return data
  }

  async getChatroomSummary(chatRoomId: number) {
    const { data } = await this.getCurrentChatRoom({
      chatRoomId,
    })
    return data
  }

  async postChatroomComplete() {
    const { data } = await this.completeChatRoom()
    return data
  }

  async postChatroomSend(body: ChatRequest) {
    const { data } = await this.sendChatMessage1({ chatRequest: { ...body } })
    return data
  }

  async postChatroomUpgrade() {
    const { data } = await this.sendChatMessage()
    return data
  }
}

export default new ChatService()
