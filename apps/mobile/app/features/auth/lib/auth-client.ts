import axios from 'axios'

function assertBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL
  if (!baseUrl) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL가 설정되지 않았습니다.')
  }

  return baseUrl
}

export const authClient = axios.create({
  baseURL: assertBaseUrl(),
  timeout: 20000,
})
