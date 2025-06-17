// packages/mocks/src/browser.ts
import { setupWorker } from 'msw/browser'
import { systemHandlers, dataHandlers } from './handlers'
import { authHandlers } from '../mock-api/admin/auth'

export const worker = setupWorker(...authHandlers, ...systemHandlers, ...dataHandlers)
