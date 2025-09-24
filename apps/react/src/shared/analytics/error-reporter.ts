import * as Sentry from '@sentry/react'

import { trackError } from './index'

import type { ErrorProperties } from './types'

export interface ErrorContext {
  source: 'api' | 'ui' | 'router' | 'bridge' | 'global'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  feature?: string
  component?: string
  endpoint?: string
  route?: string
  userAgent?: string
  userId?: string

  statusCode?: number
  responseData?: any
  errorType?: string
}

class ErrorReporter {
  static report(error: Error, context: ErrorContext) {
    try {
      // 1. Sentry로 전송
      this.sendToSentry(error, context)

      // 2. Amplitude로 전송
      this.sendToAmplitude(error, context)

      // 3. 개발환경에서 콘솔 출력
      if (!import.meta.env.PROD) {
        console.group(`Error Report [${context.source}]`)
        console.error('Error:', error)
        console.log('Context:', context)
        console.groupEnd()
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
      console.error('Original error:', error)
    }
  }

  private static sendToSentry(error: Error, context: ErrorContext) {
    if (!import.meta.env.VITE_SENTRY_DSN) return

    Sentry.withScope((scope) => {
      // 태그 설정
      scope.setTag('source', context.source)
      scope.setTag('severity', context.severity || 'medium')

      if (context.feature) scope.setTag('feature', context.feature)
      if (context.component) scope.setTag('component', context.component)

      // 컨텍스트 정보 설정
      scope.setContext('error_context', {
        endpoint: context.endpoint,
        route: context.route,
        userAgent: context.userAgent || navigator.userAgent,
        timestamp: new Date().toISOString(),
      })

      // 사용자 정보 설정
      if (context.userId) {
        scope.setUser({ id: context.userId })
      }

      // 추가 데이터
      scope.setExtra('additional_context', {
        feature: context.feature,
        component: context.component,
        endpoint: context.endpoint,
        route: context.route,
        statusCode: context.statusCode,
        responseData: context.responseData,
        errorType: context.errorType,
      })

      // 에러 전송
      Sentry.captureException(error)
    })
  }

  private static sendToAmplitude(error: Error, context: ErrorContext) {
    const errorMessage = this.formatErrorForAmplitude(error, context)
    const errorType = this.getAmplitudeErrorType(context)

    trackError(errorType, errorMessage)
  }

  private static formatErrorForAmplitude(error: Error, context: ErrorContext): string {
    const parts = [`[${context.source}]`, error.message]

    if (context.endpoint) parts.push(`URL: ${context.endpoint}`)
    if (context.route) parts.push(`Route: ${context.route}`)
    if (context.component) parts.push(`Component: ${context.component}`)

    return parts.join(' | ')
  }

  private static getAmplitudeErrorType(context: ErrorContext): ErrorProperties['error_type'] {
    switch (context.source) {
      case 'api':
        if (context.errorType === 'timeout') return 'timeout'
        if (context.errorType === 'token_refresh_failed') return 'token_refresh_failed'
        if (context.statusCode === 404) return 'not_found'
        if (context.statusCode === 403) return 'forbidden'
        return 'api_error'
      case 'router':
        return 'runtime_error'
      case 'ui':
        return 'validation_error'
      case 'bridge':
        return 'network_error'
      case 'global':
        return 'runtime_error'
      default:
        return 'unknown_error'
    }
  }
}

export { ErrorReporter }
