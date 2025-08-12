import { ChevronRight } from 'lucide-react'

import CheckedCircle from '@/assets/icons/checked-circle.svg'
import UncheckedCircle from '@/assets/icons/unchecked-circle.svg'

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
  agreements = {},
  onAllAgreementChange,
  onAgreementChange,
  onShowTerms,
}: TermsAgreementListProps) {
  const isAllChecked = terms.length > 0 && terms.every((term) => agreements[term.termsId])
  const sortedTerms = [...terms].sort((a, b) => a.termsId - b.termsId)

  return (
    <div className="mt-[76px] px-5">
      <div
        className="mb-4 flex h-[50px] w-full cursor-pointer items-center py-3 pr-6"
        onClick={onAllAgreementChange}
        role="button"
        aria-label="약관 전체 동의"
      >
        {isAllChecked ? (
          <CheckedCircle className="pointer-events-none h-[22px] w-[22px]" />
        ) : (
          <UncheckedCircle className="pointer-events-none h-[22px] w-[22px]" />
        )}
        <span className="body1-semibold ml-3 text-gray-iron-950">약관 전체 동의</span>
      </div>

      <hr className="border-t border-gray-iron-200" />

      <div className="mt-3 flex flex-col gap-3">
        {sortedTerms.map((term) => (
          <div
            key={term.termsId}
            className="flex h-[50px] w-full items-center justify-between py-3 pr-1"
            onClick={() => {
              if (term.details && term.details.length > 0) onShowTerms(term.termsId)
            }}
            role={term.details && term.details.length > 0 ? 'button' : undefined}
            aria-label={term.details && term.details.length > 0 ? `${term.title} 상세 보기` : undefined}
          >
            <div className="flex items-center">
              {agreements[term.termsId] ? (
                <CheckedCircle
                  className="h-[22px] w-[22px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAgreementChange(term.termsId)
                  }}
                />
              ) : (
                <UncheckedCircle
                  className="h-[22px] w-[22px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAgreementChange(term.termsId)
                  }}
                />
              )}
              <span className="body2-regular ml-3 text-gray-iron-950">
                {term.required ? `[필수] ${term.title}` : `[선택] ${term.title}`}
              </span>
            </div>

            {term.details && term.details.length > 0 && <ChevronRight className="h-5 w-5 text-gray-iron-500" />}
          </div>
        ))}
      </div>
    </div>
  )
}
