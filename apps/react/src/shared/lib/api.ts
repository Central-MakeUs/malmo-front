import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { trackError } from '../analytics'
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
        const errorMessage = `[${response.status}] ${originalRequest?.url || 'Unknown URL'}: ${
          response.data?.message || response.statusText || 'Unknown error'
        }`

        if (response.status >= 500) {
          trackError('api_error', errorMessage)
        } else if (response.status === 404) {
          trackError('not_found', errorMessage)
        } else if (response.status === 403) {
          trackError('forbidden', errorMessage)
        } else if (response.status === 401) {
          // 401은 토큰 갱신 로직이 있으므로 갱신 실패 시에만 추적
        }
      } else if (error.code === 'ECONNABORTED') {
        trackError('timeout', `Request timeout: ${originalRequest?.url || 'Unknown URL'}`)
      } else if (!navigator.onLine) {
        trackError('network_error', 'No internet connection')
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
          trackError('token_refresh_failed', 'Failed to refresh authentication token')
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
