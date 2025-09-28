import { useNavigate } from '@tanstack/react-router'

import { Term } from '@/features/term/models/types'
import { wrapWithTracking } from '@/shared/analytics'
import { BUTTON_NAMES, CATEGORIES } from '@/shared/analytics/constants'
import { bridge } from '@/shared/bridge'

import { MY_PAGE_TERMS_TYPES, CONTACT_FORM_URL } from '../lib/constants'
import { MenuGroup, MenuItem } from '../models/types'

export function useMyPageMenu(terms: Term[], handleShowTerms: (termsId: number) => void) {
  const navigate = useNavigate()

  // 마이페이지에서 표시할 약관들만 타입으로 필터링
  const myPageTerms = terms.filter((term) => MY_PAGE_TERMS_TYPES.includes(term.type))

  // 트래킹이 적용된 핸들러
  const handleShowTermsWithTracking = (termsId: number, termTitle: string) => {
    const buttonName = termTitle === '이용약관' ? BUTTON_NAMES.OPEN_TERMS_SERVICE : BUTTON_NAMES.OPEN_TERMS_PRIVACY
    wrapWithTracking(buttonName, CATEGORIES.PROFILE, () => handleShowTerms(termsId))()
  }

  // 전체 메뉴 아이템
  const menuItems: MenuItem[] = [
    // 기본 메뉴
    {
      label: '애착유형 검사하기',
      group: MenuGroup.BASIC,
      onClick: wrapWithTracking(BUTTON_NAMES.GO_ATTACHMENT_TEST, CATEGORIES.PROFILE, () =>
        navigate({ to: '/attachment-test', search: { from: '/my-page' } })
      ),
    },
    {
      label: '문의하기',
      group: MenuGroup.BASIC,
      onClick: wrapWithTracking('contact_support' as any, CATEGORIES.PROFILE, () =>
        bridge.openWebView(CONTACT_FORM_URL)
      ),
    },
    {
      label: '계정 관리',
      group: MenuGroup.BASIC,
      onClick: wrapWithTracking(BUTTON_NAMES.OPEN_ACCOUNT_SETTINGS, CATEGORIES.PROFILE, () =>
        navigate({ to: '/my-page/account-settings' })
      ),
    },
    // 약관
    ...myPageTerms.map((term) => ({
      label: term.title,
      group: MenuGroup.TERMS,
      onClick: () => handleShowTermsWithTracking(term.termsId, term.title),
    })),
  ]

  return {
    menuItems,
  }
}
