import { isAxiosError } from 'axios'

export function logAxiosError(error: unknown, context: string): void {
  if (isAxiosError(error) && error.response) {
    console.error(`${context} 응답 오류:`, error.response.data)
    console.error('상태 코드:', error.response.status)
    return
  }

  console.error(`${context} 오류:`, error)
}

export function formatAxiosError(error: unknown, fallbackMessage: string): string {
  if (isAxiosError(error) && error.response) {
    const backendMessage = error.response.data?.message || '서버 응답 오류'
    return `[${error.response.status}] ${backendMessage}`
  }

  if (error instanceof Error) {
    return `${fallbackMessage}: ${error.message}`
  }

  return `${fallbackMessage}: ${String(error)}`
}

export function formatUnknownError(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return `${fallbackMessage}: ${error.message}`
  }

  return `${fallbackMessage}: ${String(error)}`
}
