import SpeechBubble from '@/assets/icons/speech_bubble.svg'

interface QuestionProgressProps {
  currentPage: number
  totalPages: number
  questionsPerPage: number
}

export function QuestionProgress({ currentPage, totalPages, questionsPerPage }: QuestionProgressProps) {
  return (
    <div className="mt-[12px] px-[20px]">
      {/* 말풍선 아이콘 */}
      <div className="flex gap-[2px]">
        {Array.from({ length: totalPages }).map((_, index) => (
          <SpeechBubble
            key={index}
            className={`h-[16px] w-[15px] ${
              index + 1 <= currentPage ? 'text-malmo-rasberry-500' : 'text-gray-iron-200'
            }`}
          />
        ))}
      </div>

      {/* 페이지 번호 */}
      <p className="title2-bold mt-[12px] text-gray-iron-950">
        페이지 {currentPage}/{totalPages}
      </p>

      {/* 안내 텍스트 */}
      <p className="body3-medium mt-[12px] text-gray-iron-500">
        {currentPage === 1 ? (
          <>
            총 <span className="text-malmo-rasberry-500">36개</span>의 질문에 솔직하게 응답해주시면
            <br />
            정확한 결과를 알려드릴게요!
          </>
        ) : (
          <>
            지금까지 <span className="text-malmo-rasberry-500"> 36개 중 {(currentPage - 1) * questionsPerPage}개</span>
            의 질문에
            <br />
            응답 완료했어요!
          </>
        )}
      </p>
    </div>
  )
}
