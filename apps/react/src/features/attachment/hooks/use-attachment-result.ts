import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ATTACHMENT_TYPE_DATA } from '../models/attachment-data'
import type { AttachmentTypeData } from '../models/types'
import memberService from '@/shared/services/member.service'
import type { GetLoveTypeData } from '@data/user-api-axios/api'

export interface UseAttachmentResultReturn {
  // 데이터 상태
  loveTypeData: GetLoveTypeData | null
  attachmentData: AttachmentTypeData | null
  loading: boolean
  error: string | null

  // 액션 함수들
  handleClose: () => void
  handleComplete: () => void
  retryLoad: () => void
}

export function useAttachmentResult(): UseAttachmentResultReturn {
  const navigate = useNavigate()

  // 상태 관리
  const [loveTypeData, setLoveTypeData] = useState<GetLoveTypeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attachmentData, setAttachmentData] = useState<AttachmentTypeData | null>(null)

  // API 데이터 가져오기
  const fetchLoveTypeData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await memberService.getLoveTypeInfo()

      if (response && response.data) {
        setLoveTypeData(response.data)

        // loveTypeCategory로 애착유형 데이터 매핑
        const categoryKey = response.data.loveTypeCategory
        if (categoryKey && ATTACHMENT_TYPE_DATA[categoryKey]) {
          setAttachmentData(ATTACHMENT_TYPE_DATA[categoryKey])
        }
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoveTypeData()
  }, [])

  const handleClose = () => {
    navigate({ to: '/' })
  }

  const handleComplete = () => {
    navigate({ to: '/' })
  }

  const retryLoad = () => {
    fetchLoveTypeData()
  }

  return {
    // 데이터 상태
    loveTypeData,
    attachmentData,
    loading,
    error,

    // 액션 함수들
    handleClose,
    handleComplete,
    retryLoad,
  }
}
