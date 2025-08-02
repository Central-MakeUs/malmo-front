import { useState, useEffect, useRef } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import loveTypeService from '@/shared/services/love-type.service'
import memberService from '@/shared/services/member.service'
import { QUESTION_CONFIG } from '../models/constants'
import type { LoveTypeQuestionData, LoveTypeTestResult } from '@data/user-api-axios/api'
import { useAuth } from '@/features/auth'
import { toast } from '@/shared/components/toast'

// 질문 타입 정의
interface Question {
  id: number
  content: string
}

// 첫 번째 질문으로 스크롤하는 유틸 함수
const scrollToFirstQuestion = (questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>) => {
  setTimeout(() => {
    const firstQuestionElement = questionRefs.current[0]
    if (firstQuestionElement) {
      firstQuestionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, 100)
}

export interface UseAttachmentQuestionsResult {
  // 질문 데이터
  questions: Question[]
  loading: boolean
  error: string | null

  // 페이지 관련
  currentPage: number
  totalPages: number
  currentQuestions: Question[]

  // 답변 관련
  answers: Record<number, number>
  isCurrentPageComplete: boolean

  // 제출 관련
  isSubmitting: boolean

  // 액션 함수들
  handleGoBack: () => void
  handleNext: () => void
  handleSelectAnswer: (questionId: number, score: number) => void

  // 질문 ref 관련
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  setQuestionRef: (index: number) => (el: HTMLDivElement | null) => void
}

export function useAttachmentQuestions(): UseAttachmentQuestionsResult {
  const navigate = useNavigate()
  const router = useRouter()
  const auth = useAuth()

  // 질문 목록 상태
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false) // 제출 완료 상태 추가

  // 결과 제출 뮤테이션
  const serviceOptions = memberService.submitLoveTypeTestMutation()
  const submitLoveTypeTestMutation = useMutation({
    ...serviceOptions,
    onSuccess: () => {
      // 2초 후 결과 페이지로 이동
      setTimeout(() => {
        navigate({ to: '/attachment-test/result/my' })
      }, QUESTION_CONFIG.SUBMISSION_DELAY)
    },
    onError: (error: any) => {
      // 서비스단 에러 처리 먼저 실행
      serviceOptions.onError?.()
      // 앱단 에러 처리: 제출 상태 리셋
      setIsSubmitted(false)
    },
  })

  // 페이지 관련 상태
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = QUESTION_CONFIG.TOTAL_PAGES
  const questionsPerPage = QUESTION_CONFIG.QUESTIONS_PER_PAGE

  // 사용자 답변 상태
  const [answers, setAnswers] = useState<Record<number, number>>({})

  // 질문 ref 배열
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  // 질문 ref 설정 함수
  const setQuestionRef = (index: number) => (el: HTMLDivElement | null) => {
    questionRefs.current[index] = el
  }

  // 현재 페이지에 표시할 질문 목록
  const currentQuestions = questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)

  // 질문 데이터 가져오기
  const { data: questionsData, isLoading: loading, error: queryError } = useQuery(loveTypeService.questionsQuery())

  useEffect(() => {
    if (questionsData && questionsData.data && Array.isArray(questionsData.data.list)) {
      // API 응답 구조에 맞게 데이터 매핑
      setQuestions(
        questionsData.data.list.map((item: LoveTypeQuestionData) => ({
          id: item.questionNumber || 0,
          content: item.content || '',
        }))
      )
      setError(null)
    } else if (queryError) {
      setError('질문을 불러오는데 실패했습니다.')
    }
  }, [questionsData, queryError])

  // 이전 페이지로 이동
  const handleGoBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      scrollToFirstQuestion(questionRefs)
    } else {
      router.history.back()
    }
  }

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      scrollToFirstQuestion(questionRefs)
    } else {
      // 마지막 페이지에서는 결과 제출
      handleSubmit()
    }
  }

  // 답변 선택 처리
  const handleSelectAnswer = (questionId: number, score: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: score,
    }))

    // 다음 질문으로 포커스 이동 (같은 페이지 내에서만)
    setTimeout(() => {
      const currentQuestionIndex = currentQuestions.findIndex((q) => q.id === questionId)
      const nextQuestionIndex = currentQuestionIndex + 1

      if (nextQuestionIndex < currentQuestions.length) {
        // 같은 페이지 내 다음 질문으로 스크롤
        const nextQuestionElement = questionRefs.current[nextQuestionIndex]
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    }, 200)
  }

  // 결과 제출
  const handleSubmit = () => {
    // 이미 제출했거나 제출 중이면 중복 실행 방지
    if (submitLoveTypeTestMutation.isPending || isSubmitted) return

    // 모든 질문에 답변했는지 확인
    const answeredQuestions = Object.keys(answers).length
    if (answeredQuestions < questions.length) {
      toast.error(`아직 ${questions.length - answeredQuestions}개의 질문에 답변하지 않았습니다.`)
      return
    }

    setIsSubmitted(true)

    // 답변 형식 변환
    const formattedAnswers: LoveTypeTestResult[] = Object.entries(answers).map(([questionId, score]) => ({
      questionId: parseInt(questionId),
      score,
    }))

    // 결과 제출
    submitLoveTypeTestMutation.mutate(formattedAnswers)
  }

  // 현재 페이지의 모든 질문에 답변했는지 확인
  const isCurrentPageComplete = currentQuestions.every((q) => answers[q.id] !== undefined)

  return {
    // 질문 데이터
    questions,
    loading,
    error,

    // 페이지 관련
    currentPage,
    totalPages,
    currentQuestions,

    // 답변 관련
    answers,
    isCurrentPageComplete,

    // 제출 관련
    isSubmitting: (() => {
      const result = submitLoveTypeTestMutation.isPending || isSubmitted
      return result
    })(),

    // 액션 함수들
    handleGoBack,
    handleNext,
    handleSelectAnswer,

    // 질문 ref 관련
    questionRefs,
    setQuestionRef,
  }
}
