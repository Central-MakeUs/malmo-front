import { useState, useEffect, useMemo } from 'react'
import termsService from '@/shared/services/terms.service'
import { Term, TermAgreements } from '../models/types'
import { convertToTerms, findTermById } from '../lib/converters'

export function useTerms(initialAgreements: TermAgreements = {}) {
  // 약관 데이터 상태
  const [termsData, setTermsData] = useState<Term[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 약관 모달 상태 관리
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null)

  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState<TermAgreements>(initialAgreements)

  // API에서 약관 데이터 가져오기
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true)
        const terms = await termsService.findAll()
        const convertedTerms = convertToTerms(terms)
        setTermsData(convertedTerms)

        // 약관 데이터가 로드되면 누락된 약관에 대한 기본값 설정
        if (convertedTerms && convertedTerms.length > 0) {
          const updatedAgreements = { ...agreements }
          let hasUpdates = false

          convertedTerms.forEach((term) => {
            if (updatedAgreements[term.termsId] === undefined) {
              updatedAgreements[term.termsId] = false
              hasUpdates = true
            }
          })

          if (hasUpdates) {
            setAgreements(updatedAgreements)
          }
        }
      } catch {
        // TODO: 에러 처리
      } finally {
        setIsLoading(false)
      }
    }

    fetchTerms()
  }, [])

  // 약관 내용 보기
  const handleShowTerms = (termsId: number) => {
    setSelectedTermId(termsId)
  }

  // 약관 모달 닫기
  const handleCloseTerms = () => {
    setSelectedTermId(null)
  }

  // 선택된 약관 내용 가져오기
  const selectedTermContent = useMemo(() => {
    if (selectedTermId === null || !termsData || !Array.isArray(termsData)) {
      return { title: '', content: '' }
    }

    const selectedTerm = findTermById(termsData, selectedTermId)

    if (selectedTerm) {
      return {
        title: selectedTerm.title || '',
        content: selectedTerm.content || '',
      }
    }

    return { title: '', content: '' }
  }, [selectedTermId, termsData])

  // 필수 약관 모두 체크되었는지 확인
  const isAllRequiredChecked = useMemo(() => {
    if (!termsData || termsData.length === 0) return false

    const requiredTerms = termsData.filter((term) => term.required)
    return requiredTerms.every((term) => agreements[term.termsId])
  }, [agreements, termsData])

  // 모든 약관 체크되었는지 확인
  const isAllChecked = useMemo(() => {
    if (!termsData || termsData.length === 0) return false

    return termsData.every((term) => agreements[term.termsId])
  }, [agreements, termsData])

  // 전체 동의 처리
  const handleAllAgreements = () => {
    const newValue = !isAllChecked
    const newAgreements = { ...agreements }

    if (termsData) {
      termsData.forEach((term) => {
        newAgreements[term.termsId] = newValue
      })
    }

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
