// packages/mocks/src/browser.ts
import { setupWorker } from 'msw/browser';
import { systemHandlers, dataHandlers } from './handlers';

export const worker = setupWorker(...systemHandlers, ...dataHandlers);