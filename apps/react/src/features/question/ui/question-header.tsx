import { PastAnswerData } from '@data/user-api-axios/api'

import { Badge } from '@/shared/ui'
import { formatDate } from '@/shared/utils'

export const QuestionHeader = ({ data }: { data?: PastAnswerData }) => (
  <div>
    <Badge variant="rasberry" className="mx-5 mt-6 mb-2">
      {data?.level}번째 마음 질문
    </Badge>
    <p className="heading1-bold mb-3 pr-15 pl-6 break-keep">{data?.content}</p>
    <p className="body4-medium mb-8 pl-6 text-gray-iron-500">{formatDate(data?.createdAt, 'YYYY년 MM월 DD일')}</p>

    <hr className="mx-5 mb-5 h-1 rounded-[1px] border-gray-iron-200" />
  </div>
)
