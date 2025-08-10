import { useNavigate } from '@tanstack/react-router'

import { Term } from '@/features/term/models/types'
import { bridge } from '@/shared/bridge'

import { MY_PAGE_TERMS_TYPES, CONTACT_FORM_URL } from '../lib/constants'
import { MenuGroup, MenuItem } from '../models/types'

export function useMyPageMenu(terms: Term[], handleShowTerms: (termsId: number) => void) {
  const navigate = useNavigate()

  // 마이페이지에서 표시할 약관들만 타입으로 필터링
  const myPageTerms = terms.filter((term) => MY_PAGE_TERMS_TYPES.includes(term.type))

  // 전체 메뉴 아이템
  const menuItems: MenuItem[] = [
    // 기본 메뉴
    {
      label: '애착유형 검사하기',
      group: MenuGroup.BASIC,
      onClick: () => navigate({ to: '/attachment-test', search: { from: '/my-page' } }),
    },
    {
      label: '문의하기',
      group: MenuGroup.BASIC,
      onClick: () => bridge.openWebView(CONTACT_FORM_URL),
    },
    {
      label: '계정 관리',
      group: MenuGroup.BASIC,
      onClick: () => navigate({ to: '/my-page/account-settings' }),
    },
    // 약관
    ...myPageTerms.map((term) => ({
      label: term.title,
      group: MenuGroup.TERMS,
      onClick: () => handleShowTerms(term.termsId),
    })),
  ]

  return {
    menuItems,
  }
}
