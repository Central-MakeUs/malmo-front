import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

interface ModalProps {
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOk?: () => void
  cancel?: boolean
  onCancel?: () => void
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  bottomText?: React.ReactNode
  handleBottom?: () => void
}

/**
 * AlertModal 컴포넌트
 *
 * @description
 * 이 컴포넌트는 제목, 설명, 아이콘을 커스터마이징할 수 있는 확인 또는 확인/취소 모달 창을 렌더링합니다.
 * 사용자는 액션을 확인하거나 취소할 수 있으며, 모달은 내부 상태로 제어되거나 부모 컴포넌트에서 전달된 `open`
 * 속성으로 제어될 수 있습니다. `onOk`과 `onCancel` 콜백은 모달에서의 사용자 상호작용을 처리하며,
 * `okText`와 `cancelText`를 통해 버튼 라벨을 커스터마이징할 수 있습니다. 취소 버튼의 위치는
 * `cancel` 속성을 통해 설정할 수 있습니다.
 *
 * @param title - 확인 모달의 제목으로, 문자열 또는 React 노드가 될 수 있습니다.
 * @param description - 모달의 설명 또는 메시지로, 문자열 또는 React 노드가 될 수 있습니다.
 * @param children - 모달을 트리거하는 요소로, 일반적으로 버튼 또는 클릭 가능한 요소입니다. 트리거 없이 상위에서 상태로 처리할 경우는, children이 없어도 됩니다.
 * @param defaultOpen - 모달이 기본적으로 열려 있는지 여부를 설정합니다.
 * @param open - 모달의 열림 상태를 외부에서 제어하기 위해, boolean 상태를 전달합니다. - onOpenChange에 setter 함수를 전달해야 합니다.
 * @param onOpenChange - 모달의 열림 상태가 변경될 때 호출되는 콜백 함수로, open의 setter 함수를 전달합니다. - open을 기입하는 경우 함께 사용합니다.
 * @param onOk - 확인 버튼이 클릭될 때 호출되는 콜백 함수입니다. - cancel의 값이 false인 경우, close trigger가 포함되어 있습니다.
 * @param cancel - 취소 버튼이 필요한 경우만 기입합니다. 취소 버튼의 위치를 결정합니다. (왼쪽 또는 오른쪽)
 * @param onCancel - 취소 버튼이 클릭될 때 호출되는 콜백 함수입니다. 특정 동작을 추가하고 싶을 때만 기입합니다.
 * @param okText - 확인 버튼의 라벨을 커스터마이징할 수 있는 속성입니다. - 기본값은 '확인'입니다.
 * @param cancelText - 취소 버튼의 라벨을 커스터마이징할 수 있는 속성입니다. - 기본값은 '취소'입니다.
 *
 * @returns - 이 컴포넌트는 커스터마이징된 확인 모달을 렌더링합니다.
 */

export function Modal(props: ModalProps) {
  const {
    title,
    description,
    children,
    onOk,
    cancel = false,
    onOpenChange,
    open,
    defaultOpen,
    okText,
    cancelText,
    onCancel,
    bottomText,
    handleBottom,
  } = props

  const [isOpen, setIsOpen] = useState(false)

  const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (onOk) onOk()

    // 취소 버튼이 있으면 Alert으로 닫지 않음, onAlert에 성공 시, 닫기 로직 넣기
    if (cancel) return
    if (onOpenChange) onOpenChange(false)
    else setIsOpen(false)
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (onCancel) onCancel()
    if (onOpenChange) onOpenChange(false)
    else setIsOpen(false)
  }

  return (
    <Dialog
      open={open ? open : isOpen}
      onOpenChange={onOpenChange ? onOpenChange : setIsOpen}
      defaultOpen={defaultOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="box-border flex w-[calc(100%-78px)] flex-col items-center bg-white px-0 py-[24px]">
        <DialogHeader className={cn('w-full px-[24px] pt-[24px]', description ? 'pb-[12px]' : 'pb-[24px]')}>
          <DialogTitle className="text-header-02 font-semibold text-black">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-05 text-center text-body-02">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="h-[24px] w-full" />
        <DialogFooter className="flex w-full flex-row gap-[10px] px-[20px] pt-[6px] pb-[24px] text-body-02 font-semibold">
          {cancel && (
            <Button
              className="border-gray-03 text-gray-03 w-full border bg-white px-0 py-[14px]"
              onClick={handleCancel}
            >
              {cancelText ? cancelText : '취소'}
            </Button>
          )}
          <Button className="w-full bg-primary-400 px-0 py-[14px]" onClick={handleOk}>
            {okText ? okText : '확인'}
          </Button>
        </DialogFooter>
        {bottomText && (
          <button className="fixed bottom-[-40px] text-body-02 font-medium text-white underline" onClick={handleBottom}>
            {bottomText}
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}
