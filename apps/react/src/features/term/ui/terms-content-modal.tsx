import { ChevronLeft } from 'lucide-react'
import { TermDetail } from '../models/types'
import { TermsDetailsResponseDataTypeEnum } from '@data/user-api-axios/api'
import { DetailHeaderBar } from '@/shared/ui/header-bar'

interface TermsContentModalProps {
  title: string
  details: TermDetail[] | null
  onClose: () => void
}

export function TermsContentModal({ title, details, onClose }: TermsContentModalProps) {
  const renderDetailContent = (detail: TermDetail) => {
    switch (detail.type) {
      case TermsDetailsResponseDataTypeEnum.Title:
        return <h3 className="title2-bold mb-5">{detail.content}</h3>
      case TermsDetailsResponseDataTypeEnum.Subtitle:
        return <p className="heading1-bold mb-[5px]">{detail.content}</p>
      case TermsDetailsResponseDataTypeEnum.Content:
        return <p className="body2-regular mb-4">{detail.content}</p>
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
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <DetailHeaderBar onBackClick={onClose} />
      <div className="flex-1 overflow-y-auto px-5">
        <h2 className="title1-bold mt-10 pb-[26px] text-gray-iron-950">{title}</h2>

        <div className="text-gray-iron-950">
          {details?.map((detail, index) => <div key={index}>{renderDetailContent(detail)}</div>)}
        </div>
      </div>
    </div>
  )
}
