import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ATTACHMENT_TYPE_DATA } from '../models/attachment-data'
import type { AttachmentTypeData } from '../models/types'
import type { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'
import { useAuth } from '../../auth/hooks/use-auth'

export interface UseAttachmentResultReturn {
  // 데이터 상태
  loveTypeCategory: MemberDataLoveTypeCategoryEnum | null
  anxietyRate: number | null
  avoidanceRate: number | null
  attachmentData: AttachmentTypeData | null
  loading: boolean
  error: string | null

  // 액션 함수들
  handleClose: () => void
  handleComplete: () => void
}

export function useAttachmentResult(): UseAttachmentResultReturn {
  const navigate = useNavigate()
  const { userInfo, refreshUserInfo, authenticated } = useAuth()

  // 내부 상태 관리
  const [internalLoading, setInternalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loveTypeCategory = userInfo.loveTypeCategory || null
  const anxietyRate = userInfo.anxietyRate || null
  const avoidanceRate = userInfo.avoidanceRate || null

  // 애착유형 데이터 계산
  const attachmentData = useMemo(() => {
    if (!loveTypeCategory) return null

    return ATTACHMENT_TYPE_DATA[loveTypeCategory] || null
  }, [loveTypeCategory])

  // 실제 로딩 상태 계산
  const loading = internalLoading || (!loveTypeCategory && authenticated && !error)

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      setInternalLoading(true)
      setError(null)

      await refreshUserInfo()
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setInternalLoading(false)
    }
  }

  // 필요한 애착 데이터가 없을 때 자동으로 새로고침
  useEffect(() => {
    if (authenticated && !loveTypeCategory && !error) {
      loadData()
    }
  }, [authenticated, loveTypeCategory, error])

  const handleClose = () => {
    navigate({ to: '/' })
  }

  const handleComplete = () => {
    navigate({ to: '/' })
  }

  return {
    // 데이터 상태
    loveTypeCategory,
    anxietyRate,
    avoidanceRate,
    attachmentData,
    loading,
    error,

    // 액션 함수들
    handleClose,
    handleComplete,
  }
}
