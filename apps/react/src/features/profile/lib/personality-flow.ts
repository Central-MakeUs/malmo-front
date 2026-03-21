import { useLocation, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

export type PersonalityFlow = 'my-personality' | 'partner-personality' | 'full-flow'

export const personalityFlowSearchSchema = z.object({
  flow: z.enum(['my-personality', 'partner-personality', 'full-flow']).optional(),
  from: z.literal('profile').optional(),
})

export type PersonalityFlowSearch = z.infer<typeof personalityFlowSearchSchema>

type NavigateFn = ReturnType<typeof useNavigate>
type RouterLike = { history: { back: () => void } }

interface FlowParams {
  flow: PersonalityFlow | undefined
  from: 'profile' | 'my-page' | 'my-result-preview' | 'partner-result-preview' | undefined
}

function navigateNext(navigate: NavigateFn, router: RouterLike, pathname: string, { flow, from }: FlowParams) {
  if (pathname.startsWith('/mbti')) {
    if (flow === 'full-flow') {
      navigate({ to: '/my-attachment-select', search: { flow } })
    } else if (flow === 'my-personality') {
      navigate({ to: '/my-attachment-select', search: { flow, ...(from === 'profile' && { from }) } })
    }
    return
  }

  if (pathname.startsWith('/my-attachment-select')) {
    if (flow === 'full-flow') {
      navigate({ to: '/my-result-preview', search: { flow } })
    } else if (from === 'profile') {
      router.history.back()
    } else {
      navigate({ to: '/', replace: true })
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
    } else if (from === 'profile') {
      navigate({ to: '/my-page/profile', replace: true })
    } else {
      navigate({ to: '/', replace: true })
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
        search: { from: from === 'profile' ? 'my-page' : undefined },
        replace: true,
      })
    } else if (flow === 'full-flow') {
      navigate({ to: '/attachment-test/result/my', search: { from: 'my-result-preview', flow }, replace: true })
    }
    return
  }
}

function navigateExit(navigate: NavigateFn, router: RouterLike, { from, flow }: Pick<FlowParams, 'from' | 'flow'>) {
  if (from === 'profile' || from === 'my-page') {
    router.history.back()
  } else if (from === 'my-result-preview') {
    navigate({ to: '/my-result-preview', search: { ...(flow && { flow }) }, replace: true })
  } else if (from === 'partner-result-preview') {
    navigate({ to: '/partner-result-preview', replace: true })
  } else {
    navigate({ to: '/', replace: true })
  }
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
