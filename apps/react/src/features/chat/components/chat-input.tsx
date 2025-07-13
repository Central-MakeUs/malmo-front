import { ArrowUp, PlusCircle, Send } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@ui/common/lib/utils'

function ChatInput() {
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
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
    if (text.trim()) {
      console.log('Sending message:', text)
      // 실제 전송 로직 구현...
      setText('')
    }
  }

  // Shift+Enter는 줄바꿈, Enter는 전송으로 처리합니다.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 w-full bg-white px-5 py-[10px]">
      {/* 포커스 시에만 글자 수 카운터를 표시합니다. */}
      {isFocused && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-[12px] border border-gray-200 bg-white px-2 py-[2px] shadow-[1px_2px_12px_0px_#00000014]">
          <p className="text-label-1 font-medium text-gray-500">{text.length}/500자</p>
        </div>
      )}

      <div className="flex w-full items-end gap-2">
        <PlusCircle className="mb-2 h-6 w-6 flex-shrink-0 cursor-pointer text-gray-400" />

        {/* 커스텀 Textarea 컨테이너 */}
        <div
          className={cn(
            'flex w-full items-end gap-4 rounded-[22px] border border-gray-300 bg-white py-2.5 pr-2.5 pl-3 transition-colors',
            { 'border-malmo-rasberry-500': isFocused }
          )}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none border-none bg-transparent py-[3px] text-body-2 outline-none placeholder:text-body-2"
            placeholder="메시지를 입력해주세요"
            rows={1}
          />

          {/* 텍스트가 있을 때만 전송 버튼을 표시합니다. */}
          {text.length > 0 && (
            <button
              type="submit"
              className="flex items-center justify-center rounded-full bg-malmo-rasberry-50 p-1 text-malmo-rasberry-500"
              disabled={!text.trim()}
            >
              <ArrowUp size={20} />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default ChatInput
