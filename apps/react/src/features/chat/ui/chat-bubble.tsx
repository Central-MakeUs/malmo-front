import { AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'

import momoChat from '@/assets/images/momo-chat.png'
import { cn } from '@/shared/lib/cn'

import { ChatMessageTempStatus } from '../hooks/use-chat-queries'
import { groupSentences } from '../util/chat-format'

interface AiChatBubbleProps {
  message?: string
  timestamp: string
  senderName?: string
}

export function AiChatBubble(props: AiChatBubbleProps) {
  const { message = '', senderName = '모모', timestamp } = props

  const messageGroups = useMemo(() => groupSentences(message, 3), [message])

  return (
    <div className="flex w-full items-start gap-3">
      <img src={momoChat} alt={`${senderName} 캐릭터 이미지`} className="h-auto w-[50px] flex-shrink-0" />

      <div className="flex-1">
        <p className="body3-semibold mb-[6px] text-malmo-rasberry-500">{senderName}</p>
        {messageGroups.map((group, index) => (
          <div
            key={index}
            className={cn('flex flex-nowrap items-end gap-2', { 'mr-9': index < messageGroups.length - 1 })}
          >
            <div
              className={cn('w-fit max-w-full rounded-[10px] rounded-tl-none bg-gray-100 px-[14px] py-[10px]', {
                'mb-2': index < messageGroups.length - 1,
              })}
            >
              <p className="body2-regular break-words text-gray-800">{group}</p>
            </div>
            {index === messageGroups.length - 1 && <p className="label2-regular text-gray-600">{timestamp}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

interface MyChatBubbleProps {
  message?: string
  timestamp: string
  onRetry?: () => void
}

export function MyChatBubble({
  message = '',
  timestamp,
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
        <p className="flex-shrink-0 text-[11px] leading-[20px] text-gray-600">{timestamp}</p>
        <div
          className={cn('w-fit max-w-full rounded-[10px] rounded-br-none bg-[#FFF2F4] px-[14px] py-[10px]', {
            'border border-red-300': status === 'failed',
          })}
        >
          <p className="body2-regular break-words break-keep text-gray-800">{message}</p>
        </div>
      </div>
    </div>
  )
}
