export const queryKeys = {
  // === Question 관련 ===
  question: {
    all: ['question'] as const,
    today: () => [...queryKeys.question.all, 'today'] as const,
    past: (level: number) => [...queryKeys.question.all, 'past', level] as const,
    detail: (questionId: number) => [...queryKeys.question.all, 'detail', questionId] as const,
  },

  // === Member 관련 ===
  member: {
    all: ['member'] as const,
    inviteCode: () => [...queryKeys.member.all, 'inviteCode'] as const,
    partnerInfo: () => [...queryKeys.member.all, 'partnerInfo'] as const,
  },

  // === Chat 관련 ===
  chat: {
    all: ['chat'] as const,
    status: () => [...queryKeys.chat.all, 'status'] as const,
    messages: () => [...queryKeys.chat.all, 'messages'] as const,
    summary: (chatRoomId: number) => [...queryKeys.chat.all, 'summary', chatRoomId] as const,
  },

  // === History 관련 ===
  history: {
    all: ['history'] as const,
    list: (keyword?: string) => [...queryKeys.history.all, 'list', keyword] as const,
    detail: (chatRoomId: number) => [...queryKeys.history.all, 'detail', chatRoomId] as const,
    summary: (chatRoomId: number) => [...queryKeys.history.all, 'summary', chatRoomId] as const,
  },

  // === Bookmark 관련 ===
  bookmark: {
    all: ['bookmark'] as const,
    list: (chatRoomId: number, params?: { page?: number; size?: number; sort?: string[] }) =>
      [
        ...queryKeys.bookmark.all,
        'list',
        chatRoomId,
        params?.page ?? 0,
        params?.size ?? 0,
        params?.sort?.join(',') ?? '',
      ] as const,
  },

  // === Terms 관련 ===
  terms: {
    all: ['terms'] as const,
    list: () => [...queryKeys.terms.all, 'list'] as const,
  },

  // === Love Type 관련 ===
  loveType: {
    all: ['loveType'] as const,
    questions: () => [...queryKeys.loveType.all, 'questions'] as const,
  },

  // === Login 관련 ===
  login: {
    all: ['login'] as const,
  },

  // === SignUp 관련 ===
  signUp: {
    all: ['signUp'] as const,
  },

  // === Couple 관련 ===
  couple: {
    all: ['couple'] as const,
  },

  // === Notification 관련 ===
  notification: {
    all: ['notification'] as const,
    pending: () => [...queryKeys.notification.all, 'pending'] as const,
  },
} as const

// 타입 추출
export type QueryKeys = typeof queryKeys
