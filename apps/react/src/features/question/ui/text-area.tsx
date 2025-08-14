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

  const readPxVar = (name: string) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
    const n = parseFloat(raw || '0')
    return Number.isFinite(n) ? n : 0
  }

  // 키보드/세이프에어리어 하단 인셋 산출
  const getEffectiveBottomInset = () => {
    const safeBottom = readPxVar('--safe-bottom')
    const kb = Number.isFinite(keyboardHeight) ? keyboardHeight : 0
    const vv = window.visualViewport
    // VisualViewport가 있으면 키보드 영역이 이미 제외된 height가 들어오므로
    // 여기서는 safe-bottom만 고려 (추가 여유는 아래 FUDGE로)
    const kbInset = vv ? 0 : kb
    return Math.max(safeBottom, kbInset)
  }

  const computeMaxHeight = () => {
    const vv = window.visualViewport
    const viewportH = vv ? vv.height : window.innerHeight

    const bottomInset = getEffectiveBottomInset()
    const FUDGE = 12 // ✨ 키보드와 겹침 방지 여유

    const wrapperTop = wrapperRef.current?.getBoundingClientRect().top ?? 0
    const counterH = counterRef.current?.getBoundingClientRect().height ?? 0
    const INTERNAL_GAP = 8

    // textarea가 차지할 수 있는 최대 높이
    // = (보이는 뷰포트 높이 - 하단 인셋 - 여유) - (컴포넌트 상단) - (카운터) - (내부 간격)
    const available = viewportH - (bottomInset + FUDGE) - wrapperTop - counterH - INTERNAL_GAP

    return Math.max(available, 48) // 최소 안전 높이
  }

  const getMinRowsHeight = () => {
    const ta = textareaRef.current
    if (!ta) return 0
    const style = window.getComputedStyle(ta)
    const line = parseFloat(style.lineHeight || '20')
    const paddingY = parseFloat(style.paddingTop || '0') + parseFloat(style.paddingBottom || '0')
    return Math.ceil(line * (minRows ?? 4) + paddingY)
  }

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return

    const minH = getMinRowsHeight()
    ta.style.height = 'auto'
    ta.style.overflowY = 'hidden'

    const maxH = computeMaxHeight()
    const contentH = Math.max(ta.scrollHeight, minH)

    const next = Math.min(contentH, maxH)
    ta.style.height = `${next}px`
    ta.style.maxHeight = `${maxH}px`
    if (contentH > maxH) ta.style.overflowY = 'auto'
  }

  useLayoutEffect(() => {
    adjustHeight()
  }, [value, keyboardHeight])

  useEffect(() => {
    const onResize = () => adjustHeight()
    window.addEventListener('resize', onResize)

    // VisualViewport 변화에도 반응 (키보드 애니메이션 동안 값이 계속 변함)
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('resize', onResize)
      vv.addEventListener('scroll', onResize)
    }

    // CSS 변수 주입/레이아웃 안정화 직후 한 번 더
    const t = setTimeout(adjustHeight, 0)

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
      if (vv) {
        vv.removeEventListener('resize', onResize)
        vv.removeEventListener('scroll', onResize)
      }
    }
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
