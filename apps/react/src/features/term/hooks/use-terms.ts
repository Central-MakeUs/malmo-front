import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import termsService from '@/shared/services/terms.service'
import { Term, TermAgreements } from '../models/types'
import { convertToTerms, findTermById } from '../lib/converters'

export function useTerms(initialAgreements: TermAgreements = {}) {
  const [termsData, setTermsData] = useState<Term[]>([])
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null)
  const [agreements, setAgreements] = useState<TermAgreements>(initialAgreements)

  // API로부터 약관 목록 데이터 가져오기
  const { data: termsListData, isLoading } = useQuery(termsService.termsListQuery())

  useEffect(() => {
    // API 응답 데이터가 있으면 내부 모델로 변환하여 상태 업데이트
    if (termsListData) {
      const convertedTerms = convertToTerms(termsListData)
      setTermsData(convertedTerms)

      // 초기 동의 상태 설정
      setAgreements((currentAgreements) => {
        const newAgreements = { ...currentAgreements }
        let hasUpdates = false
        convertedTerms.forEach((term) => {
          if (newAgreements[term.termsId] === undefined) {
            newAgreements[term.termsId] = false
            hasUpdates = true
          }
        })
        return hasUpdates ? newAgreements : currentAgreements
      })
    }
  }, [termsListData])

  // 약관 상세보기 모달 열기
  const handleShowTerms = (termsId: number) => {
    setSelectedTermId(termsId)
  }

  // 약관 상세보기 모달 닫기
  const handleCloseTerms = () => {
    setSelectedTermId(null)
  }

  // 선택된 약관의 제목과 상세 내용
  const selectedTermContent = useMemo(() => {
    if (selectedTermId === null) {
      return { title: '', details: null }
    }
    const selectedTerm = findTermById(termsData, selectedTermId)
    return {
      title: selectedTerm?.title || '',
      details: selectedTerm?.details || null,
    }
  }, [selectedTermId, termsData])

  // 필수 약관 모두 동의했는지 확인
  const isAllRequiredChecked = useMemo(() => {
    const requiredTerms = termsData.filter((term) => term.required)
    return requiredTerms.length > 0 && requiredTerms.every((term) => agreements[term.termsId])
  }, [agreements, termsData])

  // 모든 약관에 동의했는지 확인
  const isAllChecked = useMemo(() => {
    return termsData.length > 0 && termsData.every((term) => agreements[term.termsId])
  }, [agreements, termsData])

  // 전체 동의 처리
  const handleAllAgreements = () => {
    const newValue = !isAllChecked
    const newAgreements: TermAgreements = {}
    termsData.forEach((term) => {
      newAgreements[term.termsId] = newValue
    })
    setAgreements(newAgreements)
  }

  // 개별 약관 동의 처리
  const handleAgreement = (termsId: number) => {
    setAgreements((prev) => ({
      ...prev,
      [termsId]: !prev[termsId],
    }))
  }

  return {
    terms: termsData,
    isLoading,
    selectedTermId,
    selectedTermContent,
    agreements,
    isAllRequiredChecked,
    isAllChecked,
    handleShowTerms,
    handleCloseTerms,
    handleAllAgreements,
    handleAgreement,
  }
}
