import { createApiUrl } from '@/shared/lib/api-base'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const OAUTH_QUERY_KEYS = ['ticket', 'error', 'error_description'] as const

interface WebSessionTokens {
  grantType: string
  accessToken: string
  refreshToken: string
}

interface WebSignInResponse extends WebSessionTokens {
  memberState: string
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

function saveWebSession(tokens: WebSessionTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

async function requestWebSession<T>(path: string, body: object, requireData = true): Promise<T> {
  const response = await fetch(createApiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null
  if (!response.ok || !payload?.success || (requireData && !payload.data)) {
    throw new Error(payload?.message || '웹 로그인 요청을 처리하지 못했습니다.')
  }

  return payload.data as T
}

export function getWebAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getWebRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearWebSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getWebLoginTicket(): string | null {
  return new URLSearchParams(window.location.search).get('ticket')
}

export function getWebLoginError(): string | null {
  return new URLSearchParams(window.location.search).get('error')
}

export function clearWebLoginQuery() {
  const url = new URL(window.location.href)
  OAUTH_QUERY_KEYS.forEach((key) => url.searchParams.delete(key))
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

export async function exchangeWebLoginTicket(ticket: string): Promise<WebSignInResponse> {
  const session = await requestWebSession<WebSignInResponse>('/login/web/exchange', { ticket })
  saveWebSession(session)
  return session
}

export async function refreshWebSession(): Promise<string> {
  const refreshToken = getWebRefreshToken()
  if (!refreshToken) {
    throw new Error('웹 로그인 세션이 없습니다.')
  }

  try {
    const session = await requestWebSession<WebSessionTokens>('/login/web/refresh', { refreshToken })
    saveWebSession(session)
    return session.accessToken
  } catch (error) {
    clearWebSession()
    throw error
  }
}

export async function revokeWebSession(): Promise<void> {
  const refreshToken = getWebRefreshToken()

  try {
    if (refreshToken) {
      await requestWebSession<void>('/login/web/logout', { refreshToken }, false)
    }
  } finally {
    clearWebSession()
  }
}

export function startWebKakaoLogin(deviceId?: string) {
  const authorizeUrl = new URL(createApiUrl('/login/web/kakao/authorize'), window.location.origin)
  authorizeUrl.searchParams.set('returnUrl', new URL('/login', window.location.origin).toString())
  if (deviceId) {
    authorizeUrl.searchParams.set('deviceId', deviceId)
  }
  window.location.assign(authorizeUrl.toString())
}
