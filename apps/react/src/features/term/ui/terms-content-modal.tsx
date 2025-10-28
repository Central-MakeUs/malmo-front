import { TermsDetailsResponseDataTypeEnum } from '@data/user-api-axios/api'

import { Screen } from '@/shared/layout/screen'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

import { TermDetail } from '../models/types'

interface TermsContentModalProps {
  title: string
  details: TermDetail[] | null
  onClose: (evnet) => void
}

export function TermsContentModal({ title, details, onClose }: TermsContentModalProps) {
  const renderDetailContent = (detail: TermDetail) => {
    switch (detail.type) {
      case TermsDetailsResponseDataTypeEnum.Title:
        return <h3 className="title2-bold mb-5">{detail.content}</h3>
      case TermsDetailsResponseDataTypeEnum.Subtitle:
        return <p className="heading1-bold mb-[5px]">{detail.content}</p>
      case TermsDetailsResponseDataTypeEnum.Content:
        return <p className="body2-regular mb-4 whitespace-pre-line">{detail.content}</p>
      default:
        return (
          <div
            className="body-2-regular mb-4 text-gray-iron-950"
            dangerouslySetInnerHTML={{ __html: detail.content }}
          />
        )
    }
  }

  return (
    <Screen>
      <Screen.Header behavior="overlay" className="z-50">
        <DetailHeaderBar onBackClick={onClose} />
      </Screen.Header>

      <Screen.Content className="flex flex-1 flex-col overflow-y-auto px-5 pb-[var(--safe-bottom)]">
        <h2 className="title1-bold mt-10 pb-[26px] text-gray-iron-950">{title}</h2>

        <div className="text-gray-iron-950">
          {details?.map((detail, index) => <div key={index}>{renderDetailContent(detail)}</div>)}
        </div>
      </Screen.Content>
    </Screen>
  )
}
