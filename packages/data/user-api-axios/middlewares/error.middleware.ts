import { ErrorContext, Middleware, ResponseContext } from '../api'
import { HttpError } from '@data/utils/http.error'

export class ErrorMiddleware implements Middleware {
  constructor(private readonly accessTokenErrorHandler: (status: number, data?: any) => void | Promise<void>) {}

  async post(context: ResponseContext): Promise<any> {
    if (!context.response.ok) {
      const status = context.response.status
      const body = await context.response
        .clone()
        .json()
        .catch(() => null)
      await this.accessTokenErrorHandler(context.response.status, body)
      throw new HttpError(status, body?.message || context.response.statusText, body)
    }
  }

  async onError(context: ErrorContext): Promise<void> {
    const status = context.response?.status || 500
    const message = context.error?.['message'] || 'unknown error'
    throw new HttpError(status, message)
  }
}
