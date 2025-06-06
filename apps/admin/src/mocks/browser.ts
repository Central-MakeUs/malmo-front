import { worker } from '@data/utils/browser'

if (process.env.NODE_ENV === 'development') {
  worker.start();
}
