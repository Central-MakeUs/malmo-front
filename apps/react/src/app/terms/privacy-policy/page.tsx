import termsService from '@/shared/services/terms.service'
import { TermsResponseDataTermsTypeEnum } from '@data/user-api-axios/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/terms/privacy-policy/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: termsListData, isLoading } = useQuery(termsService.termsListQuery())

  if (isLoading) {
    return <div>약관을 불러오는 중입니다...</div>
  }

  const filteredTerms = termsListData?.find(
    (term) => term.termsType === TermsResponseDataTermsTypeEnum.PrivacyPolicy
  )?.content

  if (!filteredTerms?.details) {
    return <div>약관 내용을 찾을 수 없습니다.</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">{filteredTerms?.title}</h2>

      <div className="space-y-4 overflow-y-auto p-6">
        {filteredTerms?.details.map((detail, index) => {
          if (detail.type === 'TITLE') {
            return (
              <h3 key={index} className="mt-4 text-lg font-semibold text-gray-700">
                {detail.content}
              </h3>
            )
          }
          return (
            <p key={index} className="leading-relaxed whitespace-pre-wrap text-gray-600">
              {detail.content}
            </p>
          )
        })}
      </div>
    </div>
  )
}
