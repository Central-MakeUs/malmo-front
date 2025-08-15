import { ChatRoomStateDataChatRoomStateEnum } from '@data/user-api-axios/api'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowUp } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

import { cn } from '@/shared/lib/cn'
import chatService from '@/shared/services/chat.service'

import { useChatting } from '../context/chatting-context'
import { useSendMessageMutation } from '../hooks/use-chat-queries'

function ChatInput(props: { disabled?: boolean }) {
  const queryClient = useQueryClient()

  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { setSendingMessageTrue, sendingMessage } = useChatting()

  const { mutate: sendMessage, isPending } = useSendMessageMutation()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= 500) {
      setText(newText)
    }
  }

  // 텍스트 길이에 따라 textarea 높이를 자동으로 조절합니다.
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 최대 높이 (약 5줄)

      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`
        textarea.style.overflowY = 'auto'
      } else {
        textarea.style.height = `${scrollHeight}px`
        textarea.style.overflowY = 'hidden'
      }
    }
  }, [text])

  // 메시지 전송 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && !isPending) {
      sendMessage(text)
      setSendingMessageTrue()
      setText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const paused =
    queryClient.getQueryData(chatService.chatRoomStatusQuery().queryKey) === ChatRoomStateDataChatRoomStateEnum.Paused
  const disabled = props.disabled || paused || isPending || sendingMessage

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white px-5 py-[10px]">
      {/* 포커스 시에만 글자 수 카운터를 표시합니다. */}
      {isFocused && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-[12px] border border-gray-200 bg-white px-2 py-[2px] shadow-[1px_2px_12px_0px_#00000014]">
          <p className="label1-medium text-gray-500">{text.length}/500자</p>
        </div>
      )}

      <div className="flex w-full items-end gap-2">
        {/* 커스텀 Textarea 컨테이너 */}
        <div
          className={cn(
            'relative flex w-full items-end gap-4 rounded-[22px] border border-gray-300 bg-white py-2.5 pr-2.5 pl-3 transition-colors'
          )}
        >
          <textarea
            disabled={disabled}
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="body2-regular placeholder:body2-regular flex-1 resize-none border-none bg-transparent py-[3px] pr-11 outline-none"
            placeholder={
              props.disabled
                ? '대화가 불가능해요'
                : paused
                  ? '커플 연동이 완료된 후에 채팅이 가능해요'
                  : sendingMessage
                    ? '모모의 답변이 완료된 후 채팅이 가능해요'
                    : '메시지를 입력해주세요'
            }
            rows={1}
          />

          {/* 텍스트가 있을 때만 전송 버튼을 표시합니다. */}
          <button
            type="submit"
            className={cn('absolute right-[10px] rounded-full bg-malmo-rasberry-50 p-1 text-malmo-rasberry-500', {
              'cursor-not-allowed bg-malmo-rasberry-25 text-malmo-rasberry-100': !text.trim(),
            })}
            disabled={!text.trim() || disabled}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChatInput
