import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Bookmark, Copy } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import momoChat from '@/assets/images/momo-chat.png'
import { cn } from '@/shared/lib/cn'
import bookmarkService from '@/shared/services/bookmark.service'
import { queryKeys } from '@/shared/services/query-keys'
import { toast } from '@/shared/ui/toast'

import { ChatMessageTempStatus } from '../hooks/use-chat-queries'
import { groupSentences } from '../util/chat-format'

const LONG_PRESS_DELAY = 350
const MOVE_THRESHOLD = 8

type MenuAlign = 'left' | 'right'
type BubbleVariant = 'assistant' | 'user'

const copyToClipboard = async (text: string) => {
  if (!text) return false
  if (!navigator?.clipboard?.writeText) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

interface MessageActionMenuProps {
  align: MenuAlign
  onCopy: () => void
  onBookmark: () => void
}

function MessageActionMenu({ align, onCopy, onBookmark }: MessageActionMenuProps) {
  return (
    <div
      className={cn(
        'absolute bottom-full z-10 mb-2 min-w-[160px] rounded-[10px] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.12)]',
        align === 'right' ? 'right-0' : 'left-0'
      )}
    >
      <button type="button" className="flex w-full items-center justify-between gap-4" onClick={onCopy}>
        <span className="body3-medium text-gray-iron-700">복사</span>
        <Copy className="h-4 w-4 text-gray-iron-700" />
      </button>
      <hr className="my-[10px] h-px border-0 bg-gray-iron-100" />
      <button type="button" className="flex w-full items-center justify-between gap-4" onClick={onBookmark}>
        <span className="body3-medium text-gray-iron-700">북마크</span>
        <Bookmark className="h-4 w-4 text-gray-iron-700" />
      </button>
    </div>
  )
}

interface ActionableBubbleProps {
  align: MenuAlign
  variant: BubbleVariant
  copyText: string
  chatRoomId?: number
  messageId?: number
  className?: string
  children: ReactNode
}

function ActionableBubble({
  align,
  variant,
  copyText,
  chatRoomId,
  messageId,
  className,
  children,
}: ActionableBubbleProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const timerRef = useRef<number | null>(null)
  const startPointRef = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { mutateAsync: createBookmark, isPending: isCreatingBookmark } = useMutation(
    bookmarkService.createBookmarkMutation()
  )

  const clearPressTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setIsPressed(false)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }
    document.addEventListener('pointerdown', handleOutsidePress)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePress)
    }
  }, [closeMenu, isMenuOpen])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      clearPressTimer()
      startPointRef.current = { x: event.clientX, y: event.clientY }
      timerRef.current = window.setTimeout(() => {
        setIsPressed(true)
        setIsMenuOpen(true)
      }, LONG_PRESS_DELAY)
    },
    [clearPressTimer]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!startPointRef.current || timerRef.current === null) return
      const deltaX = event.clientX - startPointRef.current.x
      const deltaY = event.clientY - startPointRef.current.y
      if (Math.hypot(deltaX, deltaY) > MOVE_THRESHOLD) {
        clearPressTimer()
        startPointRef.current = null
      }
    },
    [clearPressTimer]
  )

  const handlePointerUp = useCallback(() => {
    clearPressTimer()
    startPointRef.current = null
  }, [clearPressTimer])

  const handlePointerLeave = useCallback(() => {
    clearPressTimer()
    startPointRef.current = null
  }, [clearPressTimer])

  const handlePointerCancel = useCallback(() => {
    clearPressTimer()
    startPointRef.current = null
  }, [clearPressTimer])

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(copyText)
    if (success) {
      toast.success('클립보드에 복사했어요')
    } else {
      toast.error('클립보드 복사에 실패했어요')
    }
    closeMenu()
  }, [closeMenu, copyText])

  const handleBookmark = useCallback(async () => {
    if (isCreatingBookmark) return
    if (chatRoomId == null || messageId == null) {
      toast.error('북마크할 메시지를 찾을 수 없어요')
      closeMenu()
      return
    }
    try {
      await createBookmark({ chatRoomId, messageId })
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookmark.all })
    } finally {
      closeMenu()
    }
  }, [chatRoomId, closeMenu, createBookmark, isCreatingBookmark, messageId])

  const baseColor = variant === 'user' ? 'bg-malmo-rasberry-10' : 'bg-gray-100'
  const pressedColor = variant === 'user' ? 'bg-malmo-rasberry-50' : 'bg-gray-300'

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      {isMenuOpen && <MessageActionMenu align={align} onCopy={handleCopy} onBookmark={handleBookmark} />}
      <div className={cn(className, isPressed ? pressedColor : baseColor)}>{children}</div>
    </div>
  )
}

interface AiChatBubbleProps {
  messageId?: number
  chatRoomId?: number
  message?: string
  timestamp?: string
  senderName?: string
  isTyping?: boolean
  isSaved?: boolean
}

export function AiChatBubble(props: AiChatBubbleProps) {
  const { messageId, chatRoomId, message = '', senderName = '모모', timestamp = '', isTyping = false, isSaved } = props

  const messageGroups = useMemo(() => (isTyping ? [] : groupSentences(message, 3)), [isTyping, message])

  return (
    <div className="flex w-full items-start gap-3">
      <img src={momoChat} alt={`${senderName} 캐릭터 이미지`} className="h-auto w-[50px] flex-shrink-0" />

      <div className="flex-1">
        <p className="body3-semibold mb-[6px] text-malmo-rasberry-500">{senderName}</p>
        {isTyping ? (
          <div className="flex items-end gap-2">
            <div className="w-fit max-w-full rounded-[10px] rounded-tl-none bg-gray-100 px-[16px] py-[12px]">
              <div className="flex items-center gap-[5px]">
                <span className="h-1 w-1 animate-pulse rounded-full bg-gray-iron-500" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-gray-iron-500 [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-gray-iron-500 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        ) : (
          messageGroups.map((group, index) => (
            <div
              key={index}
              className={cn('flex flex-nowrap items-end gap-2', { 'mr-9': index < messageGroups.length - 1 })}
            >
              <ActionableBubble
                align="left"
                variant="assistant"
                copyText={group}
                chatRoomId={chatRoomId}
                messageId={messageId}
                className={cn('w-fit max-w-full rounded-[10px] rounded-tl-none px-[14px] py-[10px]', {
                  'mb-2': index < messageGroups.length - 1,
                })}
              >
                <p className="body2-regular break-words text-gray-800">{group}</p>
              </ActionableBubble>
              {index === messageGroups.length - 1 && timestamp && (
                <div className="flex flex-col items-start">
                  {isSaved && <Bookmark className="mb-1 h-3 w-3 text-gray-iron-700" fill="currentColor" />}
                  <p className="label2-regular text-gray-600">{timestamp}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface MyChatBubbleProps {
  messageId?: number
  chatRoomId?: number
  message?: string
  timestamp: string
  isSaved?: boolean
  onRetry?: () => void
}

export function MyChatBubble({
  messageId,
  chatRoomId,
  message = '',
  timestamp,
  isSaved,
  status = 'sent',
  onRetry,
}: MyChatBubbleProps & ChatMessageTempStatus) {
  return (
    <div className="flex w-full justify-end">
      <div className="flex flex-nowrap items-end gap-2">
        {status === 'failed' && (
          <div className="flex flex-col items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <button onClick={onRetry} className="label2-regular text-gray-600 hover:underline">
              재시도
            </button>
          </div>
        )}
        <div className="flex flex-shrink-0 flex-col items-end">
          {isSaved && <Bookmark className="mb-1 h-3 w-3 text-gray-iron-700" fill="currentColor" />}
          <p className="text-[11px] leading-[20px] text-gray-600">{timestamp}</p>
        </div>
        <ActionableBubble
          align="right"
          variant="user"
          copyText={message}
          chatRoomId={chatRoomId}
          messageId={messageId}
          className={cn('w-fit max-w-full rounded-[10px] rounded-br-none px-[14px] py-[10px]', {
            'border border-red-300': status === 'failed',
          })}
        >
          <p className="body2-regular break-words break-keep text-gray-800">{message}</p>
        </ActionableBubble>
      </div>
    </div>
  )
}
