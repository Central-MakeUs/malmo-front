import { worker } from '@data/utils/browser'
const NODE_ENV = import.meta.env.VITE_NODE_ENV

if (NODE_ENV === 'development') {
  worker.start()
}
