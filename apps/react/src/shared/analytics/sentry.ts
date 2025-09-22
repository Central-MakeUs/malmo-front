import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const IS_PRODUCTION = import.meta.env.PROD

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not provided, error monitoring disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_PRODUCTION ? 'production' : 'development',
    enabled: IS_PRODUCTION ? true : false,

    // 성능 모니터링
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,

    // 세션 리플레이
    replaysSessionSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // React 통합
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

    // 사용자 정보 수집
    sendDefaultPii: true,

    // 에러 필터링
    beforeSend(event, hint) {
      // 개발 환경에서는 콘솔에만 출력
      if (!IS_PRODUCTION) {
        console.group('Sentry Error (Dev Mode)')
        console.error('Error:', hint.originalException || hint.syntheticException)
        console.log('Event:', event)
        console.groupEnd()
        return null
      }

      // 중복 에러 필터링
      const error = hint.originalException as Error
      if (error?.stack?.includes('ChunkLoadError')) {
        return null
      }

      return event
    },
  })
}
