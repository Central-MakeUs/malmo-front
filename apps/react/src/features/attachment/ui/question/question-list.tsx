import { QuestionItem } from './question-item'

interface Question {
  id: number
  content: string
}

interface QuestionListProps {
  questions: Question[]
  answers: Record<number, number>
  onSelectAnswer: (questionId: number, score: number) => void
  setQuestionRef: (index: number) => (el: HTMLDivElement | null) => void
  loading: boolean
  error: string | null
}

export function QuestionList({
  questions,
  answers,
  onSelectAnswer,
  setQuestionRef,
  loading,
  error,
}: QuestionListProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>질문을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="mt-[16px] px-[20px]">
      {questions.map((question, index) => {
        // 이전 질문들이 모두 답변되었는지 확인
        const isPreviousQuestionsAnswered = questions.slice(0, index).every((q) => answers[q.id] !== undefined)
        const isDisabled = !isPreviousQuestionsAnswered

        return (
          <QuestionItem
            key={question.id}
            question={question}
            answers={answers}
            onSelectAnswer={onSelectAnswer}
            isDisabled={isDisabled}
            ref={setQuestionRef(index)}
          />
        )
      })}
    </div>
  )
}
