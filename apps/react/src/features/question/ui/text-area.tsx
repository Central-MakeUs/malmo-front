import { useBridge } from '@webview-bridge/react'
import { useEffect, useLayoutEffect, useRef } from 'react'

import bridge from '@/shared/bridge'
import { cn } from '@/shared/lib/cn'

interface CustomTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  maxLength: number
  minRows?: number
}

function CustomTextarea({ value, onChange, maxLength, minRows = 4 }: CustomTextareaProps) {
  const placeholderText = '여기에 답변을 적어주세요.\n모모가 답변 내용을 기억해서 상담해 드려요.'

  const keyboardHeight = useBridge(bridge.store, (state) => state.keyboardHeight)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)

  // 가용 영역 (px) 계산
  const computeMaxHeight = () => {
    const viewportH = window.innerHeight // 안드로이드 크롬/웹뷰는 키보드가 올라오면 보통 줄어듭니다
    const kb = Number.isFinite(keyboardHeight) ? keyboardHeight : 0

    const wrapperTop = wrapperRef.current?.getBoundingClientRect().top ?? 0
    const counterH = counterRef.current?.getBoundingClientRect().height ?? 0

    // 안전 여백(상하 패딩/마진 + 살짝의 숨쉬기 공간)
    const SAFE_PADDING = 16
    const INTERNAL_GAP = 8 // textarea와 카운터 사이 gap

    // textarea가 차지할 수 있는 최대 높이
    // = (뷰포트 높이 - 키보드) - (컴포넌트 상단 좌표) - (카운터 높이) - (여백들)
    const available = viewportH - kb - wrapperTop - counterH - SAFE_PADDING - INTERNAL_GAP

    // 최소 4줄 시작을 보장하기 위해 너무 작게 계산될 경우 대비
    return Math.max(available, 48 /* fallback 최소 높이 */)
  }

  // 최소 rows 높이(px) 계산
  const getMinRowsHeight = () => {
    const ta = textareaRef.current
    if (!ta) return 0
    // 한 줄 높이 추정 (line-height 사용)
    const style = window.getComputedStyle(ta)
    const line = parseFloat(style.lineHeight || '20')
    const paddingY = parseFloat(style.paddingTop || '0') + parseFloat(style.paddingBottom || '0')
    return Math.ceil(line * minRows + paddingY)
  }

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return

    // 먼저 최소 높이로 초기화
    const minH = getMinRowsHeight()
    ta.style.height = 'auto'
    ta.style.overflowY = 'hidden'

    const maxH = computeMaxHeight()
    // 내용 높이
    const contentH = Math.max(ta.scrollHeight, minH)

    const next = Math.min(contentH, maxH)
    ta.style.height = `${next}px`
    ta.style.maxHeight = `${maxH}px`

    // 내용이 더 크면 내부 스크롤
    if (contentH > maxH) {
      ta.style.overflowY = 'auto'
    }
  }

  // 값 변경/키보드 변경/리사이즈마다 재조정
  useLayoutEffect(() => {
    adjustHeight()
  }, [value, keyboardHeight])

  useEffect(() => {
    const onResize = () => adjustHeight()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const commonStyles =
    'w-full body2-reading-regular whitespace-pre-line rounded-lg text-base leading-relaxed resize-none focus:ring-0 focus:outline-none'

  return (
    <div ref={wrapperRef} className="relative flex min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden px-6">
      <div
        className={cn(
          commonStyles,
          'pointer-events-none absolute top-0 left-0 px-6 text-gray-400',
          value ? 'invisible' : 'visible'
        )}
        aria-hidden="true"
      >
        {placeholderText}
      </div>

      <textarea
        ref={textareaRef}
        className={cn(commonStyles, 'overflow-y-auto')}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={minRows}
      />

      <p ref={counterRef} className="label1-medium pointer-events-none text-end text-gray-500">
        {value.length}/{maxLength}
      </p>
    </div>
  )
}
export default CustomTextarea
