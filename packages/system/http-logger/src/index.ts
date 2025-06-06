import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { get, set } from 'es-toolkit/compat'
import logger from '@system/logger'

export interface HttpLoggerOptions {
  prefix: string
  level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  includeRequestBody?: boolean
  includeResponseBody?: boolean
  includeHeaders?: boolean
  filters?: {
    urls?: RegExp[]
    methods?: string[]
    status?: number[]
  }
  error?: {
    responseHandler?: (response: AxiosResponse) => AxiosResponse
    errorHandler?: (error: any) => any
  }
  maxBodyLength?: number
  sensitiveHeaders?: string[]
  sensitiveFields?: string[]
}

export interface RequestMetadata extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number
  }
}

export class HttpLogger {
  private readonly defaultOptions: HttpLoggerOptions = {
    prefix: 'HTTP',
    level: 'info',
    includeRequestBody: true,
    includeResponseBody: false,
    includeHeaders: false,
    maxBodyLength: 1000,
    sensitiveHeaders: ['authorization', 'cookie', 'x-api-key'],
  }

  private readonly options: HttpLoggerOptions

  constructor(private readonly config: HttpLoggerOptions) {
    this.options = { ...this.defaultOptions, ...config }
  }

  createAxiosLogger() {
    const responseHandler = {
      onSuccess: (response: AxiosResponse) => {
        const requestConfig = response.config as RequestMetadata
        const duration = new Date().getTime() - (requestConfig.metadata?.startTime || 0)
        if (this.shouldLog(requestConfig, response.status)) {
          const message = this.formatLogMessage(
            requestConfig.method || 'UNKNOWN',
            this.getFullUrl(requestConfig),
            response.status,
            duration,
            {
              level: this.options.level,
              requestHeaders: this.options.includeHeaders ? requestConfig.headers : undefined,
              requestBody: this.options.includeRequestBody ? requestConfig.data : undefined,
              responseHeaders: this.options.includeHeaders ? response.headers : undefined,
              responseBody: this.options.includeResponseBody ? response.data : undefined,
            }
          )

          this.logWithLevel('info', message, {
            httpService: this.options.prefix,
            requestId: response.headers['Request-Id'],
            status: response.status,
            url: requestConfig.url || '',
            method: requestConfig.method || '',
          })
        }
        return response
      },
      onError: (e: AxiosError) => {
        const requestConfig = e.config as RequestMetadata
        const duration = new Date().getTime() - (requestConfig?.metadata?.startTime || 0)

        if (this.shouldLog(requestConfig, e.response?.status)) {
          const message = this.formatLogMessage(
            requestConfig?.method || 'UNKNOWN',
            this.getFullUrl(requestConfig),
            e.response?.status,
            duration,
            {
              level: 'error',
              requestHeaders: this.options.includeHeaders ? requestConfig?.headers : undefined,
              requestBody: this.options.includeRequestBody ? requestConfig?.data : undefined,
              responseHeaders: this.options.includeHeaders ? e.response?.headers : undefined,
              responseBody: e.response?.data,
              includeResponseBody: true,
            }
          )
          this.logWithLevel('error', message, {
            httpService: this.options.prefix,
            requestId: e.response?.headers['Request-Id'],
            status: e.response?.status || 0,
            url: requestConfig.url || '',
            method: requestConfig.method || '',
          })
        }
        this.options.error?.errorHandler?.(e)
        throw e
      },
    }

    return {
      requestInterceptor: (config: InternalAxiosRequestConfig) => {
        const requestConfig = config as RequestMetadata
        requestConfig.metadata = { startTime: new Date().getTime() }
        return requestConfig
      },

      responseInterceptor: async (response: AxiosResponse) => {
        try {
          const res = this.options.error?.responseHandler?.(response) || response
          return responseHandler.onSuccess(res)
        } catch (responseError: any) {
          const errorMessage = responseError.message || 'API Error'
          const error = new Error(errorMessage) as AxiosError
          error.response = response
          error.config = response.config
          try {
            responseHandler.onError(error as AxiosError)
          } catch (e) {
            throw responseError
          }
        }
      },
      errorInterceptor: responseHandler.onError,
    }
  }

  applyToAxiosInstance(instance: AxiosInstance): AxiosInstance {
    const logger = this.createAxiosLogger()
    instance.interceptors.request.use(logger.requestInterceptor)
    instance.interceptors.response.use(logger.responseInterceptor as any, logger.errorInterceptor)
    return instance
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized = { ...headers }
    this.options.sensitiveHeaders?.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '******'
      }
    })

    return sanitized
  }

  private sanitizeBody(body: any): string {
    let sanitized: any
    if (typeof body === 'string') {
      sanitized = JSON.parse(body)
    } else {
      sanitized = structuredClone(body)
    }
    if (!this.options.sensitiveFields) {
      return this.truncateBody(sanitized)
    }
    this.options.sensitiveFields?.forEach((path) => {
      if (get(sanitized, path) !== undefined) {
        set(sanitized, path, '******')
      }
    })
    return this.truncateBody(sanitized)
  }

  private truncateBody(body: any): string {
    const stringified = JSON.stringify(body)
    if (stringified.length <= (this.options.maxBodyLength || 1000)) {
      return stringified
    }
    return stringified.substring(0, this.options.maxBodyLength) + '... (truncated)'
  }

  private shouldLog(config: InternalAxiosRequestConfig, status?: number): boolean {
    const { filters } = this.options
    if (!filters) return true

    if (filters.urls && !filters.urls.some((pattern) => pattern.test(config.url || ''))) {
      return false
    }

    if (filters.methods && !filters.methods.includes(config.method?.toUpperCase() || '')) {
      return false
    }

    return !(status && filters.status && !filters.status.includes(status))
  }

  private getFullUrl(config: InternalAxiosRequestConfig): string {
    const baseURL = config.baseURL || ''
    const url = config.url || ''

    if (baseURL && !url.startsWith('http')) {
      return baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '')
    }

    return url
  }

  private formatLogMessage(
    method: string,
    url: string,
    status: number | undefined,
    duration: number,
    extras: {
      level: HttpLoggerOptions['level']
      includeResponseBody?: boolean
      requestHeaders?: Record<string, any>
      requestBody?: any
      responseHeaders?: unknown
      responseBody?: any
    }
  ): string {
    const includeResponseBody = extras.includeResponseBody ?? this.options.includeResponseBody
    const prefix = `[${this.options.prefix}]`
    const parts = [prefix, `"${method.toUpperCase()}`, `${url}"`, status, `${duration}ms`]

    if (this.options.includeHeaders) {
      if (extras.requestHeaders) {
        parts.push('\n' + 'Request Headers:', JSON.stringify(this.sanitizeHeaders(extras.requestHeaders), null, 2))
      }
    }

    if (this.options.includeRequestBody && extras.requestBody) {
      parts.push('-', this.sanitizeBody(extras.requestBody))
    }

    if (includeResponseBody && extras.responseBody) {
      parts.push('\n' + 'Response Body:', this.sanitizeBody(extras.responseBody))
    }

    return parts.filter(Boolean).join(' ')
  }

  private logWithLevel(
    level: HttpLoggerOptions['level'],
    message: string,
    data: {
      httpService: string
      requestId: string
      status: number
      url: string
      method: string
    }
  ) {
    switch (level) {
      case 'debug':
        logger.debug(message, data)
        break
      case 'warn':
        logger.warn(message, data)
        break
      case 'error':
        logger.error(message, data)
        break
      case 'fatal':
        logger.fatal(message, data)
        break
      case 'info':
      default:
        logger.log(message, data)
    }
  }
}
