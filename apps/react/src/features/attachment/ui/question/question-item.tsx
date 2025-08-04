import { SCORE_RANGE } from '../../models/constants'

interface QuestionItemProps {
  question: {
    id: number
    content: string
  }
  answers: Record<number, number>
  onSelectAnswer: (questionId: number, score: number) => void
  isDisabled: boolean
  ref?: (el: HTMLDivElement | null) => void
}

export function QuestionItem({ question, answers, onSelectAnswer, isDisabled, ref }: QuestionItemProps) {
  const questionNumber = question.id

  return (
    <div className="mb-[32px] py-[20px]" ref={ref}>
      {/* 질문 번호 */}
      <p className={`heading2-bold mb-[2px] pl-1 ${isDisabled ? 'text-gray-iron-400' : 'text-gray-iron-950'}`}>
        Q{questionNumber}
      </p>

      {/* 질문 텍스트 */}
      <div className="w-[284px] pl-1">
        <p
          className={`text-[16px] font-semibold break-keep ${isDisabled ? 'text-gray-iron-400' : 'text-gray-iron-950'}`}
        >
          {question.content}
        </p>
      </div>

      {/* 답변 선택 영역 */}
      <div className="mt-[24px]">
        {/* 원형 선택 버튼들과 라벨 */}
        <div className="relative flex h-[88px] items-start justify-center rounded-[10px] bg-gray-neutral-50">
          <div className="flex">
            {Array.from({ length: SCORE_RANGE.MAX }, (_, scoreIndex) => {
              const score = scoreIndex + 1
              const sizes = ['36', '28', '24', '28', '36'] // 각 점수별 크기
              const topPositions = ['16px', '20px', '22px', '20px', '16px'] // 각 원의 상단 위치

              const size = sizes[scoreIndex] || '32'
              const isSelected = answers[question.id] === score

              return (
                <div
                  key={`${question.id}-${score}`}
                  className="relative flex flex-col items-center"
                  style={{
                    marginRight: scoreIndex === 4 ? '0px' : scoreIndex === 0 || scoreIndex === 3 ? '24px' : '36px',
                  }}
                >
                  <button
                    className="relative rounded-full bg-white transition-all duration-200"
                    style={{
                      marginTop: topPositions[scoreIndex],
                      width: `${size}px`,
                      height: `${size}px`,
                      boxShadow: isDisabled
                        ? 'inset 0 0 0 1px #E4E4E7'
                        : isSelected
                          ? 'inset 0 0 0 2px #EC4665'
                          : 'inset 0 0 0 1px #D1D1D6',
                    }}
                    onClick={() => !isDisabled && onSelectAnswer(question.id, score)}
                    disabled={isDisabled}
                  >
                    {isSelected && !isDisabled && (
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-malmo-rasberry-500"
                        style={{
                          width: `${parseInt(size) - 12}px`,
                          height: `${parseInt(size) - 12}px`,
                        }}
                      />
                    )}
                  </button>
                  {/* 첫 번째와 마지막 원에만 텍스트 표시 */}
                  {(scoreIndex === 0 || scoreIndex === 4) && (
                    <span
                      className={`body4-medium mt-[4px] ${isDisabled ? 'text-gray-iron-400' : 'text-gray-iron-800'}`}
                    >
                      {scoreIndex === 0 ? '전혀 아니다' : '매우 그렇다'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
