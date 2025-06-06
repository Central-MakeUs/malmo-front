export class HttpError extends Error {
  override name: 'HttpError' = 'HttpError' as const

  constructor(
    public status: number,
    public message: string,
    public data?: Record<string, any>
  ) {
    super(message)
  }
}
