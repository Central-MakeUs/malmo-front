import { useLocation, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

export type PersonalityFlow = 'my-personality' | 'partner-personality' | 'chat-entry'

export const personalityFlowSearchSchema = z.object({
  flow: z.enum(['my-personality', 'partner-personality', 'chat-entry']).optional(),
  from: z.literal('profile').optional(),
})

export type PersonalityFlowSearch = z.infer<typeof personalityFlowSearchSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavigateFn = (opts: any) => void

interface FlowParams {
  flow: PersonalityFlow | undefined
  from: string | undefined
}

function navigateNext(navigate: NavigateFn, pathname: string, { flow, from }: FlowParams) {
  if (pathname.startsWith('/mbti')) {
    if (flow === 'chat-entry') {
      navigate({ to: '/my-attachment-select', search: { flow } })
    } else if (flow === 'my-personality') {
      navigate({ to: '/my-attachment-select', search: { flow, ...(from && { from }) } })
    }
    return
  }

  if (pathname.startsWith('/my-attachment-select')) {
    if (flow === 'chat-entry') {
      navigate({ to: '/my-result-preview', search: { flow } })
    } else if (from === 'profile') {
      navigate({ to: '/my-page/profile', replace: true })
    } else {
      navigate({ to: '/', replace: true })
    }
    return
  }

  if (pathname.startsWith('/my-result-preview')) {
    if (flow === 'chat-entry') {
      navigate({ to: '/partner-mbti', search: { flow } })
    }
    return
  }

  if (pathname.startsWith('/partner-mbti')) {
    if (flow === 'chat-entry') {
      navigate({ to: '/partner-attachment-select', search: { flow } })
    } else if (flow === 'partner-personality') {
      navigate({ to: '/partner-attachment-select', search: { flow, ...(from && { from }) } })
    }
    return
  }

  if (pathname.startsWith('/partner-attachment-select')) {
    if (flow === 'chat-entry') {
      navigate({ to: '/partner-result-preview', search: { flow }, replace: true })
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
    } else if (flow === 'chat-entry') {
      navigate({ to: '/my-result-preview', search: { flow }, replace: true })
    }
    return
  }
}

function navigateExit(navigate: NavigateFn, { from }: Pick<FlowParams, 'from'>) {
  if (from === 'profile' || from === 'my-page') {
    navigate({ to: '/my-page/profile', replace: true })
  } else if (from === 'my-result-preview') {
    navigate({ to: '/my-result-preview', replace: true })
  } else if (from === 'partner-result-preview') {
    navigate({ to: '/partner-result-preview', replace: true })
  } else {
    navigate({ to: '/', replace: true })
  }
}

export function usePersonalityFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const search = useSearch({ strict: false }) as FlowParams

  const next = () => {
    navigateNext(navigate, location.pathname, search)
  }

  const exit = () => {
    navigateExit(navigate, { from: search.from })
  }

  return { flow: search.flow, from: search.from, next, exit }
}
