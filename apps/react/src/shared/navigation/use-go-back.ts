import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

import { backWithHistory } from './back'

export function useGoBack() {
  const router = useRouter()

  return useCallback(() => {
    backWithHistory(router)
  }, [router])
}
