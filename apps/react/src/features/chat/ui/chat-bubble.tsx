import { BaseListSwaggerResponseChatRoomMessageData } from '@data/user-api-axios/api'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Bookmark, Copy } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

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
type MenuPlacement = 'top' | 'bottom'
type ChatMessagePages = InfiniteData<BaseListSwaggerResponseChatRoomMessageData>

const findScrollContainer = (element: HTMLElement | null) => {
  let current = element?.parentElement ?? null
  while (current) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    if (overflowY !== 'visible' && current.scrollHeight > current.clientHeight) {
      return current
    }
    current = current.parentElement
  }
  return null
}

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
  onRemoveBookmark: () => void
  isBookmarked: boolean
  placement: MenuPlacement
  menuRef: React.RefObject<HTMLDivElement | null>
}

function MessageActionMenu({
  align,
  onCopy,
  onBookmark,
  onRemoveBookmark,
  isBookmarked,
  placement,
  menuRef,
}: MessageActionMenuProps) {
  const bookmarkLabel = isBookmarked ? '북마크 삭제' : '북마크'
  const handleBookmarkClick = isBookmarked ? onRemoveBookmark : onBookmark
  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute z-10 min-w-[160px] rounded-[10px] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.12)]',
        align === 'right' ? 'right-0' : 'left-0',
        placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
      )}
    >
      <button type="button" className="flex w-full items-center justify-between gap-4" onClick={onCopy}>
        <span className="body3-medium text-gray-iron-700">복사</span>
        <Copy className="h-4 w-4 text-gray-iron-700" />
      </button>
      <hr className="my-[10px] h-px border-0 bg-gray-iron-100" />
      <button type="button" className="flex w-full items-center justify-between gap-4" onClick={handleBookmarkClick}>
        <span className="body3-medium text-gray-iron-700">{bookmarkLabel}</span>
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
  bookmarkId?: number | null
  className?: string
  children: ReactNode
}

function ActionableBubble({
  align,
  variant,
  copyText,
  chatRoomId,
  messageId,
  bookmarkId = null,
  className,
  children,
}: ActionableBubbleProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>('top')
  const timerRef = useRef<number | null>(null)
  const startPointRef = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { mutateAsync: createBookmark, isPending: isCreatingBookmark } = useMutation(
    bookmarkService.createBookmarkMutation()
  )
  const { mutateAsync: deleteBookmarks, isPending: isDeletingBookmark } = useMutation(
    bookmarkService.deleteBookmarksMutation()
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

  useLayoutEffect(() => {
    if (!isMenuOpen) return
    const menuEl = menuRef.current
    const anchorEl = containerRef.current
    if (!menuEl || !anchorEl) return

    const scrollContainer = findScrollContainer(anchorEl)
    const scrollRect = (scrollContainer ?? document.documentElement).getBoundingClientRect()
    const anchorRect = anchorEl.getBoundingClientRect()
    const menuHeight = menuEl.offsetHeight
    const gap = 8
    const spaceAbove = anchorRect.top - scrollRect.top
    const spaceBelow = scrollRect.bottom - anchorRect.bottom

    if (spaceAbove < menuHeight + gap && spaceBelow >= menuHeight + gap) {
      setMenuPlacement('bottom')
    } else {
      setMenuPlacement('top')
    }
  }, [isMenuOpen])

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

  const updateMessageBookmarkId = useCallback(
    (nextBookmarkId?: number) => {
      if (messageId == null) return
      const updateList = (oldData: ChatMessagePages | undefined) => {
        if (!oldData?.pages) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            if (!page?.list) return page
            return {
              ...page,
              list: page.list.map((item) => {
                if (item?.messageId !== messageId) return item
                return {
                  ...item,
                  bookmarkId: nextBookmarkId,
                }
              }),
            }
          }),
        }
      }

      queryClient.setQueriesData<ChatMessagePages>({ queryKey: queryKeys.chat.messages() }, updateList)
      if (chatRoomId != null) {
        queryClient.setQueriesData<ChatMessagePages>({ queryKey: queryKeys.history.detail(chatRoomId) }, updateList)
      }
    },
    [chatRoomId, messageId, queryClient]
  )

  const handleBookmark = useCallback(async () => {
    if (isCreatingBookmark) return
    if (chatRoomId == null || messageId == null) {
      toast.error('북마크할 메시지를 찾을 수 없어요')
      closeMenu()
      return
    }
    try {
      const response = await createBookmark({ chatRoomId, messageId })
      updateMessageBookmarkId(response?.bookmarkId ?? undefined)
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookmark.all })
    } finally {
      closeMenu()
    }
  }, [chatRoomId, closeMenu, createBookmark, isCreatingBookmark, messageId, queryClient, updateMessageBookmarkId])

  const handleRemoveBookmark = useCallback(async () => {
    if (isDeletingBookmark) return
    if (chatRoomId == null) {
      toast.error('북마크를 삭제할 메시지를 찾을 수 없어요')
      closeMenu()
      return
    }

    if (bookmarkId == null) {
      toast.error('북마크 정보를 찾을 수 없어요')
      closeMenu()
      return
    }

    try {
      await deleteBookmarks({ chatRoomId, bookmarkIdList: [bookmarkId] })
      updateMessageBookmarkId(undefined)
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookmark.all })
    } finally {
      closeMenu()
    }
  }, [bookmarkId, chatRoomId, closeMenu, deleteBookmarks, isDeletingBookmark, queryClient, updateMessageBookmarkId])

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
      {isMenuOpen && (
        <MessageActionMenu
          align={align}
          onCopy={handleCopy}
          onBookmark={handleBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          isBookmarked={bookmarkId != null}
          placement={menuPlacement}
          menuRef={menuRef}
        />
      )}
      <div className={cn(className, isPressed ? pressedColor : baseColor)}>{children}</div>
    </div>
  )
}

interface MessageMetadataProps {
  align: MenuAlign
  isBookmarked: boolean
  showTimestamp: boolean
  timestamp?: string
  timestampClassName: string
}

function MessageMetadata({ align, isBookmarked, showTimestamp, timestamp, timestampClassName }: MessageMetadataProps) {
  const shouldShowMetadata = isBookmarked || (showTimestamp && !!timestamp)
  if (!shouldShowMetadata) return null

  return (
    <div className={cn('flex flex-col', align === 'right' ? 'items-end' : 'items-start')}>
      {isBookmarked && <Bookmark className="mb-1 h-3 w-3 text-gray-iron-700" fill="currentColor" />}
      {showTimestamp && timestamp && <p className={timestampClassName}>{timestamp}</p>}
    </div>
  )
}

interface AiChatBubbleProps {
  messageId?: number
  chatRoomId?: number
  message?: string
  timestamp?: string
  showTimestamp?: boolean
  senderName?: string
  isTyping?: boolean
  bookmarkId?: number | null
  showHeader?: boolean
}

export function AiChatBubble(props: AiChatBubbleProps) {
  const {
    messageId,
    chatRoomId,
    message = '',
    senderName = '모모',
    timestamp = '',
    showTimestamp = true,
    isTyping = false,
    bookmarkId = null,
    showHeader = true,
  } = props
  const isBookmarked = bookmarkId != null

  const messageGroups = useMemo(() => (isTyping ? [] : groupSentences(message, 3)), [isTyping, message])

  return (
    <div className="flex w-full items-start gap-3">
      {showHeader ? (
        <img src={momoChat} alt={`${senderName} 캐릭터 이미지`} className="h-auto w-[50px] flex-shrink-0" />
      ) : (
        <div className="h-auto w-[50px] flex-shrink-0" aria-hidden />
      )}

      <div className="flex-1">
        {showHeader && <p className="body3-semibold mb-[6px] text-malmo-rasberry-500">{senderName}</p>}
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
                bookmarkId={bookmarkId}
                className={cn('w-fit max-w-full rounded-[10px] rounded-tl-none px-[14px] py-[10px]', {
                  'mb-2': index < messageGroups.length - 1,
                })}
              >
                <p className="body2-regular break-words text-gray-800">{group}</p>
              </ActionableBubble>
              {index === messageGroups.length - 1 && (
                <MessageMetadata
                  align="left"
                  isBookmarked={isBookmarked}
                  showTimestamp={showTimestamp}
                  timestamp={timestamp}
                  timestampClassName="label2-regular text-gray-600"
                />
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
  showTimestamp?: boolean
  bookmarkId?: number | null
  onRetry?: () => void
}

export function MyChatBubble({
  messageId,
  chatRoomId,
  message = '',
  timestamp,
  showTimestamp = true,
  bookmarkId = null,
  status = 'sent',
  onRetry,
}: MyChatBubbleProps & ChatMessageTempStatus) {
  const isBookmarked = bookmarkId != null
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
        <MessageMetadata
          align="right"
          isBookmarked={isBookmarked}
          showTimestamp={showTimestamp}
          timestamp={timestamp}
          timestampClassName="text-[11px] leading-[20px] text-gray-600"
        />
        <ActionableBubble
          align="right"
          variant="user"
          copyText={message}
          chatRoomId={chatRoomId}
          messageId={messageId}
          bookmarkId={bookmarkId}
          className={cn('w-fit max-w-full rounded-[10px] rounded-br-none px-[14px] py-[10px]', {
            'border border-red-300': status === 'failed',
          })}
        >
          <p className="body2-regular break-words text-gray-800">{message}</p>
        </ActionableBubble>
      </div>
    </div>
  )
}
