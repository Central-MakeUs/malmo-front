import { setupServer } from 'msw/node';
import { systemHandlers, dataHandlers } from './handlers';

export const server = setupServer(...systemHandlers, ...dataHandlers);
