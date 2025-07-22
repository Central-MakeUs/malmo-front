import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isWebView } from '../utils/webview'
import { bridge } from '../bridge'

// TODO: 동적으로 개발 환경에 따라 BASE_URL을 설정할 수 있도록 개선
const BASE_URL = '/api'
const AUTH_ROUTE = '/login'

interface QueueItem {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}

interface ApiOptions {
  throwError?: boolean
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
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      const { response } = error

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
