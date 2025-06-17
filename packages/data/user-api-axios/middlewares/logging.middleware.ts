import { ErrorContext, Middleware, RequestContext, ResponseContext } from '@data/user-api/api'
import logger from '@system/logger'

const isDevelopment = process.env.NODE_ENV !== 'production'

export class LoggerMiddleware implements Middleware {
  async pre(context: RequestContext): Promise<void> {
    if (isDevelopment) {
      const { method, body } = context.init

      let pathname: string
      try {
        pathname = new URL(context.url).pathname
      } catch (e) {
        pathname = context.url
      }
      logger.debug(`Starting request: ${method} ${pathname} ${body ? ` - ${body}` : ''}`)
    }
  }

  async post(context: ResponseContext): Promise<void> {
    if (isDevelopment) {
      const { method } = context.init
      const status = context.response.status
      const url = new URL(context.url)
      const clonedResponse = context.response.clone()
      const body = await clonedResponse.json().catch(() => null)
      const logBody = `${body ? ` - ${JSON.stringify(body, null, 2)}` : ''}`
      if (context.response.ok) {
        logger.debug(`Received response: ${method} ${url.pathname} ${context.response.status} ${logBody}`)
      } else {
        logger.debug(`Error response: ${method} ${url.pathname} ${status} ${logBody}`)
      }
    }
  }

  async onError(context: ErrorContext): Promise<void> {
    if (isDevelopment) {
      const { method } = context.init
      const url = new URL(context.url)
      logger.error(`Error during request: ${method} ${url.pathname}`, context.error)
    }
  }
}
