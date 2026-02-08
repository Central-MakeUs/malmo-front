import { GetChatRoomListResponse } from '@data/user-api-axios/api'

export const CHAT_ROOM_STATE = {
  Alive: 'ALIVE',
  Completed: 'COMPLETED',
  Deleted: 'DELETED',
} as const

export type ChatRoomState = (typeof CHAT_ROOM_STATE)[keyof typeof CHAT_ROOM_STATE]

export type ChatRoomListItem = GetChatRoomListResponse & {
  title?: string
  chatRoomState?: ChatRoomState
  level?: number
  lastMessageSentTime?: string
}
