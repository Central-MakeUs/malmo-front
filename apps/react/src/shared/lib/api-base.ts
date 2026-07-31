const rawApiBaseUrl = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '')

export function createApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
