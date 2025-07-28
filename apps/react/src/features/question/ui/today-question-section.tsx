import { ChevronRight } from 'lucide-react'
import loveLetter from '@/assets/images/love-letter-home.png'
import { Badge } from '@/shared/ui'
import { formatDate } from '@/shared/utils'
import { QuestionData } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'

interface TodayQuestionSectionProps {
  todayQuestion?: QuestionData | null
  level?: number
}

export function TodayQuestionSection({ todayQuestion, level }: TodayQuestionSectionProps) {
  return (
    <div className="mt-8">
      <h2 className="heading2-semibold text-gray-iron-950">{level ? `${level}번째 마음 질문` : '오늘의 마음 질문'}</h2>

      {/* 질문 박스 */}
      <div className="mt-3 h-[178px] rounded-lg border border-gray-iron-200 bg-white">
        <div className="relative h-full">
          {/* 상단 컨텐츠 */}
          <div className="flex items-center justify-between pt-[18px] pr-[14px] pl-5">
            <div className="flex items-center">
              {/* 답변 상태 뱃지 */}
              {[
                { label: '나', answered: todayQuestion?.meAnswered, marginLeft: '' },
                { label: '연인', answered: todayQuestion?.partnerAnswered, marginLeft: 'ml-4' },
              ].map((user) => (
                <div key={user.label} className={`flex items-center ${user.marginLeft}`}>
                  <span className="body4-semibold text-gray-iron-950">{user.label}</span>
                  <Badge variant={user.answered ? 'completed' : 'required'} className="ml-[6px]">
                    {user.answered ? '답변 완료' : '답변 필요'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* 오른쪽 ChevronRight 아이콘 */}
            <ChevronRight className="h-5 w-5 text-gray-iron-600" />
          </div>

          {/* 구분선 */}
          <hr className="mx-3 mt-4 border-gray-iron-200" />

          {/* 질문 내용 */}
          <div className="mt-4 px-5 pr-[104px]">
            <h3 className="body1-semibold break-keep text-gray-iron-950">
              {todayQuestion?.content || '질문을 불러오는 중...'}
            </h3>
            <p className="label1-medium mt-2 text-gray-iron-500">
              {level && todayQuestion?.createdAt
                ? formatDate(todayQuestion.createdAt, 'YYYY년 MM월 DD일')
                : `${todayQuestion?.level}번째 질문`}
            </p>
          </div>

          {/* 러브레터 이미지 */}
          <div className={cn('absolute right-[24px] bottom-0', { hidden: level })}>
            <img src={loveLetter} alt="Love Letter" className="h-[75px] w-[84px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
