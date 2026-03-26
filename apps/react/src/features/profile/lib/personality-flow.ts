import { useLocation, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

export type PersonalityFlow = 'my-personality' | 'partner-personality' | 'full-flow'

export const personalityFlowSearchSchema = z.object({
  flow: z.enum(['my-personality', 'partner-personality', 'full-flow']).optional(),
  from: z.enum(['profile', 'profile-result']).optional(),
})

export type PersonalityFlowSearch = z.infer<typeof personalityFlowSearchSchema>

type NavigateFn = ReturnType<typeof useNavigate>
type RouterLike = { history: { back: () => void; go: (index: number) => void } }

interface FlowParams {
  flow: PersonalityFlow | undefined
  from: 'profile' | 'profile-result' | 'my-page' | 'my-result-preview' | 'partner-result-preview' | undefined
}

function navigateNext(navigate: NavigateFn, router: RouterLike, pathname: string, { flow, from }: FlowParams) {
  if (pathname.startsWith('/mbti')) {
    if (flow === 'full-flow') {
      navigate({ to: '/my-attachment-select', search: { flow } })
    } else if (flow === 'my-personality') {
      navigate({
        to: '/my-attachment-select',
        search: { flow, ...((from === 'profile' || from === 'profile-result') && { from }) },
      })
    }
    return
  }

  if (pathname.startsWith('/my-attachment-select')) {
    if (flow === 'full-flow') {
      navigate({ to: '/my-result-preview', search: { flow } })
    } else if (from === 'profile-result') {
      navigate({ to: '/attachment-test/result/my', search: { from: 'my-page' }, replace: true })
    } else if (from === 'profile') {
      router.history.go(-2)
    } else {
      navigate({ to: '/attachment-test/result/my', replace: true })
    }
    return
  }

  if (pathname.startsWith('/my-result-preview')) {
    if (flow === 'full-flow') {
      navigate({ to: '/partner-mbti', search: { flow } })
    }
    return
  }

  if (pathname.startsWith('/partner-mbti')) {
    if (flow === 'full-flow') {
      navigate({ to: '/partner-attachment-select', search: { flow } })
    } else if (flow === 'partner-personality') {
      navigate({ to: '/partner-attachment-select', search: { flow, ...(from === 'profile' && { from }) } })
    }
    return
  }

  if (pathname.startsWith('/partner-attachment-select')) {
    if (flow === 'full-flow') {
      navigate({ to: '/partner-result-preview', search: { flow } })
    } else if (from === 'profile-result') {
      navigate({ to: '/attachment-test/result/partner', search: { from: 'my-page' }, replace: true })
    } else if (from === 'profile') {
      router.history.go(-2)
    } else {
      navigate({ to: '/attachment-test/result/partner', replace: true })
    }
    return
  }

  if (pathname.startsWith('/partner-result-preview')) {
    navigate({ to: '/', replace: true })
    return
  }

  if (pathname.startsWith('/attachment-test/question')) {
    if (flow === 'my-personality') {
      navigate({
        to: '/attachment-test/result/my',
        search: { from: from === 'profile' || from === 'profile-result' ? 'my-page' : undefined },
        replace: true,
      })
    } else if (flow === 'full-flow') {
      navigate({ to: '/attachment-test/result/my', search: { from: 'my-result-preview', flow }, replace: true })
    }
    return
  }
}

function navigateExit(navigate: NavigateFn, router: RouterLike, { from, flow }: Pick<FlowParams, 'from' | 'flow'>) {
  if (from === 'profile' || from === 'profile-result') {
    router.history.back()
  } else if (from === 'my-page') {
    router.history.go(-2)
  } else if (from === 'my-result-preview') {
    navigate({ to: '/my-result-preview', search: { ...(flow && { flow }) }, replace: true })
  } else if (from === 'partner-result-preview') {
    navigate({ to: '/partner-result-preview', replace: true })
  } else {
    navigate({ to: '/', replace: true })
  }
}

export function getMissingPersonalityFlow(userInfo: {
  loveTypeCategory?: string | null
  partnerLoveTypeCategory?: string | null
}): PersonalityFlow {
  const myMissing = !userInfo.loveTypeCategory
  const partnerMissing = !userInfo.partnerLoveTypeCategory
  return myMissing && partnerMissing ? 'full-flow' : myMissing ? 'my-personality' : 'partner-personality'
}

export function usePersonalityFlow() {
  const navigate = useNavigate()
  const router = useRouter()
  const location = useLocation()
  const search = useSearch({ strict: false }) as FlowParams

  const next = () => {
    navigateNext(navigate, router, location.pathname, search)
  }

  const exit = () => {
    navigateExit(navigate, router, { from: search.from, flow: search.flow })
  }

  return { flow: search.flow, from: search.from, next, exit }
}
