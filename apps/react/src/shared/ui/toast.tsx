import React, { ReactNode } from 'react'
import { Toaster, toast as sonnerToast } from 'sonner'
import ErrorIcon from '@/assets/icons/toast/error.svg'
import SuccessIcon from '@/assets/icons/toast/success.svg'

// 전역 토스트 함수
export const toast = {
  error: (message: string) => {
    sonnerToast.custom(() => (
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-[30px] bg-[#18181B]/85 py-[11px] pr-6 pl-5">
          <ErrorIcon className="h-5 w-5" />
          <span className="body3-medium ml-[10px] text-gray-iron-100">{message}</span>
        </div>
      </div>
    ))
  },
  success: (message: string) => {
    sonnerToast.custom(() => (
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-[30px] bg-[#18181B]/85 py-[11px] pr-6 pl-5">
          <SuccessIcon className="h-5 w-5" />
          <span className="body3-medium ml-[10px] text-gray-iron-100">{message}</span>
        </div>
      </div>
    ))
  },
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        duration={2000}
        visibleToasts={1}
        richColors={false}
        closeButton={false}
        expand={false}
        toastOptions={{
          unstyled: true,
          style: {
            top: '35px',
          },
        }}
      />
    </>
  )
}

// Hook for components
export function useToast() {
  return { showToast: toast }
}
