import momoChat from '@/assets/images/momo-chat.png'
import { useMemo } from 'react'
import { groupSentences } from '../util/chat-format'
import { cn } from '@/shared/lib/cn'

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

      <div className="flex flex-1 items-end gap-2">
        <div className="flex-1">
          <p className="body3-semibold mb-[6px] text-malmo-rasberry-500">{senderName}</p>
          {messageGroups.map((group, index) => (
            <div
              key={index}
              className={cn('w-fit max-w-full rounded-[10px] rounded-tl-none bg-gray-100 px-[14px] py-[10px]', {
                'mb-2': index < messageGroups.length - 1,
              })}
            >
              <p className="body2-regular break-words text-gray-800">{group}</p>
            </div>
          ))}
        </div>
        <p className="label2-regular text-gray-600">{timestamp}</p>
      </div>
    </div>
  )
}

interface MyChatBubbleProps {
  message?: string
  timestamp: string
}

export function MyChatBubble({ message = '', timestamp }: MyChatBubbleProps) {
  return (
    <div className="flex w-full justify-end">
      <div className="flex items-end gap-2">
        <p className="flex-shrink-0 text-[11px] leading-[20px] text-gray-600">{timestamp}</p>
        <div className="w-fit max-w-full rounded-[10px] rounded-br-none bg-[#FFF2F4] px-[14px] py-[10px]">
          <p className="body2-regular break-words break-keep text-gray-800">{message}</p>
        </div>
      </div>
    </div>
  )
}
