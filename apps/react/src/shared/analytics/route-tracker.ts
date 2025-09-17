import { trackPageView } from './amplitude'
import { CATEGORIES, PAGE_NAMES, type Category, type PageName } from './constants'

import type { AnyRouter } from '@tanstack/react-router'

const PAGE_MAPPING: Record<string, { name: PageName; category: Category }> = {
  '/': { name: PAGE_NAMES.HOME, category: CATEGORIES.MAIN },
  '/intro': { name: PAGE_NAMES.INTRO, category: CATEGORIES.AUTH },
  '/login': { name: PAGE_NAMES.LOGIN, category: CATEGORIES.AUTH },
  '/partner-status': { name: PAGE_NAMES.PARTNER_STATUS, category: CATEGORIES.MAIN },
  '/onboarding/terms': { name: PAGE_NAMES.ONBOARDING_TERMS, category: CATEGORIES.ONBOARDING },
  '/onboarding/nickname': { name: PAGE_NAMES.ONBOARDING_NICKNAME, category: CATEGORIES.ONBOARDING },
  '/onboarding/anniversary': { name: PAGE_NAMES.ONBOARDING_ANNIVERSARY, category: CATEGORIES.ONBOARDING },
  '/onboarding/my-code': { name: PAGE_NAMES.ONBOARDING_MY_CODE, category: CATEGORIES.ONBOARDING },
  '/onboarding/partner-code': { name: PAGE_NAMES.ONBOARDING_PARTNER_CODE, category: CATEGORIES.ONBOARDING },
  '/onboarding/complete': { name: PAGE_NAMES.ONBOARDING_COMPLETE, category: CATEGORIES.ONBOARDING },
  '/chat': { name: PAGE_NAMES.CHAT_MAIN, category: CATEGORIES.CHAT },
  '/chat/loading': { name: PAGE_NAMES.CHAT_LOADING, category: CATEGORIES.CHAT },
  '/chat/result': { name: PAGE_NAMES.CHAT_RESULT, category: CATEGORIES.CHAT },
  '/history': { name: PAGE_NAMES.HISTORY_MAIN, category: CATEGORIES.MAIN },
  '/history/delete': { name: PAGE_NAMES.HISTORY_DELETE, category: CATEGORIES.MAIN },
  '/attachment-test': { name: PAGE_NAMES.ATTACHMENT_INTRO, category: CATEGORIES.ATTACHMENT },
  '/attachment-test/question': { name: PAGE_NAMES.ATTACHMENT_QUESTION, category: CATEGORIES.ATTACHMENT },
  '/attachment-test/result/my': { name: PAGE_NAMES.ATTACHMENT_RESULT_MY, category: CATEGORIES.ATTACHMENT },
  '/attachment-test/result/partner': { name: PAGE_NAMES.ATTACHMENT_RESULT_PARTNER, category: CATEGORIES.ATTACHMENT },
  '/question': { name: PAGE_NAMES.QUESTION_CALENDAR, category: CATEGORIES.QUESTION },
  '/question/write-answer': { name: PAGE_NAMES.QUESTION_WRITE, category: CATEGORIES.QUESTION },
  '/question/see-answer': { name: PAGE_NAMES.QUESTION_ANSWER, category: CATEGORIES.QUESTION },
  '/my-page': { name: PAGE_NAMES.MYPAGE_MAIN, category: CATEGORIES.PROFILE },
  '/my-page/profile': { name: PAGE_NAMES.MYPAGE_PROFILE, category: CATEGORIES.PROFILE },
  '/my-page/couple-management': { name: PAGE_NAMES.MYPAGE_COUPLE, category: CATEGORIES.PROFILE },
  '/my-page/account-settings': { name: PAGE_NAMES.MYPAGE_SETTINGS, category: CATEGORIES.PROFILE },
  '/terms/privacy-policy': { name: PAGE_NAMES.TERMS_PRIVACY, category: CATEGORIES.PROFILE },
}

export function setupRouteTracking(router: AnyRouter) {
  router.subscribe('onBeforeLoad', (event) => {
    const pathname = event.toLocation.pathname
    const pageInfo = PAGE_MAPPING[pathname]

    if (pageInfo) {
      trackPageView(pageInfo.name, pageInfo.category, pathname)
    } else {
      console.warn(`[Analytics] Unmapped route: ${pathname}`)
      trackPageView(PAGE_NAMES.HOME, CATEGORIES.MAIN, pathname)
    }
  })
}
