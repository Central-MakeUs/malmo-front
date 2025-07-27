import CheckedCircle from '@/assets/icons/checked-circle.svg'
import UncheckedCircle from '@/assets/icons/unchecked-circle.svg'
import { ChevronRight } from 'lucide-react'
import { Term, TermAgreements } from '../models/types'

interface TermsAgreementListProps {
  terms: Term[]
  agreements: TermAgreements
  onAllAgreementChange: () => void
  onAgreementChange: (termsId: number) => void
  onShowTerms: (termsId: number) => void
}

export function TermsAgreementList({
  terms,
  agreements = {}, // 기본값 제공
  onAllAgreementChange,
  onAgreementChange,
  onShowTerms,
}: TermsAgreementListProps) {
  // 모든 약관이 체크되었는지 확인
  const isAllChecked = terms.length > 0 && terms.every((term) => agreements && agreements[term.termsId])

  // 약관을 termsId 순서대로 정렬
  const sortedTerms = [...terms].sort((a, b) => a.termsId - b.termsId)

  return (
    <div className="mt-[76px] px-5">
      {/* 전체 동의 */}
      <div className="mb-4 flex h-[50px] w-full items-center px-5 py-3 pr-6">
        {isAllChecked ? (
          <CheckedCircle className="h-[22px] w-[22px] cursor-pointer" onClick={onAllAgreementChange} />
        ) : (
          <UncheckedCircle className="h-[22px] w-[22px] cursor-pointer" onClick={onAllAgreementChange} />
        )}
        <span className="body1-semibold ml-3 text-gray-iron-950">약관 전체 동의</span>
      </div>

      {/* 전체동의와 약관 사이 구분선 */}
      <div className="mx-5 border-t border-gray-iron-200"></div>

      {/* 개별 약관 */}
      <div className="mt-3 flex flex-col gap-3">
        {sortedTerms.map((term) => (
          <div key={term.termsId} className="flex h-[50px] w-full items-center justify-between px-5 py-3 pr-6">
            <div className="flex items-center">
              {agreements && agreements[term.termsId] ? (
                <CheckedCircle
                  className="h-[22px] w-[22px] cursor-pointer"
                  onClick={() => onAgreementChange(term.termsId)}
                />
              ) : (
                <UncheckedCircle
                  className="h-[22px] w-[22px] cursor-pointer"
                  onClick={() => onAgreementChange(term.termsId)}
                />
              )}
              <span className="body2-regular ml-3 text-gray-iron-950">
                {term.required ? `[필수] ${term.title}` : `[선택] ${term.title}`}
              </span>
            </div>
            {term.content && (
              <button onClick={() => onShowTerms(term.termsId)} className="flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-gray-iron-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
