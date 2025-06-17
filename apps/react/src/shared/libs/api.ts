import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL
const AUTH_ROUTE = '/auth'

interface QueueItem {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}

interface ApiOptions {
  throwError?: boolean
}

const defaultOptions = {
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 200000,
}

const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = AUTH_ROUTE
  }
}

const refreshToken = async (refreshInstance: AxiosInstance) => {
  return refreshInstance.post('/auth/refresh-token')
}

const processQueue = (failedQueue: QueueItem[], apiInstance: AxiosInstance, error: any = null) => {
  if (error) {
    failedQueue.forEach((promise) => {
      const errorObj = error instanceof Error ? error : new Error(error?.message ?? 'Unknown error')
      promise.reject(errorObj)
    })
  } else {
    failedQueue.forEach((promise) => {
      apiInstance(promise.config)
        .then((response) => promise.resolve(response))
        .catch((err) => {
          const errorObj = err instanceof Error ? err : new Error(err?.message ?? 'Request failed')
          promise.reject(errorObj)
        })
    })
  }
  return []
}

const handleTokenRefreshFailure = (
  apiInstance: AxiosInstance,
  failedQueue: QueueItem[],
  err: any,
  options?: ApiOptions
): QueueItem[] => {
  return apiInstance.delete('/admin/auth').then(() => {
    const newQueue = processQueue(failedQueue, apiInstance, err)

    if (!options?.throwError) {
      redirectToAuth()
    } else {
      throw err
    }

    return newQueue
  }) as unknown as QueueItem[]
}

const handleTokenRefreshSuccess = (failedQueue: QueueItem[], apiInstance: AxiosInstance): QueueItem[] => {
  return processQueue(failedQueue, apiInstance)
}

export function initApi(options?: ApiOptions): AxiosInstance {
  const apiInstance = axios.create(defaultOptions)
  const refreshInstance = axios.create(defaultOptions)

  function setupAuthInterceptor() {
    let isRefreshing = false
    let failedQueue: QueueItem[] = []

    const handleTokenRefresh = (config: AxiosRequestConfig) => {
      if (!isRefreshing) {
        isRefreshing = true

        refreshToken(refreshInstance)
          .then(() => {
            isRefreshing = false
            failedQueue = handleTokenRefreshSuccess(failedQueue, apiInstance)
          })
          .catch((err) => {
            isRefreshing = false
            failedQueue = handleTokenRefreshFailure(apiInstance, failedQueue, err, options)
          })
      }

      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: { ...config },
        })
      })
    }

    const handleAuthError = (error: any) => {
      const { config, response } = error

      const ensureErrorObject = (err: any) => (err instanceof Error ? err : new Error(err?.message ?? 'API Error'))

      if (!response) return Promise.reject(ensureErrorObject(error))

      const { status, data } = response

      if (status === 401 && data.message === 'invalid_access_token') {
        return handleTokenRefresh(config)
      }

      if (status === 403 && data.message === 'forbidden') {
        redirectToAuth()
        return Promise.reject(ensureErrorObject(error))
      }

      return Promise.reject(ensureErrorObject(error))
    }

    apiInstance.interceptors.response.use((response: AxiosResponse) => response, handleAuthError)
  }

  setupAuthInterceptor()
  return apiInstance
}

export default initApi()
