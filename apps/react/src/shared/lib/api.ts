import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { ErrorReporter } from '../analytics'
import { bridge } from '../bridge'
import { isWebView } from '../utils/webview'

const BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'
const AUTH_ROUTE = '/login'

interface QueueItem {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
  config: AxiosRequestConfig
}

export const defaultOptions = {
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 200000,
}

const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = AUTH_ROUTE
  }
}

const extractFeatureFromUrl = (url?: string): string => {
  if (!url) return 'unknown'

  if (url.includes('/auth/')) return 'authentication'
  if (url.includes('/chat/')) return 'chat'
  if (url.includes('/member/')) return 'member'
  if (url.includes('/question/')) return 'question'
  if (url.includes('/love-type/')) return 'attachment'
  if (url.includes('/couple/')) return 'couple'

  return 'api'
}

export function initApi(): AxiosInstance {
  const apiInstance = axios.create(defaultOptions)

  apiInstance.interceptors.request.use(
    async (config) => {
      console.log('API Request:', {
        url: config.url,
        payload: config.data,
      })

      let accessToken: string | null = null

      if (isWebView()) {
        const tokenData = await bridge.getAuthToken()
        accessToken = tokenData.accessToken
      } else {
        accessToken = localStorage.getItem('accessToken')
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  let isRefreshing = false
  let failedQueue: QueueItem[] = []

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else if (token && promise.config.headers) {
        promise.config.headers['Authorization'] = `Bearer ${token}`
        apiInstance(promise.config)
          .then((response) => promise.resolve(response))
          .catch((err) => promise.reject(err))
      }
    })
    failedQueue = []
  }

  apiInstance.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.data)
      return response
    },
    async (error) => {
      const originalRequest = error.config

      const { response } = error

      // API 에러 추적
      if (response) {
        const severity =
          response.status >= 500
            ? 'critical'
            : response.status === 404
              ? 'medium'
              : response.status === 403
                ? 'high'
                : 'medium'

        ErrorReporter.report(error, {
          source: 'api',
          endpoint: originalRequest?.url,
          severity,
          feature: extractFeatureFromUrl(originalRequest?.url),
          statusCode: response.status,
          responseData: response.data,
        })
      } else if (error.code === 'ECONNABORTED') {
        ErrorReporter.report(error, {
          source: 'api',
          endpoint: originalRequest?.url,
          severity: 'medium',
          errorType: 'timeout',
        })
      } else if (!navigator.onLine) {
        ErrorReporter.report(error, {
          source: 'api',
          severity: 'high',
          errorType: 'network_offline',
        })
      }

      if (response?.status === 401 && isWebView() && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { accessToken: newAccessToken } = await bridge.notifyTokenExpired()

          if (!newAccessToken) {
            throw new Error('Webview bridge: Failed to receive a new token.')
          }
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)

          return apiInstance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error, null)
          ErrorReporter.report(refreshError as Error, {
            source: 'api',
            severity: 'critical',
            errorType: 'token_refresh_failed',
            feature: 'authentication',
          })
          redirectToAuth()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // if (response?.status === 403 && response.data?.message === 'forbidden') {
      //   redirectToAuth()
      // }

      return Promise.reject(error)
    }
  )

  return apiInstance
}

export default initApi()
