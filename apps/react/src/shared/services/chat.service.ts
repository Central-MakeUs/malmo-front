import apiInstance from '../libs/api'
import { ChatroomApi, ChatRequest, Pageable } from '@data/user-api-axios/api'

export const QUERY_KEY = 'chatrooms'

class ChatService extends ChatroomApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getChatroomStatus() {
    try {
      const { data } = await this.getCurrentChatRoom1()
      return data
    } catch (error) {
      console.error('Error fetching chatroom status:', error)
      throw error
    }
  }

  async getChatroomMessagesList(params?: Pageable) {
    const { data } = await this.getCurrentChatRoomMessages({ pageable: params || { page: 0, size: 20 } })
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
