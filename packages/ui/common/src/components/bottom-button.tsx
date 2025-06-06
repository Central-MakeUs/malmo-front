'use client'

import { Button } from './button'

interface BottomButtonProps {
  onClick?: () => void
  buttonText: string
  disabled?: boolean
  loading?: boolean
}

export function BottomButton(props: BottomButtonProps) {
  const { onClick, buttonText, disabled = false, loading = false } = props

  return (
    <div className="bottom-0 left-1/2 z-30 flex h-fit w-full items-center justify-center bg-white px-5 pb-4">
      <Button onClick={onClick} className="mx-auto w-full" disabled={disabled} size="lg" loading={loading}>
        {buttonText}
      </Button>
    </div>
  )
}
